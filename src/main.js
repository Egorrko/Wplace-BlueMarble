/** @file The main file. Everything in the userscript is executed from here.
 * @since 0.0.0
 */

import Overlay from './Overlay.js';
import Observers from './observers.js';
import ApiManager from './apiManager.js';
import TemplateManager from './templateManager.js';
import Choices from './choices-esm.min.js';
import { consoleLog, consoleWarn, selectAllCoordinateInputs } from './utils.js';

const name = GM_info.script.name.toString(); // Name of userscript
const version = GM_info.script.version.toString(); // Version of userscript
const consoleStyle = 'color: cornflowerblue;'; // The styling for the console logs
const data_url = 'https://raw.githubusercontent.com/Egorrko/wplace-templates/refs/heads/main/';
const telemetry_url = 'https://freakland.egorrko.ru';
// const telemetry_url = 'http://localhost:4000';
export { telemetry_url };

/** Injects code into the client
 * This code will execute outside of TamperMonkey's sandbox
 * @param {*} callback - The code to execute
 * @since 0.11.15
 */
function inject(callback) {
    const script = document.createElement('script');
    script.setAttribute('bm-name', name); // Passes in the name value
    script.setAttribute('bm-cStyle', consoleStyle); // Passes in the console style value
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
}

/** What code to execute instantly in the client (webpage) to spy on fetch calls.
 * This code will execute outside of TamperMonkey's sandbox.
 * @since 0.11.15
 */
inject(() => {

  const script = document.currentScript; // Gets the current script HTML Script Element
  const name = script?.getAttribute('bm-name') || 'Blue Marble'; // Gets the name value that was passed in. Defaults to "Blue Marble" if nothing was found
  const consoleStyle = script?.getAttribute('bm-cStyle') || ''; // Gets the console style value that was passed in. Defaults to no styling if nothing was found
  const fetchedBlobQueue = new Map(); // Blobs being processed

  window.addEventListener('message', (event) => {
    const { source, endpoint, blobID, blobData, blink } = event.data;

    const elapsed = Date.now() - blink;

    // Since this code does not run in the userscript, we can't use consoleLog().
    console.groupCollapsed(`%c${name}%c: ${fetchedBlobQueue.size} Recieved IMAGE message about blob "${blobID}"`, consoleStyle, '');
    console.log(`Blob fetch took %c${String(Math.floor(elapsed/60000)).padStart(2,'0')}:${String(Math.floor(elapsed/1000) % 60).padStart(2,'0')}.${String(elapsed % 1000).padStart(3,'0')}%c MM:SS.mmm`, consoleStyle, '');
    console.log(fetchedBlobQueue);
    console.groupEnd();

    // The modified blob won't have an endpoint, so we ignore any message without one.
    if ((source == 'blue-marble') && !!blobID && !!blobData && !endpoint) {

      const callback = fetchedBlobQueue.get(blobID); // Retrieves the blob based on the UUID

      // If the blobID is a valid function...
      if (typeof callback === 'function') {

        callback(blobData); // ...Retrieve the blob data from the blobID function
      } else {
        // ...else the blobID is unexpected. We don't know what it is, but we know for sure it is not a blob. This means we ignore it.

        consoleWarn(`%c${name}%c: Attempted to retrieve a blob (%s) from queue, but the blobID was not a function! Skipping...`, consoleStyle, '', blobID);
      }

      fetchedBlobQueue.delete(blobID); // Delete the blob from the queue, because we don't need to process it again
    }
  });

  // Spys on "spontaneous" fetch requests made by the client
  const originalFetch = window.fetch; // Saves a copy of the original fetch

  // Overrides fetch
  window.fetch = async function(...args) {

    const response = await originalFetch.apply(this, args); // Sends a fetch
    const cloned = response.clone(); // Makes a copy of the response

    // Retrieves the endpoint name. Unknown endpoint = "ignore"
    const endpointName = ((args[0] instanceof Request) ? args[0]?.url : args[0]) || 'ignore';

    // Check Content-Type to only process JSON
    const contentType = cloned.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {


      // Since this code does not run in the userscript, we can't use consoleLog().
      console.log(`%c${name}%c: Sending JSON message about endpoint "${endpointName}"`, consoleStyle, '');

      // Sends a message about the endpoint it spied on
      cloned.json()
        .then(jsonData => {
          window.postMessage({
            source: 'blue-marble',
            endpoint: endpointName,
            jsonData: jsonData
          }, '*');
        })
        .catch(err => {
          console.error(`%c${name}%c: Failed to parse JSON: `, consoleStyle, '', err);
        });
    } else if (contentType.includes('image/') && (!endpointName.includes('openfreemap') && !endpointName.includes('maps'))) {
      // Fetch custom for all images but opensourcemap

      const blink = Date.now(); // Current time

      const blob = await cloned.blob(); // The original blob

      // Since this code does not run in the userscript, we can't use consoleLog().
      console.log(`%c${name}%c: ${fetchedBlobQueue.size} Sending IMAGE message about endpoint "${endpointName}"`, consoleStyle, '');

      // Returns the manipulated blob
      return new Promise((resolve) => {
        const blobUUID = crypto.randomUUID(); // Generates a random UUID

        // Store the blob while we wait for processing
        fetchedBlobQueue.set(blobUUID, (blobProcessed) => {
          // The response that triggers when the blob is finished processing

          // Creates a new response
          resolve(new Response(blobProcessed, {
            headers: cloned.headers,
            status: cloned.status,
            statusText: cloned.statusText
          }));

          // Since this code does not run in the userscript, we can't use consoleLog().
          console.log(`%c${name}%c: ${fetchedBlobQueue.size} Processed blob "${blobUUID}"`, consoleStyle, '');
        });

        window.postMessage({
          source: 'blue-marble',
          endpoint: endpointName,
          blobID: blobUUID,
          blobData: blob,
          blink: blink
        });
      }).catch(exception => {
        const elapsed = Date.now();
        console.error(`%c${name}%c: Failed to Promise blob!`, consoleStyle, '');
        console.groupCollapsed(`%c${name}%c: Details of failed blob Promise:`, consoleStyle, '');
        console.log(`Endpoint: ${endpointName}\nThere are ${fetchedBlobQueue.size} blobs processing...\nBlink: ${blink.toLocaleString()}\nTime Since Blink: ${String(Math.floor(elapsed/60000)).padStart(2,'0')}:${String(Math.floor(elapsed/1000) % 60).padStart(2,'0')}.${String(elapsed % 1000).padStart(3,'0')} MM:SS.mmm`);
        console.error(`Exception stack:`, exception);
        console.groupEnd();
      });

      // cloned.blob().then(blob => {
      //   window.postMessage({
      //     source: 'blue-marble',
      //     endpoint: endpointName,
      //     blobData: blob
      //   }, '*');
      // });
    }

    return response; // Returns the original response
  };
});

// Imports the CSS file from dist folder on github
GM_addStyle(INJECTED_CSS);

// Imports the Roboto Mono font family
var stylesheetLink = document.createElement('link');
stylesheetLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap';
stylesheetLink.rel = 'preload';
stylesheetLink.as = 'style';
stylesheetLink.onload = function () {
  this.onload = null;
  this.rel = 'stylesheet';
};
document.head?.appendChild(stylesheetLink);

// CONSTRUCTORS
const observers = new Observers(); // Constructs a new Observers object
const overlayMain = new Overlay(name, version); // Constructs a new Overlay object for the main overlay
const overlayTabTemplate = new Overlay(name, version); // Constructs a Overlay object for the template tab
const templateManager = new TemplateManager(name, version, overlayMain); // Constructs a new TemplateManager object
const apiManager = new ApiManager(templateManager); // Constructs a new ApiManager object

overlayMain.setApiManager(apiManager); // Sets the API manager

const storageTemplates = JSON.parse(GM_getValue('bmTemplates', '{}'));
console.log(storageTemplates);
templateManager.importJSON(storageTemplates); // Loads the templates

const userSettings = JSON.parse(GM_getValue('bmUserSettings', '{}')); // Loads the user settings
console.log(userSettings);
console.log(Object.keys(userSettings).length);
if (Object.keys(userSettings).length == 0) {
  const uuid = crypto.randomUUID(); // Generates a random UUID
  console.log(uuid);
  GM.setValue('bmUserSettings', JSON.stringify({
    'uuid': uuid
  }));
}
// setInterval(() => apiManager.sendHeartbeat(version), 1000 * 60 * 30); // Sends a heartbeat every 30 minutes
// setInterval(() => apiManager.sendOnlineStatus(version), 1000 * 10); // Sends online status every 10 seconds
setInterval(() => {
  const userPixels = JSON.parse(GM_getValue('bmUserPixels', '{}'));
  if (Object.keys(userPixels).length == 0) {
    return;
  }
  overlayMain.updateInnerHTML('bm-user-reload', 'Восстановление зарядов через: <b>' + Math.ceil(userPixels.cooldownMs * (userPixels.max - userPixels.count) / 1000) + '</b> мин ');
}, 10_000);
buildOverlayMain(); // Builds the main overlay

overlayMain.handleDrag('#bm-overlay', '#bm-bar-drag'); // Creates dragging capability on the drag bar for dragging the overlay

apiManager.spontaneousResponseListener(overlayMain); // Reads spontaneous fetch responces

observeBlack(); // Observes the black palette color

consoleLog(`%c${name}%c (${version}) userscript has loaded!`, 'color: cornflowerblue;', '');

/** Observe the black color, and add the "Move" button.
 * @since 0.66.3
 */
function observeBlack() {
  const observer = new MutationObserver((mutations, observer) => {

    const black = document.querySelector('#color-1'); // Attempt to retrieve the black color element for anchoring

    if (!black) {return;} // Black color does not exist yet. Kills iteself

    let move = document.querySelector('#bm-button-move'); // Tries to find the move button

    // If the move button does not exist, we make a new one
    if (!move) {
      move = document.createElement('button');
      move.id = 'bm-button-move';
      move.textContent = 'Move ↑';
      move.className = 'btn btn-soft';
      move.onclick = function() {
        const roundedBox = this.parentNode.parentNode.parentNode.parentNode; // Obtains the rounded box
        const shouldMoveUp = (this.textContent == 'Move ↑');
        roundedBox.parentNode.className = roundedBox.parentNode.className.replace(shouldMoveUp ? 'bottom' : 'top', shouldMoveUp ? 'top' : 'bottom'); // Moves the rounded box to the top
        roundedBox.style.borderTopLeftRadius = shouldMoveUp ? '0px' : 'var(--radius-box)';
        roundedBox.style.borderTopRightRadius = shouldMoveUp ? '0px' : 'var(--radius-box)';
        roundedBox.style.borderBottomLeftRadius = shouldMoveUp ? 'var(--radius-box)' : '0px';
        roundedBox.style.borderBottomRightRadius = shouldMoveUp ? 'var(--radius-box)' : '0px';
        this.textContent = shouldMoveUp ? 'Move ↓' : 'Move ↑';
      }

      // Attempts to find the "Paint Pixel" element for anchoring
      const paintPixel = black.parentNode.parentNode.parentNode.parentNode.querySelector('h2');

      paintPixel.parentNode?.appendChild(move); // Adds the move button
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/** Deploys the overlay to the page with minimize/maximize functionality.
 * Creates a responsive overlay UI that can toggle between full-featured and minimized states.
 * 
 * Parent/child relationships in the DOM structure below are indicated by indentation.
 * @since 0.58.3
 */
function buildOverlayMain() {
  let isMinimized = false; // Overlay state tracker (false = maximized, true = minimized)
  // Load last saved coordinates (if any)
  let savedCoords = {};
  try { savedCoords = JSON.parse(GM_getValue('bmCoords', '{}')) || {}; } catch (_) { savedCoords = {}; }
  const updateSelector = async (selector) => {
    const input = await fetch(`${data_url}/data.json`);
    const input_json = await input.json();

    GM.setValue('bmOptions', JSON.stringify(input_json));

    overlayMain.handleSelectorStatus(input_json.images);

    loadSelectedTemplate(selector);
    overlayMain.handleDisplayStatus(`Скачиваем шаблон! Ожидайте...`);
  }

  const loadSelectedTemplate = async (selector) => {
    const selected_template = JSON.parse(selector.value);
    console.log("selected_template", selected_template);
    const input = await fetch(`${data_url}${selected_template.path}`);
    const input_blob = await input.blob();
    const name = selected_template.name;

    templateManager.createTemplate(input_blob, selected_template.id, name, [selected_template.coords.tx, selected_template.coords.ty, selected_template.coords.px, selected_template.coords.py]);
    overlayMain.handleDisplayStatus(`Загружаем шаблон "${name}"! Ожидайте...`);
  }
  
  overlayMain.addDiv({'id': 'bm-overlay', 'style': 'top: 10px; right: 75px;'})
    .addDiv({'id': 'bm-contain-header'})
      .addDiv({'id': 'bm-bar-drag'}).buildElement()
      .addImg({'alt': 'Blue Marble Icon - Click to minimize/maximize', 'src': 'https://freakland.egorrko.ru/favicon/favicon-96x96.png', 'style': 'cursor: pointer;'}, 
        (instance, img) => {
          /** Click event handler for overlay minimize/maximize functionality.
           * 
           * Toggles between two distinct UI states:
           * 1. MINIMIZED STATE (60×76px):
           *    - Shows only the Blue Marble icon and drag bar
           *    - Hides all input fields, buttons, and status information
           *    - Applies fixed dimensions for consistent appearance
           *    - Repositions icon with 3px right offset for visual centering
           * 
           * 2. MAXIMIZED STATE (responsive):
           *    - Restores full functionality with all UI elements
           *    - Removes fixed dimensions to allow responsive behavior
           *    - Resets icon positioning to default alignment
           *    - Shows success message when returning to maximized state
           * 
           * @param {Event} event - The click event object (implicit)
           */
          img.addEventListener('click', () => {
            isMinimized = !isMinimized; // Toggle the current state

            const overlay = document.querySelector('#bm-overlay');
            const header = document.querySelector('#bm-contain-header');
            const dragBar = document.querySelector('#bm-bar-drag');
            const coordsContainer = document.querySelector('#bm-contain-coords');
            const coordsButton = document.querySelector('#bm-button-coords');
            const createButton = document.querySelector('#bm-button-create');
            const enableButton = document.querySelector('#bm-button-enable');
            const disableButton = document.querySelector('#bm-button-disable');
            const coordInputs = document.querySelectorAll('#bm-contain-coords input');
            
            // Pre-restore original dimensions when switching to maximized state
            // This ensures smooth transition and prevents layout issues
            if (!isMinimized) {
              overlay.style.width = "auto";
              overlay.style.maxWidth = "300px";
              overlay.style.minWidth = "200px";
              overlay.style.padding = "10px";
            }
            
            // Define elements that should be hidden/shown during state transitions
            // Each element is documented with its purpose for maintainability
            const elementsToToggle = [
              '#bm-overlay h1',                    // Main title "Blue Marble"
              '#bm-contain-userinfo',              // User information section (username, droplets, level)
              '#bm-overlay hr',                    // Visual separator lines
              '#bm-contain-automation > *:not(#bm-contain-coords)', // Automation section excluding coordinates
              '#bm-input-file-template',           // Template file upload interface
              '#bm-contain-buttons-action',        // Action buttons container
              `#${instance.outputStatusId}`,       // Status log textarea for user feedback
              '#bm-contain-colorfilter'            // Color filter UI
            ];
            
            // Apply visibility changes to all toggleable elements
            elementsToToggle.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                element.style.display = isMinimized ? 'none' : '';
              });
            });
            // Handle coordinate container and button visibility based on state
            if (isMinimized) {
              // ==================== MINIMIZED STATE CONFIGURATION ====================
              // In minimized state, we hide ALL interactive elements except the icon and drag bar
              // This creates a clean, unobtrusive interface that maintains only essential functionality
              
              // Hide coordinate input container completely
              if (coordsContainer) {
                coordsContainer.style.display = 'none';
              }
              
              // Hide coordinate button (pin icon)
              if (coordsButton) {
                coordsButton.style.display = 'none';
              }
              
              // Hide create template button
              if (createButton) {
                createButton.style.display = 'none';
              }

              // Hide enable templates button
              if (enableButton) {
                enableButton.style.display = 'none';
              }

              // Hide disable templates button
              if (disableButton) {
                disableButton.style.display = 'none';
              }
              
              // Hide all coordinate input fields individually (failsafe)
              coordInputs.forEach(input => {
                input.style.display = 'none';
              });
              
              // Apply fixed dimensions for consistent minimized appearance
              // These dimensions were chosen to accommodate the icon while remaining compact
              overlay.style.width = '60px';    // Fixed width for consistency
              overlay.style.height = '76px';   // Fixed height (60px + 16px for better proportions)
              overlay.style.maxWidth = '60px';  // Prevent expansion
              overlay.style.minWidth = '60px';  // Prevent shrinking
              overlay.style.padding = '8px';    // Comfortable padding around icon
              
              // Apply icon positioning for better visual centering in minimized state
              // The 3px offset compensates for visual weight distribution
              img.style.marginLeft = '3px';
              
              // Configure header layout for minimized state
              header.style.textAlign = 'center';
              header.style.margin = '0';
              header.style.marginBottom = '0';
              
              // Ensure drag bar remains visible and properly spaced
              if (dragBar) {
                dragBar.style.display = '';
                dragBar.style.marginBottom = '0.25em';
              }
            } else {
              // ==================== MAXIMIZED STATE RESTORATION ====================
              // In maximized state, we restore all elements to their default functionality
              // This involves clearing all style overrides applied during minimization
              
              // Restore coordinate container to default state
              if (coordsContainer) {
                coordsContainer.style.display = '';           // Show container
                coordsContainer.style.flexDirection = '';     // Reset flex layout
                coordsContainer.style.justifyContent = '';    // Reset alignment
                coordsContainer.style.alignItems = '';        // Reset alignment
                coordsContainer.style.gap = '';               // Reset spacing
                coordsContainer.style.textAlign = '';         // Reset text alignment
                coordsContainer.style.margin = '';            // Reset margins
              }
              
              // Restore coordinate button visibility
              if (coordsButton) {
                coordsButton.style.display = '';
              }
              
              // Restore create button visibility and reset positioning
              if (createButton) {
                createButton.style.display = '';
                createButton.style.marginTop = '';
              }

              // Restore enable button visibility and reset positioning
              if (enableButton) {
                enableButton.style.display = '';
                enableButton.style.marginTop = '';
              }

              // Restore disable button visibility and reset positioning
              if (disableButton) {
                disableButton.style.display = '';
                disableButton.style.marginTop = '';
              }
              
              // Restore all coordinate input fields
              coordInputs.forEach(input => {
                input.style.display = '';
              });
              
              // Reset icon positioning to default (remove minimized state offset)
              img.style.marginLeft = '';
              
              // Restore overlay to responsive dimensions
              overlay.style.padding = '10px';
              
              // Reset header styling to defaults
              header.style.textAlign = '';
              header.style.margin = '';
              header.style.marginBottom = '';
              
              // Reset drag bar spacing
              if (dragBar) {
                dragBar.style.marginBottom = '0.5em';
              }
              
              // Remove all fixed dimensions to allow responsive behavior
              // This ensures the overlay can adapt to content changes
              overlay.style.width = '';
              overlay.style.height = '';
            }
            
            // ==================== ACCESSIBILITY AND USER FEEDBACK ====================
            // Update accessibility information for screen readers and tooltips
            
            // Update alt text to reflect current state for screen readers and tooltips
            img.alt = isMinimized ? 
              'Blue Marble Icon - Minimized (Click to maximize)' : 
              'Blue Marble Icon - Maximized (Click to minimize)';
            
            // No status message needed - state change is visually obvious to users
          });
        }
      ).buildElement()
      .addHeader(1, {'textContent': name}).buildElement()
    .buildElement()

    .addHr().buildElement()

    .addDiv({'id': 'bm-contain-userinfo'})
      .addP({'id': 'bm-user-name', 'textContent': 'Юзернейм:'}).buildElement()
      .addP({'id': 'bm-user-droplets', 'textContent': 'Капель:'}).buildElement()
      .addP({'id': 'bm-user-nextlevel', 'textContent': 'Следующий уровень через:'}).buildElement()
      .addP({'id': 'bm-user-reload', 'textContent': ''}).buildElement()
      .addP({'id': 'bm-user-online', 'textContent': ''}).buildElement()
    .buildElement()

    .addHr().buildElement()

    .addDiv({'id': 'bm-contain-automation'})
      .addButton({'id': 'bm-button-create', 'textContent': 'Обновить шаблоны'}, (instance, button) => {
        button.onclick = async () => {
          const input = await fetch(`${data_url}/data.json`);
          const input_json = await input.json();

          GM.setValue('bmOptions', JSON.stringify(input_json));

          instance.handleSelectorStatus(input_json.images);
          instance.handleDisplayStatus(`Скачиваем шаблон! Ожидайте...`);
        }
      }).buildElement()
      .addDiv({'id': 'bm-contain-selector-templates', 'style': 'margin-top: 10px;'})
      .addSelector({'id': 'bm-selector-templates'},
        async (instance, selector) => {
          console.log("selector", selector);
          await updateSelector(selector);

          const choices = new Choices(selector, {
            shouldSort: false,
            searchEnabled: false,
            itemSelectText: '',
          });

          selector.addEventListener('change', async (event) => {
            loadSelectedTemplate(selector);
          });
        }
      ).buildElement()
      .buildElement()
      // Color filter UI
      .addDiv({'id': 'bm-contain-colorfilter', 'style': 'max-height: 140px; overflow: auto; border: 1px solid rgba(255,255,255,0.1); padding: 4px; border-radius: 4px; display: none;'})
        .addDiv({'style': 'display: flex; gap: 6px; margin-bottom: 6px;'})
          .addButton({'id': 'bm-button-colors-enable-all', 'textContent': 'Включить все цвета'}, (instance, button) => {
            button.onclick = () => {
              const t = templateManager.templatesArray[0];
              if (!t?.colorPalette) { return; }
              Object.values(t.colorPalette).forEach(v => v.enabled = true);
              buildColorFilterList();
              instance.handleDisplayStatus('Включить все цвета');
            };
          }).buildElement()
          .addButton({'id': 'bm-button-colors-disable-all', 'textContent': 'Выключить все цвета'}, (instance, button) => {
            button.onclick = () => {
              const t = templateManager.templatesArray[0];
              if (!t?.colorPalette) { return; }
              Object.values(t.colorPalette).forEach(v => v.enabled = false);
              buildColorFilterList();
              instance.handleDisplayStatus('Выключить все цвета');
            };
          }).buildElement()
        .buildElement()
        .addDiv({'id': 'bm-colorfilter-list'}).buildElement()
      .buildElement()
      
      .addDiv({'id': 'bm-contain-buttons-template'})
        .addButton({'id': 'bm-button-enable', 'textContent': 'Включить'}, (instance, button) => {
          button.onclick = () => {
            instance.apiManager?.templateManager?.setTemplatesShouldBeDrawn(true);
            instance.handleDisplayStatus(`Включение шаблона! Ожидайте...`);
          }
        }).buildElement()
        .addButton({'id': 'bm-button-disable', 'textContent': 'Выключить'}, (instance, button) => {
          button.onclick = () => {
            instance.apiManager?.templateManager?.setTemplatesShouldBeDrawn(false);
            instance.handleDisplayStatus(`Выключение шаблона! Ожидайте...`);
          }
        }).buildElement()
      .buildElement()
      .addTextarea({'id': overlayMain.outputStatusId, 'placeholder': `Статус: Спит...\nВерсия: ${version}`, 'readOnly': true}).buildElement()
      .addDiv({'id': 'bm-contain-buttons-action'})
      .addDiv()
        .addHyperLink({'href': 'https://t.me/YrodstvoDesinova', 'target': '_blank', 'textContent': 'Генерал: @MishaDesinov', 'style': 'font-size: 12px;'}).buildElement()
        .addDiv()
        .addHyperLink({'href': 'https://freakland.egorrko.ru', 'target': '_blank', 'textContent': 'Разработчик: @Egorrko', 'style': 'font-size: 12px;'}).buildElement()
      .buildElement()
    .buildElement()
  .buildOverlay(document.body);

  // ------- Helper: Build the color filter list -------
  window.buildColorFilterList = function buildColorFilterList() {
    const listContainer = document.querySelector('#bm-colorfilter-list');
    const t = templateManager.templatesArray?.[0];
    if (!listContainer || !t?.colorPalette) {
      if (listContainer) { listContainer.innerHTML = '<small>No template colors to display.</small>'; }
      return;
    }

    listContainer.innerHTML = '';
    const entries = Object.entries(t.colorPalette)
      .sort((a,b) => b[1].count - a[1].count); // sort by frequency desc

    for (const [rgb, meta] of entries) {
      let row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.margin = '4px 0';

      let swatch = document.createElement('div');
      swatch.style.width = '14px';
      swatch.style.height = '14px';
      swatch.style.border = '1px solid rgba(255,255,255,0.5)';

      let label = document.createElement('span');
      label.style.fontSize = '12px';
      let labelText = `${meta.count.toLocaleString()}`;

      // Special handling for "other" and "transparent"
      if (rgb === 'other') {
        swatch.style.background = '#888'; // Neutral color for "Other"
        labelText = `Other • ${labelText}`;
      } else if (rgb === '#deface') {
        swatch.style.background = '#deface';
        labelText = `Transparent • ${labelText}`;
      } else {
        const [r, g, b] = rgb.split(',').map(Number);
        swatch.style.background = `rgb(${r},${g},${b})`;
        try {
          const tMeta = templateManager.templatesArray?.[0]?.rgbToMeta?.get(rgb);
          if (tMeta && typeof tMeta.id === 'number') {
            const displayName = tMeta?.name || `rgb(${r},${g},${b})`;
            const starLeft = tMeta.premium ? '★ ' : '';
            labelText = `#${tMeta.id} ${starLeft}${displayName} • ${labelText}`;
          }
        } catch (ignored) {}
      }
      label.textContent = labelText;

      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = !!meta.enabled;
      toggle.addEventListener('change', () => {
        meta.enabled = toggle.checked;
        overlayMain.handleDisplayStatus(`${toggle.checked ? 'Enabled' : 'Disabled'} ${rgb}`);
        try {
          const t = templateManager.templatesArray?.[0];
          const key = t?.storageKey;
          if (t && key && templateManager.templatesJSON?.templates?.[key]) {
            templateManager.templatesJSON.templates[key].palette = t.colorPalette;
            // persist immediately
            GM.setValue('bmTemplates', JSON.stringify(templateManager.templatesJSON));
          }
        } catch (_) {}
      });

      row.appendChild(toggle);
      row.appendChild(swatch);
      row.appendChild(label);
      listContainer.appendChild(row);
    }
  };

  // Listen for template creation/import completion to (re)build palette list
  window.addEventListener('message', (event) => {
    if (event?.data?.bmEvent === 'bm-rebuild-color-list') {
      try { buildColorFilterList(); } catch (_) {}
    }
  });

  // If a template was already loaded from storage, show the color UI and build list
  setTimeout(() => {
    try {
      if (templateManager.templatesArray?.length > 0) {
        const colorUI = document.querySelector('#bm-contain-colorfilter');
        if (colorUI) { colorUI.style.display = ''; }
        buildColorFilterList();
      }
    } catch (_) {}
  }, 0);
}

function buildTelemetryOverlay(overlay) {
  overlay.addDiv({'id': 'bm-overlay-telemetry', style: 'top: 0px; left: 0px; width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; z-index: 9999;'})
    .addDiv({'id': 'bm-contain-all-telemetry', style: 'display: flex; flex-direction: column; align-items: center;'})
      .addDiv({'id': 'bm-contain-header-telemetry', style: 'margin-top: 10%;'})
        .addHeader(1, {'textContent': `${name} Telemetry`}).buildElement()
      .buildElement()

      .addDiv({'id': 'bm-contain-telemetry', style: 'max-width: 50%; overflow-y: auto; max-height: 80vh;'})
        .addHr().buildElement()
        .addBr().buildElement()
        .addDiv({'style': 'width: fit-content; margin: auto; text-align: center;'})
        .addButton({'id': 'bm-button-telemetry-more', 'textContent': 'More Information'}, (instance, button) => {
          button.onclick = () => {
            window.open('https://github.com/SwingTheVine/Wplace-TelemetryServer#telemetry-data', '_blank', 'noopener noreferrer');
          }
        }).buildElement()
        .buildElement()
        .addBr().buildElement()
        .addDiv({style: 'width: fit-content; margin: auto; text-align: center;'})
          .addButton({'id': 'bm-button-telemetry-enable', 'textContent': 'Enable Telemetry', 'style': 'margin-right: 2ch;'}, (instance, button) => {
            button.onclick = () => {
              const userSettings = JSON.parse(GM_getValue('bmUserSettings', '{}'));
              userSettings.telemetry = 1;
              GM.setValue('bmUserSettings', JSON.stringify(userSettings));
              const element = document.getElementById('bm-overlay-telemetry');
              if (element) {
                element.style.display = 'none';
              }
            }
          }).buildElement()
          .addButton({'id': 'bm-button-telemetry-disable', 'textContent': 'Disable Telemetry'}, (instance, button) => {
            button.onclick = () => {
              const userSettings = JSON.parse(GM_getValue('bmUserSettings', '{}'));
              userSettings.telemetry = 0;
              GM.setValue('bmUserSettings', JSON.stringify(userSettings));
              const element = document.getElementById('bm-overlay-telemetry');
              if (element) {
                element.style.display = 'none';
              }
            }
          }).buildElement()
        .buildElement()
        .addBr().buildElement()
        .addP({'textContent': 'We collect anonymous telemetry data such as your browser, OS, and script version to make the experience better for everyone. The data is never shared personally. The data is never sold. You can turn this off by pressing the \'Disable\' button, but keeping it on helps us improve features and reliability faster. Thank you for supporting the Blue Marble!'}).buildElement()
        .addP({'textContent': 'You can disable telemetry by pressing the "Disable" button below.'}).buildElement()
      .buildElement()
    .buildElement()
  .buildOverlay(document.body);
}

function buildOverlayTabTemplate() {
  overlayTabTemplate.addDiv({'id': 'bm-tab-template', 'style': 'top: 20%; left: 10%;'})
      .addDiv()
        .addDiv({'className': 'bm-dragbar'}).buildElement()
        .addButton({'className': 'bm-button-minimize', 'textContent': '↑'},
          (instance, button) => {
            button.onclick = () => {
              let isMinimized = false;
              if (button.textContent == '↑') {
                button.textContent = '↓';
              } else {
                button.textContent = '↑';
                isMinimized = true;
              }

              
            }
          }
        ).buildElement()
      .buildElement()
    .buildElement()
  .buildOverlay();
}
