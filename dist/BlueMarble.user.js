// ==UserScript==
// @name         Freakland
// @namespace    https://github.com/SwingTheVine/
// @version      0.86.0
// @description  A userscript to automate and/or enhance the user experience on Wplace.live. Make sure to comply with the site's Terms of Service, and rules! This script is not affiliated with Wplace.live in any way, use at your own risk. This script is not affiliated with TamperMonkey. The author of this userscript is not responsible for any damages, issues, loss of data, or punishment that may occur as a result of using this script. This script is provided "as is" under the MPL-2.0 license. The "Blue Marble" icon is licensed under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. The image is owned by NASA.
// @author       SwingTheVine
// @license      MPL-2.0
// @supportURL   https://discord.gg/tpeBPy46hf
// @homepageURL  https://bluemarble.lol/
// @icon         https://freakland.egorrko.ru/favicon/favicon-96x96.png
// @updateURL    https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/main/dist/BlueMarble.user.js
// @downloadURL  https://raw.githubusercontent.com/SwingTheVine/Wplace-BlueMarble/main/dist/BlueMarble.user.js
// @match        https://wplace.live/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      freakland.egorrko.ru
// @connect      localhost
// @resource     CSS-BM-File https://raw.githubusercontent.com/Egorrko/Wplace-BlueMarble/refs/heads/main/dist/BlueMarble.user.css
// ==/UserScript==

// Wplace  --> https://wplace.live
// License --> https://www.mozilla.org/en-US/MPL/2.0/

(() => {
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // src/Overlay.js
  var _Overlay_instances, createElement_fn;
  var Overlay = class {
    /** Constructor for the Overlay class.
     * @param {string} name - The name of the userscript
     * @param {string} version - The version of the userscript
     * @since 0.0.2
     * @see {@link Overlay}
     */
    constructor(name2, version2) {
      __privateAdd(this, _Overlay_instances);
      this.name = name2;
      this.version = version2;
      this.apiManager = null;
      this.outputStatusId = "bm-o";
      this.overlay = null;
      this.currentParent = null;
      this.parentStack = [];
    }
    /** Populates the apiManager variable with the apiManager class.
     * @param {apiManager} apiManager - The apiManager class instance
     * @since 0.41.4
     */
    setApiManager(apiManager2) {
      this.apiManager = apiManager2;
    }
    /** Finishes building an element.
     * Call this after you are finished adding children.
     * If the element will have no children, call it anyways.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.2
     * @example
     * overlay
     *   .addDiv()
     *     .addHeader(1).buildElement() // Breaks out of the <h1>
     *     .addP().buildElement() // Breaks out of the <p>
     *   .buildElement() // Breaks out of the <div>
     *   .addHr() // Since there are no more elements, calling buildElement() is optional
     * .buildOverlay(document.body);
     */
    buildElement() {
      if (this.parentStack.length > 0) {
        this.currentParent = this.parentStack.pop();
      }
      return this;
    }
    /** Finishes building the overlay and displays it.
     * Call this when you are done chaining methods.
     * @param {HTMLElement} parent - The parent HTMLElement this overlay should be appended to as a child.
     * @since 0.43.2
     * @example
     * overlay
     *   .addDiv()
     *     .addP().buildElement()
     *   .buildElement()
     * .buildOverlay(document.body); // Adds DOM structure to document body
     * // <div><p></p></div>
     */
    buildOverlay(parent) {
      parent?.appendChild(this.overlay);
      this.overlay = null;
      this.currentParent = null;
      this.parentStack = [];
    }
    /** Adds a `div` to the overlay.
     * This `div` element will have properties shared between all `div` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `div` that are NOT shared between all overlay `div` elements. These should be camelCase.
     * @param {function(Overlay, HTMLDivElement):void} [callback=()=>{}] - Additional JS modification to the `div`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.2
     * @example
     * // Assume all <div> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addDiv({'id': 'foo'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <div id="foo" class="bar"></div>
     * </body>
     */
    addDiv(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const div = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "div", properties, additionalProperties);
      callback(this, div);
      return this;
    }
    /** Adds a `p` to the overlay.
     * This `p` element will have properties shared between all `p` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `p` that are NOT shared between all overlay `p` elements. These should be camelCase.
     * @param {function(Overlay, HTMLParagraphElement):void} [callback=()=>{}] - Additional JS modification to the `p`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.2
     * @example
     * // Assume all <p> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addP({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <p id="foo" class="bar">Foobar.</p>
     * </body>
     */
    addP(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const p = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "p", properties, additionalProperties);
      callback(this, p);
      return this;
    }
    /** Adds a `small` to the overlay.
     * This `small` element will have properties shared between all `small` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `small` that are NOT shared between all overlay `small` elements. These should be camelCase.
     * @param {function(Overlay, HTMLParagraphElement):void} [callback=()=>{}] - Additional JS modification to the `small`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.55.8
     * @example
     * // Assume all <small> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addSmall({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <small id="foo" class="bar">Foobar.</small>
     * </body>
     */
    addSmall(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const small = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "small", properties, additionalProperties);
      callback(this, small);
      return this;
    }
    addHyperLink(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const a = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "a", properties, additionalProperties);
      callback(this, a);
      return this;
    }
    /** Adds a `img` to the overlay.
     * This `img` element will have properties shared between all `img` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `img` that are NOT shared between all overlay `img` elements. These should be camelCase.
     * @param {function(Overlay, HTMLImageElement):void} [callback=()=>{}] - Additional JS modification to the `img`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.2
     * @example
     * // Assume all <img> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addimg({'id': 'foo', 'src': './img.png'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <img id="foo" src="./img.png" class="bar">
     * </body>
     */
    addImg(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const img = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "img", properties, additionalProperties);
      callback(this, img);
      return this;
    }
    /** Adds a header to the overlay.
     * This header element will have properties shared between all header elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {number} level - The header level. Must be between 1 and 6 (inclusive)
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the header that are NOT shared between all overlay header elements. These should be camelCase.
     * @param {function(Overlay, HTMLHeadingElement):void} [callback=()=>{}] - Additional JS modification to the header.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.7
     * @example
     * // Assume all header elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addHeader(6, {'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <h6 id="foo" class="bar">Foobar.</h6>
     * </body>
     */
    addHeader(level, additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const header = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "h" + level, properties, additionalProperties);
      callback(this, header);
      return this;
    }
    /** Adds a `hr` to the overlay.
     * This `hr` element will have properties shared between all `hr` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `hr` that are NOT shared between all overlay `hr` elements. These should be camelCase.
     * @param {function(Overlay, HTMLHRElement):void} [callback=()=>{}] - Additional JS modification to the `hr`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.7
     * @example
     * // Assume all <hr> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addhr({'id': 'foo'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <hr id="foo" class="bar">
     * </body>
     */
    addHr(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const hr = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "hr", properties, additionalProperties);
      callback(this, hr);
      return this;
    }
    /** Adds a `br` to the overlay.
     * This `br` element will have properties shared between all `br` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `br` that are NOT shared between all overlay `br` elements. These should be camelCase.
     * @param {function(Overlay, HTMLBRElement):void} [callback=()=>{}] - Additional JS modification to the `br`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.11
     * @example
     * // Assume all <br> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addbr({'id': 'foo'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <br id="foo" class="bar">
     * </body>
     */
    addBr(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const br = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "br", properties, additionalProperties);
      callback(this, br);
      return this;
    }
    /** Adds a checkbox to the overlay.
     * This checkbox element will have properties shared between all checkbox elements in the overlay.
     * You can override the shared properties by using a callback. Note: the checkbox element is inside a label element.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the checkbox that are NOT shared between all overlay checkbox elements. These should be camelCase.
     * @param {function(Overlay, HTMLLabelElement, HTMLInputElement):void} [callback=()=>{}] - Additional JS modification to the checkbox.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.10
     * @example
     * // Assume all checkbox elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addCheckbox({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <label>
     *     <input type="checkbox" id="foo" class="bar">
     *     "Foobar."
     *   </label>
     * </body>
     */
    addCheckbox(additionalProperties = {}, callback = () => {
    }) {
      const properties = { "type": "checkbox" };
      const label = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "label", { "textContent": additionalProperties["textContent"] ?? "" });
      delete additionalProperties["textContent"];
      const checkbox = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "input", properties, additionalProperties);
      label.insertBefore(checkbox, label.firstChild);
      this.buildElement();
      callback(this, label, checkbox);
      return this;
    }
    /** Adds a `button` to the overlay.
     * This `button` element will have properties shared between all `button` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `button` that are NOT shared between all overlay `button` elements. These should be camelCase.
     * @param {function(Overlay, HTMLButtonElement):void} [callback=()=>{}] - Additional JS modification to the `button`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.12
     * @example
     * // Assume all <button> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addButton({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <button id="foo" class="bar">Foobar.</button>
     * </body>
     */
    addButton(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const button = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "button", properties, additionalProperties);
      callback(this, button);
      return this;
    }
    /** Adds a help button to the overlay. It will have a "?" icon unless overridden in callback.
     * On click, the button will attempt to output the title to the output element (ID defined in Overlay constructor).
     * This `button` element will have properties shared between all `button` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `button` that are NOT shared between all overlay `button` elements. These should be camelCase.
     * @param {function(Overlay, HTMLButtonElement):void} [callback=()=>{}] - Additional JS modification to the `button`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.12
     * @example
     * // Assume all help button elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addButtonHelp({'id': 'foo', 'title': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <button id="foo" class="bar" title="Help: Foobar.">?</button>
     * </body>
     * @example
     * // Assume all help button elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addButtonHelp({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <button id="foo" class="bar" title="Help: Foobar.">?</button>
     * </body>
     */
    addButtonHelp(additionalProperties = {}, callback = () => {
    }) {
      const tooltip = additionalProperties["title"] ?? additionalProperties["textContent"] ?? "Help: No info";
      delete additionalProperties["textContent"];
      additionalProperties["title"] = `Help: ${tooltip}`;
      const properties = {
        "textContent": "?",
        "className": "bm-D",
        "onclick": () => {
          this.updateInnerHTML(this.outputStatusId, tooltip);
        }
      };
      const help = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "button", properties, additionalProperties);
      callback(this, help);
      return this;
    }
    /** Adds a `input` to the overlay.
     * This `input` element will have properties shared between all `input` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `input` that are NOT shared between all overlay `input` elements. These should be camelCase.
     * @param {function(Overlay, HTMLInputElement):void} [callback=()=>{}] - Additional JS modification to the `input`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.13
     * @example
     * // Assume all <input> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addInput({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <input id="foo" class="bar">Foobar.</input>
     * </body>
     */
    addInput(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const input = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "input", properties, additionalProperties);
      callback(this, input);
      return this;
    }
    addSelector(additionalProperties = {}, callback = () => {
    }) {
      console.log("additionalProperties", additionalProperties);
      const properties = {};
      const selector = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "select", properties, additionalProperties);
      callback(this, selector);
      return this;
    }
    /** Adds a file input to the overlay with enhanced visibility controls.
     * This input element will have properties shared between all file input elements in the overlay.
     * Uses multiple hiding methods to prevent browser native text from appearing during minimize/maximize.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the file input that are NOT shared between all overlay file input elements. These should be camelCase.
     * @param {function(Overlay, HTMLDivElement, HTMLInputElement, HTMLButtonElement):void} [callback=()=>{}] - Additional JS modification to the file input.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.17
     * @example
     * // Assume all file input elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addInputFile({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <div>
     *     <input type="file" id="foo" class="bar" style="display: none"></input>
     *     <button>Foobar.</button>
     *   </div>
     * </body>
     */
    addInputFile(additionalProperties = {}, callback = () => {
    }) {
      const properties = {
        "type": "file",
        "style": "display: none !important; visibility: hidden !important; position: absolute !important; left: -9999px !important; width: 0 !important; height: 0 !important; opacity: 0 !important;"
      };
      const text = additionalProperties["textContent"] ?? "";
      delete additionalProperties["textContent"];
      const container = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "div");
      const input = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "input", properties, additionalProperties);
      this.buildElement();
      const button = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "button", { "textContent": text });
      this.buildElement();
      this.buildElement();
      input.setAttribute("tabindex", "-1");
      input.setAttribute("aria-hidden", "true");
      button.addEventListener("click", () => {
        input.click();
      });
      input.addEventListener("change", () => {
        button.style.maxWidth = `${button.offsetWidth}px`;
        if (input.files.length > 0) {
          button.textContent = input.files[0].name;
        } else {
          button.textContent = text;
        }
      });
      callback(this, container, input, button);
      return this;
    }
    /** Adds a `textarea` to the overlay.
     * This `textarea` element will have properties shared between all `textarea` elements in the overlay.
     * You can override the shared properties by using a callback.
     * @param {Object.<string, any>} [additionalProperties={}] - The DOM properties of the `textarea` that are NOT shared between all overlay `textarea` elements. These should be camelCase.
     * @param {function(Overlay, HTMLTextAreaElement):void} [callback=()=>{}] - Additional JS modification to the `textarea`.
     * @returns {Overlay} Overlay class instance (this)
     * @since 0.43.13
     * @example
     * // Assume all <textarea> elements have a shared class (e.g. {'className': 'bar'})
     * overlay.addTextarea({'id': 'foo', 'textContent': 'Foobar.'}).buildOverlay(document.body);
     * // Output:
     * // (Assume <body> already exists in the webpage)
     * <body>
     *   <textarea id="foo" class="bar">Foobar.</textarea>
     * </body>
     */
    addTextarea(additionalProperties = {}, callback = () => {
    }) {
      const properties = {};
      const textarea = __privateMethod(this, _Overlay_instances, createElement_fn).call(this, "textarea", properties, additionalProperties);
      callback(this, textarea);
      return this;
    }
    /** Updates the inner HTML of the element.
     * The element is discovered by it's id.
     * If the element is an `input`, it will modify the value attribute instead.
     * @param {string} id - The ID of the element to change
     * @param {string} html - The HTML/text to update with
     * @param {boolean} [doSafe] - (Optional) Should `textContent` be used instead of `innerHTML` to avoid XSS? False by default
     * @since 0.24.2
     */
    updateInnerHTML(id, html, doSafe = false) {
      const element = document.getElementById(id.replace(/^#/, ""));
      if (!element) {
        return;
      }
      if (element instanceof HTMLInputElement) {
        element.value = html;
        return;
      }
      if (doSafe) {
        element.textContent = html;
      } else {
        element.innerHTML = html;
      }
    }
    /** Handles dragging of the overlay.
     * Uses requestAnimationFrame for smooth animations and GPU-accelerated transforms.
     * @param {string} moveMe - The ID of the element to be moved
     * @param {string} iMoveThings - The ID of the drag handle element
     * @since 0.8.2
    */
    handleDrag(moveMe, iMoveThings) {
      let isDragging = false;
      let offsetX, offsetY = 0;
      let animationFrame = null;
      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;
      moveMe = document.querySelector(moveMe?.[0] == "#" ? moveMe : "#" + moveMe);
      iMoveThings = document.querySelector(iMoveThings?.[0] == "#" ? iMoveThings : "#" + iMoveThings);
      if (!moveMe || !iMoveThings) {
        this.handleDisplayError(`Can not drag! ${!moveMe ? "moveMe" : ""} ${!moveMe && !iMoveThings ? "and " : ""}${!iMoveThings ? "iMoveThings " : ""}was not found!`);
        return;
      }
      const updatePosition = () => {
        if (isDragging) {
          const deltaX = Math.abs(currentX - targetX);
          const deltaY = Math.abs(currentY - targetY);
          if (deltaX > 0.5 || deltaY > 0.5) {
            currentX = targetX;
            currentY = targetY;
            moveMe.style.transform = `translate(${currentX}px, ${currentY}px)`;
            moveMe.style.left = "0px";
            moveMe.style.top = "0px";
            moveMe.style.right = "";
          }
          animationFrame = requestAnimationFrame(updatePosition);
        }
      };
      let initialRect = null;
      const startDrag = (clientX, clientY) => {
        isDragging = true;
        initialRect = moveMe.getBoundingClientRect();
        offsetX = clientX - initialRect.left;
        offsetY = clientY - initialRect.top;
        const computedStyle = window.getComputedStyle(moveMe);
        const transform = computedStyle.transform;
        if (transform && transform !== "none") {
          const matrix = new DOMMatrix(transform);
          currentX = matrix.m41;
          currentY = matrix.m42;
        } else {
          currentX = initialRect.left;
          currentY = initialRect.top;
        }
        targetX = currentX;
        targetY = currentY;
        document.body.style.userSelect = "none";
        iMoveThings.classList.add("dragging");
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        updatePosition();
      };
      const endDrag = () => {
        isDragging = false;
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        document.body.style.userSelect = "";
        iMoveThings.classList.remove("dragging");
      };
      iMoveThings.addEventListener("mousedown", function(event) {
        event.preventDefault();
        startDrag(event.clientX, event.clientY);
      });
      iMoveThings.addEventListener("touchstart", function(event) {
        const touch = event?.touches?.[0];
        if (!touch) {
          return;
        }
        startDrag(touch.clientX, touch.clientY);
        event.preventDefault();
      }, { passive: false });
      document.addEventListener("mousemove", function(event) {
        if (isDragging && initialRect) {
          targetX = event.clientX - offsetX;
          targetY = event.clientY - offsetY;
        }
      }, { passive: true });
      document.addEventListener("touchmove", function(event) {
        if (isDragging && initialRect) {
          const touch = event?.touches?.[0];
          if (!touch) {
            return;
          }
          targetX = touch.clientX - offsetX;
          targetY = touch.clientY - offsetY;
          event.preventDefault();
        }
      }, { passive: false });
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
      document.addEventListener("touchcancel", endDrag);
    }
    /** Handles status display.
     * This will output plain text into the output Status box.
     * Additionally, this will output an info message to the console.
     * @param {string} text - The status text to display.
     * @since 0.58.4
     */
    handleDisplayStatus(text) {
      const consoleInfo = console.info;
      consoleInfo(`${this.name}: ${text}`);
      this.updateInnerHTML(this.outputStatusId, "Status: " + text, true);
    }
    /** Handles error display.
     * This will output plain text into the output Status box.
     * Additionally, this will output an error to the console.
     * @param {string} text - The error text to display.
     * @since 0.41.6
     */
    handleDisplayError(text) {
      const consoleError2 = console.error;
      consoleError2(`${this.name}: ${text}`);
      this.updateInnerHTML(this.outputStatusId, "Error: " + text, true);
    }
    handleSelectorStatus(options) {
      const selector = document.querySelector("#bm-O");
      selector.innerHTML = "";
      for (const option of options) {
        const optionElement = document.createElement("option");
        optionElement.value = JSON.stringify(option.value);
        optionElement.textContent = option.label;
        selector.appendChild(optionElement);
      }
    }
  };
  _Overlay_instances = new WeakSet();
  /** Creates an element.
   * For **internal use** of the {@link Overlay} class.
   * @param {string} tag - The tag name as a string.
   * @param {Object.<string, any>} [properties={}] - The DOM properties of the element.
   * @returns {HTMLElement} HTML Element
   * @since 0.43.2
   */
  createElement_fn = function(tag, properties = {}, additionalProperties = {}) {
    const element = document.createElement(tag);
    if (!this.overlay) {
      this.overlay = element;
      this.currentParent = element;
    } else {
      this.currentParent?.appendChild(element);
      this.parentStack.push(this.currentParent);
      this.currentParent = element;
    }
    for (const [property, value] of Object.entries(properties)) {
      element[property] = value;
    }
    for (const [property, value] of Object.entries(additionalProperties)) {
      element[property] = value;
    }
    return element;
  };

  // src/observers.js
  var Observers = class {
    /** The constructor for the observer class
     * @since 0.43.2
     */
    constructor() {
      this.observerBody = null;
      this.observerBodyTarget = null;
      this.targetDisplayCoords = "#bm-h";
    }
    /** Creates the MutationObserver for document.body
     * @param {HTMLElement} target - Targeted element to watch
     * @returns {Observers} this (Observers class)
     * @since 0.43.2
     */
    createObserverBody(target) {
      this.observerBodyTarget = target;
      this.observerBody = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) {
              continue;
            }
            if (node.matches?.(this.targetDisplayCoords)) {
            }
          }
        }
      });
      return this;
    }
    /** Retrieves the MutationObserver that watches document.body
     * @returns {MutationObserver}
     * @since 0.43.2
     */
    getObserverBody() {
      return this.observerBody;
    }
    /** Observe a MutationObserver
     * @param {MutationObserver} observer - The MutationObserver
     * @param {boolean} watchChildList - (Optional) Should childList be watched? False by default
     * @param {boolean} watchSubtree - (Optional) Should childList be watched? False by default
     * @since 0.43.2
     */
    observe(observer, watchChildList = false, watchSubtree = false) {
      observer.observe(this.observerBodyTarget, {
        childList: watchChildList,
        subtree: watchSubtree
      });
    }
  };

  // src/utils.js
  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function serverTPtoDisplayTP(tile, pixel) {
    return [parseInt(tile[0]) % 4 * 1e3 + parseInt(pixel[0]), parseInt(tile[1]) % 4 * 1e3 + parseInt(pixel[1])];
  }
  function consoleLog(...args) {
    ((consoleLog2) => consoleLog2(...args))(console.log);
  }
  function consoleError(...args) {
    ((consoleError2) => consoleError2(...args))(console.error);
  }
  function consoleWarn(...args) {
    ((consoleWarn2) => consoleWarn2(...args))(console.warn);
  }
  function numberToEncoded(number, encoding) {
    if (number === 0) return encoding[0];
    let result = "";
    const base = encoding.length;
    while (number > 0) {
      result = encoding[number % base] + result;
      number = Math.floor(number / base);
    }
    return result;
  }
  function uint8ToBase64(uint8) {
    let binary = "";
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }
  function base64ToUint8(base64) {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return array;
  }
  var colorpalette = [
    { "id": 0, "premium": false, "name": "Transparent", "rgb": [0, 0, 0] },
    { "id": 1, "premium": false, "name": "Black", "rgb": [0, 0, 0] },
    { "id": 2, "premium": false, "name": "Dark Gray", "rgb": [60, 60, 60] },
    { "id": 3, "premium": false, "name": "Gray", "rgb": [120, 120, 120] },
    { "id": 4, "premium": false, "name": "Light Gray", "rgb": [210, 210, 210] },
    { "id": 5, "premium": false, "name": "White", "rgb": [255, 255, 255] },
    { "id": 6, "premium": false, "name": "Deep Red", "rgb": [96, 0, 24] },
    { "id": 7, "premium": false, "name": "Red", "rgb": [237, 28, 36] },
    { "id": 8, "premium": false, "name": "Orange", "rgb": [255, 127, 39] },
    { "id": 9, "premium": false, "name": "Gold", "rgb": [246, 170, 9] },
    { "id": 10, "premium": false, "name": "Yellow", "rgb": [249, 221, 59] },
    { "id": 11, "premium": false, "name": "Light Yellow", "rgb": [255, 250, 188] },
    { "id": 12, "premium": false, "name": "Dark Green", "rgb": [14, 185, 104] },
    { "id": 13, "premium": false, "name": "Green", "rgb": [19, 230, 123] },
    { "id": 14, "premium": false, "name": "Light Green", "rgb": [135, 255, 94] },
    { "id": 15, "premium": false, "name": "Dark Teal", "rgb": [12, 129, 110] },
    { "id": 16, "premium": false, "name": "Teal", "rgb": [16, 174, 166] },
    { "id": 17, "premium": false, "name": "Light Teal", "rgb": [19, 225, 190] },
    { "id": 18, "premium": false, "name": "Dark Blue", "rgb": [40, 80, 158] },
    { "id": 19, "premium": false, "name": "Blue", "rgb": [64, 147, 228] },
    { "id": 20, "premium": false, "name": "Cyan", "rgb": [96, 247, 242] },
    { "id": 21, "premium": false, "name": "Indigo", "rgb": [107, 80, 246] },
    { "id": 22, "premium": false, "name": "Light Indigo", "rgb": [153, 177, 251] },
    { "id": 23, "premium": false, "name": "Dark Purple", "rgb": [120, 12, 153] },
    { "id": 24, "premium": false, "name": "Purple", "rgb": [170, 56, 185] },
    { "id": 25, "premium": false, "name": "Light Purple", "rgb": [224, 159, 249] },
    { "id": 26, "premium": false, "name": "Dark Pink", "rgb": [203, 0, 122] },
    { "id": 27, "premium": false, "name": "Pink", "rgb": [236, 31, 128] },
    { "id": 28, "premium": false, "name": "Light Pink", "rgb": [243, 141, 169] },
    { "id": 29, "premium": false, "name": "Dark Brown", "rgb": [104, 70, 52] },
    { "id": 30, "premium": false, "name": "Brown", "rgb": [149, 104, 42] },
    { "id": 31, "premium": false, "name": "Beige", "rgb": [248, 178, 119] },
    { "id": 32, "premium": true, "name": "Medium Gray", "rgb": [170, 170, 170] },
    { "id": 33, "premium": true, "name": "Dark Red", "rgb": [165, 14, 30] },
    { "id": 34, "premium": true, "name": "Light Red", "rgb": [250, 128, 114] },
    { "id": 35, "premium": true, "name": "Dark Orange", "rgb": [228, 92, 26] },
    { "id": 36, "premium": true, "name": "Light Tan", "rgb": [214, 181, 148] },
    { "id": 37, "premium": true, "name": "Dark Goldenrod", "rgb": [156, 132, 49] },
    { "id": 38, "premium": true, "name": "Goldenrod", "rgb": [197, 173, 49] },
    { "id": 39, "premium": true, "name": "Light Goldenrod", "rgb": [232, 212, 95] },
    { "id": 40, "premium": true, "name": "Dark Olive", "rgb": [74, 107, 58] },
    { "id": 41, "premium": true, "name": "Olive", "rgb": [90, 148, 74] },
    { "id": 42, "premium": true, "name": "Light Olive", "rgb": [132, 197, 115] },
    { "id": 43, "premium": true, "name": "Dark Cyan", "rgb": [15, 121, 159] },
    { "id": 44, "premium": true, "name": "Light Cyan", "rgb": [187, 250, 242] },
    { "id": 45, "premium": true, "name": "Light Blue", "rgb": [125, 199, 255] },
    { "id": 46, "premium": true, "name": "Dark Indigo", "rgb": [77, 49, 184] },
    { "id": 47, "premium": true, "name": "Dark Slate Blue", "rgb": [74, 66, 132] },
    { "id": 48, "premium": true, "name": "Slate Blue", "rgb": [122, 113, 196] },
    { "id": 49, "premium": true, "name": "Light Slate Blue", "rgb": [181, 174, 241] },
    { "id": 50, "premium": true, "name": "Light Brown", "rgb": [219, 164, 99] },
    { "id": 51, "premium": true, "name": "Dark Beige", "rgb": [209, 128, 81] },
    { "id": 52, "premium": true, "name": "Light Beige", "rgb": [255, 197, 165] },
    { "id": 53, "premium": true, "name": "Dark Peach", "rgb": [155, 82, 73] },
    { "id": 54, "premium": true, "name": "Peach", "rgb": [209, 128, 120] },
    { "id": 55, "premium": true, "name": "Light Peach", "rgb": [250, 182, 164] },
    { "id": 56, "premium": true, "name": "Dark Tan", "rgb": [123, 99, 82] },
    { "id": 57, "premium": true, "name": "Tan", "rgb": [156, 132, 107] },
    { "id": 58, "premium": true, "name": "Dark Slate", "rgb": [51, 57, 65] },
    { "id": 59, "premium": true, "name": "Slate", "rgb": [109, 117, 141] },
    { "id": 60, "premium": true, "name": "Light Slate", "rgb": [179, 185, 209] },
    { "id": 61, "premium": true, "name": "Dark Stone", "rgb": [109, 100, 63] },
    { "id": 62, "premium": true, "name": "Stone", "rgb": [148, 140, 107] },
    { "id": 63, "premium": true, "name": "Light Stone", "rgb": [205, 197, 158] }
  ];

  // src/Template.js
  var Template = class {
    /** The constructor for the {@link Template} class with enhanced pixel tracking.
     * @param {Object} [params={}] - Object containing all optional parameters
     * @param {string} [params.displayName='My template'] - The display name of the template
     * @param {number} [params.sortID=0] - The sort number of the template for rendering priority
     * @param {string} [params.authorID=''] - The user ID of the person who exported the template (prevents sort ID collisions)
     * @param {string} [params.url=''] - The URL to the source image
     * @param {File} [params.file=null] - The template file (pre-processed File or processed bitmap)
     * @param {Array<number>} [params.coords=null] - The coordinates of the top left corner as (tileX, tileY, pixelX, pixelY)
     * @param {Object} [params.chunked=null] - The affected chunks of the template, and their template for each chunk
     * @param {number} [params.tileSize=1000] - The size of a tile in pixels (assumes square tiles)
     * @param {number} [params.pixelCount=0] - Total number of pixels in the template (calculated automatically during processing)
     * @since 0.65.2
     */
    constructor({
      displayName = "My template",
      sortID = 0,
      authorID = "",
      url = "",
      file = null,
      coords: coords2 = null,
      chunked = null,
      tileSize = 1e3
    } = {}) {
      this.displayName = displayName;
      this.sortID = sortID;
      this.authorID = authorID;
      this.url = url;
      this.file = file;
      this.coords = coords2;
      this.chunked = chunked;
      this.tileSize = tileSize;
      this.pixelCount = 0;
      this.requiredPixelCount = 0;
      this.defacePixelCount = 0;
      this.colorPalette = {};
      this.tilePrefixes = /* @__PURE__ */ new Set();
      this.storageKey = null;
      const allowed = Array.isArray(colorpalette) ? colorpalette : [];
      this.allowedColorsSet = new Set(
        allowed.filter((color) => (color?.name || "").toLowerCase() !== "transparent" && Array.isArray(color?.rgb)).map((color) => `${color.rgb[0]},${color.rgb[1]},${color.rgb[2]}`)
      );
      const defaceKey = "222,250,206";
      this.allowedColorsSet.add(defaceKey);
      const keyOther = "other";
      this.allowedColorsSet.add(keyOther);
      this.rgbToMeta = new Map(
        allowed.filter((color) => Array.isArray(color?.rgb)).map((color) => [`${color.rgb[0]},${color.rgb[1]},${color.rgb[2]}`, { id: color.id, premium: !!color.premium, name: color.name }])
      );
      try {
        const transparent = allowed.find((color) => (color?.name || "").toLowerCase() === "transparent");
        if (transparent && Array.isArray(transparent.rgb)) {
          this.rgbToMeta.set(defaceKey, { id: transparent.id, premium: !!transparent.premium, name: transparent.name });
        }
      } catch (ignored) {
      }
      try {
        this.rgbToMeta.set(keyOther, { id: "other", premium: false, name: "Other" });
      } catch (ignored) {
      }
      console.log("Allowed colors for template:", this.allowedColorsSet);
    }
    /** Creates chunks of the template for each tile.
     * 
     * @returns {Object} Collection of template bitmaps & buffers organized by tile coordinates
     * @since 0.65.4
     */
    async createTemplateTiles() {
      console.log("Template coordinates:", this.coords);
      const shreadSize = 3;
      const bitmap = await createImageBitmap(this.file);
      const imageWidth = bitmap.width;
      const imageHeight = bitmap.height;
      const totalPixels = imageWidth * imageHeight;
      console.log(`Template pixel analysis - Dimensions: ${imageWidth}\xD7${imageHeight} = ${totalPixels.toLocaleString()} pixels`);
      this.pixelCount = totalPixels;
      try {
        const inspectCanvas = new OffscreenCanvas(imageWidth, imageHeight);
        const inspectCtx = inspectCanvas.getContext("2d", { willReadFrequently: true });
        inspectCtx.imageSmoothingEnabled = false;
        inspectCtx.clearRect(0, 0, imageWidth, imageHeight);
        inspectCtx.drawImage(bitmap, 0, 0);
        const inspectData = inspectCtx.getImageData(0, 0, imageWidth, imageHeight).data;
        let required = 0;
        let deface = 0;
        const paletteMap = /* @__PURE__ */ new Map();
        for (let y = 0; y < imageHeight; y++) {
          for (let x = 0; x < imageWidth; x++) {
            const idx = (y * imageWidth + x) * 4;
            const r = inspectData[idx];
            const g = inspectData[idx + 1];
            const b = inspectData[idx + 2];
            const a = inspectData[idx + 3];
            if (a === 0) {
              continue;
            }
            if (r === 222 && g === 250 && b === 206) {
              deface++;
            }
            const key = this.allowedColorsSet.has(`${r},${g},${b}`) ? `${r},${g},${b}` : "other";
            required++;
            paletteMap.set(key, (paletteMap.get(key) || 0) + 1);
          }
        }
        this.requiredPixelCount = required;
        this.defacePixelCount = deface;
        const paletteObj = {};
        for (const [key, count] of paletteMap.entries()) {
          paletteObj[key] = { count, enabled: true };
        }
        this.colorPalette = paletteObj;
      } catch (err) {
        this.requiredPixelCount = Math.max(0, this.pixelCount);
        this.defacePixelCount = 0;
        console.warn("Failed to compute required/deface counts. Falling back to total pixels.", err);
      }
      const templateTiles = {};
      const templateTilesBuffers = {};
      const canvas = new OffscreenCanvas(this.tileSize, this.tileSize);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      for (let pixelY = this.coords[3]; pixelY < imageHeight + this.coords[3]; ) {
        const drawSizeY = Math.min(this.tileSize - pixelY % this.tileSize, imageHeight - (pixelY - this.coords[3]));
        console.log(`Math.min(${this.tileSize} - (${pixelY} % ${this.tileSize}), ${imageHeight} - (${pixelY - this.coords[3]}))`);
        for (let pixelX = this.coords[2]; pixelX < imageWidth + this.coords[2]; ) {
          console.log(`Pixel X: ${pixelX}
Pixel Y: ${pixelY}`);
          const drawSizeX = Math.min(this.tileSize - pixelX % this.tileSize, imageWidth - (pixelX - this.coords[2]));
          console.log(`Math.min(${this.tileSize} - (${pixelX} % ${this.tileSize}), ${imageWidth} - (${pixelX - this.coords[2]}))`);
          console.log(`Draw Size X: ${drawSizeX}
Draw Size Y: ${drawSizeY}`);
          const canvasWidth = drawSizeX * shreadSize;
          const canvasHeight = drawSizeY * shreadSize;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          console.log(`Draw X: ${drawSizeX}
Draw Y: ${drawSizeY}
Canvas Width: ${canvasWidth}
Canvas Height: ${canvasHeight}`);
          context.imageSmoothingEnabled = false;
          console.log(`Getting X ${pixelX}-${pixelX + drawSizeX}
Getting Y ${pixelY}-${pixelY + drawSizeY}`);
          context.clearRect(0, 0, canvasWidth, canvasHeight);
          context.drawImage(
            bitmap,
            // Bitmap image to draw
            pixelX - this.coords[2],
            // Coordinate X to draw from
            pixelY - this.coords[3],
            // Coordinate Y to draw from
            drawSizeX,
            // X width to draw from
            drawSizeY,
            // Y height to draw from
            0,
            // Coordinate X to draw at
            0,
            // Coordinate Y to draw at
            drawSizeX * shreadSize,
            // X width to draw at
            drawSizeY * shreadSize
            // Y height to draw at
          );
          const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
          for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
              const pixelIndex = (y * canvasWidth + x) * 4;
              if (imageData.data[pixelIndex] === 222 && imageData.data[pixelIndex + 1] === 250 && imageData.data[pixelIndex + 2] === 206) {
                if ((x + y) % 2 === 0) {
                  imageData.data[pixelIndex] = 0;
                  imageData.data[pixelIndex + 1] = 0;
                  imageData.data[pixelIndex + 2] = 0;
                } else {
                  imageData.data[pixelIndex] = 255;
                  imageData.data[pixelIndex + 1] = 255;
                  imageData.data[pixelIndex + 2] = 255;
                }
                imageData.data[pixelIndex + 3] = 32;
              } else if (x % shreadSize !== 1 || y % shreadSize !== 1) {
                imageData.data[pixelIndex + 3] = 0;
              } else {
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                if (!this.allowedColorsSet.has(`${r},${g},${b}`)) {
                }
              }
            }
          }
          console.log(`Shreaded pixels for ${pixelX}, ${pixelY}`, imageData);
          context.putImageData(imageData, 0, 0);
          const templateTileName = `${(this.coords[0] + Math.floor(pixelX / 1e3)).toString().padStart(4, "0")},${(this.coords[1] + Math.floor(pixelY / 1e3)).toString().padStart(4, "0")},${(pixelX % 1e3).toString().padStart(3, "0")},${(pixelY % 1e3).toString().padStart(3, "0")}`;
          templateTiles[templateTileName] = await createImageBitmap(canvas);
          this.tilePrefixes.add(templateTileName.split(",").slice(0, 2).join(","));
          const canvasBlob = await canvas.convertToBlob();
          const canvasBuffer = await canvasBlob.arrayBuffer();
          const canvasBufferBytes = Array.from(new Uint8Array(canvasBuffer));
          templateTilesBuffers[templateTileName] = uint8ToBase64(canvasBufferBytes);
          console.log(templateTiles);
          pixelX += drawSizeX;
        }
        pixelY += drawSizeY;
      }
      console.log("Template Tiles: ", templateTiles);
      console.log("Template Tiles Buffers: ", templateTilesBuffers);
      return { templateTiles, templateTilesBuffers };
    }
  };

  // src/templateManager.js
  var _TemplateManager_instances, loadTemplate_fn, storeTemplates_fn, parseBlueMarble_fn, parseOSU_fn;
  var TemplateManager = class {
    /** The constructor for the {@link TemplateManager} class.
     * @since 0.55.8
     */
    constructor(name2, version2, overlay) {
      __privateAdd(this, _TemplateManager_instances);
      this.name = name2;
      this.version = version2;
      this.overlay = overlay;
      this.templatesVersion = "1.0.0";
      this.userID = null;
      this.encodingBase = "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
      this.tileSize = 1e3;
      this.drawMult = 3;
      this.canvasTemplate = null;
      this.canvasTemplateZoomed = null;
      this.canvasTemplateID = "bm-C";
      this.canvasMainID = "div#map canvas.maplibregl-canvas";
      this.template = null;
      this.templateState = "";
      this.templatesArray = [];
      this.templatesJSON = null;
      this.templatesShouldBeDrawn = true;
      this.tileProgress = /* @__PURE__ */ new Map();
    }
    /** Retrieves the pixel art canvas.
     * If the canvas has been updated/replaced, it retrieves the new one.
     * @param {string} selector - The CSS selector to use to find the canvas.
     * @returns {HTMLCanvasElement|null} The canvas as an HTML Canvas Element, or null if the canvas does not exist
     * @since 0.58.3
     * @deprecated Not in use since 0.63.25
     */
    getCanvas() {
      if (document.body.contains(this.canvasTemplate)) {
        return this.canvasTemplate;
      }
      document.getElementById(this.canvasTemplateID)?.remove();
      const canvasMain = document.querySelector(this.canvasMainID);
      const canvasTemplateNew = document.createElement("canvas");
      canvasTemplateNew.id = this.canvasTemplateID;
      canvasTemplateNew.className = "maplibregl-canvas";
      canvasTemplateNew.style.position = "absolute";
      canvasTemplateNew.style.top = "0";
      canvasTemplateNew.style.left = "0";
      canvasTemplateNew.style.height = `${canvasMain?.clientHeight * (window.devicePixelRatio || 1)}px`;
      canvasTemplateNew.style.width = `${canvasMain?.clientWidth * (window.devicePixelRatio || 1)}px`;
      canvasTemplateNew.height = canvasMain?.clientHeight * (window.devicePixelRatio || 1);
      canvasTemplateNew.width = canvasMain?.clientWidth * (window.devicePixelRatio || 1);
      canvasTemplateNew.style.zIndex = "8999";
      canvasTemplateNew.style.pointerEvents = "none";
      canvasMain?.parentElement?.appendChild(canvasTemplateNew);
      this.canvasTemplate = canvasTemplateNew;
      window.addEventListener("move", this.onMove);
      window.addEventListener("zoom", this.onZoom);
      window.addEventListener("resize", this.onResize);
      return this.canvasTemplate;
    }
    /** Creates the JSON object to store templates in
     * @returns {{ whoami: string, scriptVersion: string, schemaVersion: string, templates: Object }} The JSON object
     * @since 0.65.4
     */
    async createJSON() {
      return {
        "whoami": this.name.replace(" ", ""),
        // Name of userscript without spaces
        "scriptVersion": this.version,
        // Version of userscript
        "schemaVersion": this.templatesVersion,
        // Version of JSON schema
        "templates": {}
        // The templates
      };
    }
    /** Creates the template from the inputed file blob
     * @param {File} blob - The file blob to create a template from
     * @param {string} name - The display name of the template
     * @param {Array<number, number, number, number>} coords - The coordinates of the top left corner of the template
     * @since 0.65.77
     */
    async createTemplate(blob, name2, coords2) {
      if (!this.templatesJSON) {
        this.templatesJSON = await this.createJSON();
        console.log(`Creating JSON...`);
      }
      this.overlay.handleDisplayStatus(`\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043D\u0430 ${coords2.join(", ")}...`);
      const template = new Template({
        displayName: name2,
        sortID: 0,
        // Object.keys(this.templatesJSON.templates).length || 0, // Uncomment this to enable multiple templates (1/2)
        authorID: numberToEncoded(this.userID || 0, this.encodingBase),
        file: blob,
        coords: coords2
      });
      const { templateTiles, templateTilesBuffers } = await template.createTemplateTiles(this.tileSize);
      template.chunked = templateTiles;
      const storageKey = `${template.sortID} ${template.authorID}`;
      template.storageKey = storageKey;
      this.templatesJSON.templates[storageKey] = {
        "name": template.displayName,
        // Display name of template
        "coords": coords2.join(", "),
        // The coords of the template
        "enabled": true,
        "tiles": templateTilesBuffers,
        // Stores the chunked tile buffers
        "palette": template.colorPalette
        // Persist palette and enabled flags
      };
      this.templatesArray = [];
      this.templatesArray.push(template);
      const pixelCountFormatted = new Intl.NumberFormat().format(template.pixelCount);
      this.overlay.handleDisplayStatus(`\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043D\u0430 ${coords2.join(", ")}! \u041E\u0431\u0449\u0435\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439: ${pixelCountFormatted}`);
      try {
        const colorUI = document.querySelector("#bm-9");
        if (colorUI) {
          colorUI.style.display = "";
        }
        window.postMessage({ source: "blue-marble", bmEvent: "bm-b" }, "*");
      } catch (_) {
      }
      console.log(Object.keys(this.templatesJSON.templates).length);
      console.log(this.templatesJSON);
      console.log(this.templatesArray);
      console.log(JSON.stringify(this.templatesJSON));
      await __privateMethod(this, _TemplateManager_instances, storeTemplates_fn).call(this);
    }
    /** Deletes a template from the JSON object.
     * Also delete's the corrosponding {@link Template} class instance
     */
    deleteTemplate() {
    }
    /** Disables the template from view
     */
    async disableTemplate() {
      if (!this.templatesJSON) {
        this.templatesJSON = await this.createJSON();
        console.log(`Creating JSON...`);
      }
    }
    /** Draws all templates on the specified tile.
     * This method handles the rendering of template overlays on individual tiles.
     * @param {File} tileBlob - The pixels that are placed on a tile
     * @param {Array<number>} tileCoords - The tile coordinates [x, y]
     * @since 0.65.77
     */
    async drawTemplateOnTile(tileBlob, tileCoords) {
      if (!this.templatesShouldBeDrawn) {
        return tileBlob;
      }
      const drawSize = this.tileSize * this.drawMult;
      tileCoords = tileCoords[0].toString().padStart(4, "0") + "," + tileCoords[1].toString().padStart(4, "0");
      console.log(`Searching for templates in tile: "${tileCoords}"`);
      const templateArray = this.templatesArray;
      console.log(templateArray);
      templateArray.sort((a, b) => {
        return a.sortID - b.sortID;
      });
      console.log(templateArray);
      const anyTouches = templateArray.some((t) => {
        if (!t?.chunked) {
          return false;
        }
        if (t.tilePrefixes && t.tilePrefixes.size > 0) {
          return t.tilePrefixes.has(tileCoords);
        }
        return Object.keys(t.chunked).some((k) => k.startsWith(tileCoords));
      });
      if (!anyTouches) {
        return tileBlob;
      }
      const templatesToDraw = templateArray.map((template) => {
        const matchingTiles = Object.keys(template.chunked).filter(
          (tile) => tile.startsWith(tileCoords)
        );
        if (matchingTiles.length === 0) {
          return null;
        }
        const matchingTileBlobs = matchingTiles.map((tile) => {
          const coords2 = tile.split(",");
          return {
            bitmap: template.chunked[tile],
            tileCoords: [coords2[0], coords2[1]],
            pixelCoords: [coords2[2], coords2[3]]
          };
        });
        return matchingTileBlobs?.[0];
      }).filter(Boolean);
      console.log(templatesToDraw);
      const templateCount = templatesToDraw?.length || 0;
      console.log(`templateCount = ${templateCount}`);
      let paintedCount = 0;
      let wrongCount = 0;
      let requiredCount = 0;
      const tileBitmap = await createImageBitmap(tileBlob);
      const canvas = new OffscreenCanvas(drawSize, drawSize);
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = false;
      context.beginPath();
      context.rect(0, 0, drawSize, drawSize);
      context.clip();
      context.clearRect(0, 0, drawSize, drawSize);
      context.drawImage(tileBitmap, 0, 0, drawSize, drawSize);
      let tilePixels = null;
      try {
        tilePixels = context.getImageData(0, 0, drawSize, drawSize).data;
      } catch (_) {
      }
      for (const template of templatesToDraw) {
        console.log(`Template:`);
        console.log(template);
        if (tilePixels) {
          try {
            const tempWidth = template.bitmap.width;
            const tempHeight = template.bitmap.height;
            const tempCanvas = new OffscreenCanvas(tempWidth, tempHeight);
            const tempContext = tempCanvas.getContext("2d", { willReadFrequently: true });
            tempContext.imageSmoothingEnabled = false;
            tempContext.clearRect(0, 0, tempWidth, tempHeight);
            tempContext.drawImage(template.bitmap, 0, 0);
            const tImg = tempContext.getImageData(0, 0, tempWidth, tempHeight);
            const tData = tImg.data;
            const offsetX = Number(template.pixelCoords[0]) * this.drawMult;
            const offsetY = Number(template.pixelCoords[1]) * this.drawMult;
            for (let y = 0; y < tempHeight; y++) {
              for (let x = 0; x < tempWidth; x++) {
                if (x % this.drawMult !== 1 || y % this.drawMult !== 1) {
                  continue;
                }
                const gx = x + offsetX;
                const gy = y + offsetY;
                if (gx < 0 || gy < 0 || gx >= drawSize || gy >= drawSize) {
                  continue;
                }
                const templatePixelCenter = (y * tempWidth + x) * 4;
                const templatePixelCenterRed = tData[templatePixelCenter];
                const templatePixelCenterGreen = tData[templatePixelCenter + 1];
                const templatePixelCenterBlue = tData[templatePixelCenter + 2];
                const templatePixelCenterAlpha = tData[templatePixelCenter + 3];
                if (templatePixelCenterAlpha < 64) {
                  try {
                    const activeTemplate2 = this.templatesArray?.[0];
                    const tileIdx = (gy * drawSize + gx) * 4;
                    const pr = tilePixels[tileIdx];
                    const pg = tilePixels[tileIdx + 1];
                    const pb = tilePixels[tileIdx + 2];
                    const pa = tilePixels[tileIdx + 3];
                    const key = activeTemplate2.allowedColorsSet.has(`${pr},${pg},${pb}`) ? `${pr},${pg},${pb}` : "other";
                    const isSiteColor = activeTemplate2?.allowedColorsSet ? activeTemplate2.allowedColorsSet.has(key) : false;
                    if (pa >= 64 && isSiteColor) {
                      wrongCount++;
                    }
                  } catch (ignored) {
                  }
                  continue;
                }
                requiredCount++;
                const realPixelCenter = (gy * drawSize + gx) * 4;
                const realPixelRed = tilePixels[realPixelCenter];
                const realPixelCenterGreen = tilePixels[realPixelCenter + 1];
                const realPixelCenterBlue = tilePixels[realPixelCenter + 2];
                const realPixelCenterAlpha = tilePixels[realPixelCenter + 3];
                if (realPixelCenterAlpha < 64) {
                } else if (realPixelRed === templatePixelCenterRed && realPixelCenterGreen === templatePixelCenterGreen && realPixelCenterBlue === templatePixelCenterBlue) {
                  paintedCount++;
                } else {
                  wrongCount++;
                }
              }
            }
          } catch (exception) {
            console.warn("Failed to compute per-tile painted/wrong stats:", exception);
          }
        }
        try {
          const activeTemplate2 = this.templatesArray?.[0];
          const palette = activeTemplate2?.colorPalette || {};
          const hasDisabled = Object.values(palette).some((v) => v?.enabled === false);
          if (!hasDisabled) {
            context.drawImage(template.bitmap, Number(template.pixelCoords[0]) * this.drawMult, Number(template.pixelCoords[1]) * this.drawMult);
          } else {
            console.log("Applying color filter...");
            const tempW = template.bitmap.width;
            const tempH = template.bitmap.height;
            const filterCanvas = new OffscreenCanvas(tempW, tempH);
            const filterCtx = filterCanvas.getContext("2d", { willReadFrequently: true });
            filterCtx.imageSmoothingEnabled = false;
            filterCtx.clearRect(0, 0, tempW, tempH);
            filterCtx.drawImage(template.bitmap, 0, 0);
            const img = filterCtx.getImageData(0, 0, tempW, tempH);
            const data = img.data;
            for (let y = 0; y < tempH; y++) {
              for (let x = 0; x < tempW; x++) {
                if (x % this.drawMult !== 1 || y % this.drawMult !== 1) {
                  continue;
                }
                const idx = (y * tempW + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                if (a < 1) {
                  continue;
                }
                let key = activeTemplate2.allowedColorsSet.has(`${r},${g},${b}`) ? `${r},${g},${b}` : "other";
                const inWplacePalette = activeTemplate2?.allowedColorsSet ? activeTemplate2.allowedColorsSet.has(key) : true;
                const isPaletteColorEnabled = palette?.[key]?.enabled !== false;
                if (!inWplacePalette || !isPaletteColorEnabled) {
                  data[idx + 3] = 0;
                }
              }
            }
            filterCtx.putImageData(img, 0, 0);
            context.drawImage(filterCanvas, Number(template.pixelCoords[0]) * this.drawMult, Number(template.pixelCoords[1]) * this.drawMult);
          }
        } catch (exception) {
          console.warn("Failed to apply color filter:", exception);
          context.drawImage(template.bitmap, Number(template.pixelCoords[0]) * this.drawMult, Number(template.pixelCoords[1]) * this.drawMult);
        }
      }
      if (templateCount > 0) {
        const tileKey = tileCoords;
        this.tileProgress.set(tileKey, {
          painted: paintedCount,
          required: requiredCount,
          wrong: wrongCount
        });
        let aggPainted = 0;
        let aggRequiredTiles = 0;
        let aggWrong = 0;
        for (const stats of this.tileProgress.values()) {
          aggPainted += stats.painted || 0;
          aggRequiredTiles += stats.required || 0;
          aggWrong += stats.wrong || 0;
        }
        const totalRequiredTemplates = this.templatesArray.reduce((sum, t) => sum + (t.requiredPixelCount || t.pixelCount || 0), 0);
        const totalRequired = totalRequiredTemplates > 0 ? totalRequiredTemplates : aggRequiredTiles;
        const paintedStr = new Intl.NumberFormat().format(aggPainted);
        const requiredStr = new Intl.NumberFormat().format(totalRequired);
        const wrongStr = new Intl.NumberFormat().format(totalRequired - aggPainted);
        this.overlay.handleDisplayStatus(
          `\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 ${templateCount} \u0448\u0430\u0431\u043B\u043E\u043D\u0430${templateCount == 1 ? "" : "\u043E\u0432"}.
\u041D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u043E ${paintedStr} / ${requiredStr} \u2022 \u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E ${wrongStr}`
        );
      } else {
        this.overlay.handleDisplayStatus(`\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 ${templateCount} \u0448\u0430\u0431\u043B\u043E\u043D\u0430${templateCount == 1 ? "" : "\u043E\u0432"}.`);
      }
      return await canvas.convertToBlob({ type: "image/png" });
    }
    /** Imports the JSON object, and appends it to any JSON object already loaded
     * @param {string} json - The JSON string to parse
     */
    importJSON(json) {
      console.log(`Importing JSON...`);
      console.log(json);
      if (json?.whoami == "BlueMarble") {
        __privateMethod(this, _TemplateManager_instances, parseBlueMarble_fn).call(this, json);
      }
    }
    /** Sets the `templatesShouldBeDrawn` boolean to a value.
     * @param {boolean} value - The value to set the boolean to
     * @since 0.73.7
     */
    setTemplatesShouldBeDrawn(value) {
      this.templatesShouldBeDrawn = value;
    }
  };
  _TemplateManager_instances = new WeakSet();
  /** Generates a {@link Template} class instance from the JSON object template
   */
  loadTemplate_fn = function() {
  };
  storeTemplates_fn = async function() {
    GM.setValue("bmTemplates", JSON.stringify(this.templatesJSON));
  };
  parseBlueMarble_fn = async function(json) {
    console.log(`Parsing BlueMarble...`);
    const templates = json.templates;
    console.log(`BlueMarble length: ${Object.keys(templates).length}`);
    if (Object.keys(templates).length > 0) {
      for (const template in templates) {
        const templateKey = template;
        const templateValue = templates[template];
        console.log(templateKey);
        if (templates.hasOwnProperty(template)) {
          const templateKeyArray = templateKey.split(" ");
          const sortID = Number(templateKeyArray?.[0]);
          const authorID = templateKeyArray?.[1] || "0";
          const displayName = templateValue.name || `Template ${sortID || ""}`;
          const tilesbase64 = templateValue.tiles;
          const templateTiles = {};
          let requiredPixelCount = 0;
          const paletteMap = /* @__PURE__ */ new Map();
          for (const tile in tilesbase64) {
            console.log(tile);
            if (tilesbase64.hasOwnProperty(tile)) {
              const encodedTemplateBase64 = tilesbase64[tile];
              const templateUint8Array = base64ToUint8(encodedTemplateBase64);
              const templateBlob = new Blob([templateUint8Array], { type: "image/png" });
              const templateBitmap = await createImageBitmap(templateBlob);
              templateTiles[tile] = templateBitmap;
              try {
                const w = templateBitmap.width;
                const h = templateBitmap.height;
                const c = new OffscreenCanvas(w, h);
                const cx = c.getContext("2d", { willReadFrequently: true });
                cx.imageSmoothingEnabled = false;
                cx.clearRect(0, 0, w, h);
                cx.drawImage(templateBitmap, 0, 0);
                const data = cx.getImageData(0, 0, w, h).data;
                for (let y = 0; y < h; y++) {
                  for (let x = 0; x < w; x++) {
                    if (x % this.drawMult !== 1 || y % this.drawMult !== 1) {
                      continue;
                    }
                    const idx = (y * w + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];
                    if (a < 64) {
                      continue;
                    }
                    if (r === 222 && g === 250 && b === 206) {
                      continue;
                    }
                    requiredPixelCount++;
                    const key = activeTemplate.allowedColorsSet.has(`${r},${g},${b}`) ? `${r},${g},${b}` : "other";
                    paletteMap.set(key, (paletteMap.get(key) || 0) + 1);
                  }
                }
              } catch (e) {
                console.warn("Failed to count required pixels for imported tile", e);
              }
            }
          }
          const template2 = new Template({
            displayName,
            sortID: sortID || this.templatesArray?.length || 0,
            authorID: authorID || ""
            //coords: coords
          });
          template2.chunked = templateTiles;
          template2.requiredPixelCount = requiredPixelCount;
          const paletteObj = {};
          for (const [key, count] of paletteMap.entries()) {
            paletteObj[key] = { count, enabled: true };
          }
          template2.colorPalette = paletteObj;
          try {
            Object.keys(templateTiles).forEach((k) => {
              template2.tilePrefixes?.add(k.split(",").slice(0, 2).join(","));
            });
          } catch (_) {
          }
          try {
            const persisted = templates?.[templateKey]?.palette;
            if (persisted) {
              for (const [rgb, meta] of Object.entries(persisted)) {
                if (!template2.colorPalette[rgb]) {
                  template2.colorPalette[rgb] = { count: meta?.count || 0, enabled: !!meta?.enabled };
                } else {
                  template2.colorPalette[rgb].enabled = !!meta?.enabled;
                }
              }
            }
          } catch (_) {
          }
          template2.storageKey = templateKey;
          this.templatesArray.push(template2);
          console.log(this.templatesArray);
          console.log(`^^^ This ^^^`);
        }
      }
      try {
        const colorUI = document.querySelector("#bm-9");
        if (colorUI) {
          colorUI.style.display = "";
        }
        window.postMessage({ source: "blue-marble", bmEvent: "bm-b" }, "*");
      } catch (_) {
      }
    }
  };
  /** Parses the OSU! Place JSON object
   */
  parseOSU_fn = function() {
  };

  // src/apiManager.js
  var _ApiManager_instances, getBrowserFromUA_fn, getOS_fn;
  var ApiManager = class {
    /** Constructor for ApiManager class
     * @param {TemplateManager} templateManager 
     * @since 0.11.34
     */
    constructor(templateManager2) {
      __privateAdd(this, _ApiManager_instances);
      this.templateManager = templateManager2;
      this.disableAll = false;
      this.coordsTilePixel = [];
      this.templateCoordsTilePixel = [];
    }
    /** Determines if the spontaneously received response is something we want.
     * Otherwise, we can ignore it.
     * Note: Due to aggressive compression, make your calls like `data['jsonData']['name']` instead of `data.jsonData.name`
     * 
     * @param {Overlay} overlay - The Overlay class instance
     * @since 0.11.1
    */
    spontaneousResponseListener(overlay) {
      window.addEventListener("message", async (event) => {
        const data = event.data;
        const dataJSON = data["jsonData"];
        if (!(data && data["source"] === "blue-marble")) {
          return;
        }
        if (!data["endpoint"]) {
          return;
        }
        const endpointText = data["endpoint"]?.split("?")[0].split("/").filter((s) => s && isNaN(Number(s))).filter((s) => s && !s.includes(".")).pop();
        console.log(`%cBlue Marble%c: Recieved message about "%s"`, "color: cornflowerblue;", "", endpointText);
        switch (endpointText) {
          case "me":
            if (dataJSON["status"] && dataJSON["status"]?.toString()[0] != "2") {
              overlay.handleDisplayError(`You are not logged in!
Could not fetch userdata.`);
              return;
            }
            const nextLevelPixels = Math.ceil(Math.pow(Math.floor(dataJSON["level"]) * Math.pow(30, 0.65), 1 / 0.65) - dataJSON["pixelsPainted"]);
            console.log(dataJSON["id"]);
            if (!!dataJSON["id"] || dataJSON["id"] === 0) {
              console.log(numberToEncoded(
                dataJSON["id"],
                "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"
              ));
            }
            this.templateManager.userID = dataJSON["id"];
            console.log("dataJSON", dataJSON);
            overlay.updateInnerHTML("bm-u", `\u042E\u0437\u0435\u0440\u043D\u0435\u0439\u043C: <b>${escapeHTML(dataJSON["name"])}</b>`);
            overlay.updateInnerHTML("bm-p", `\u041A\u0430\u043F\u0435\u043B\u044C: <b>${new Intl.NumberFormat().format(dataJSON["droplets"])}</b>`);
            overlay.updateInnerHTML("bm-i", `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0447\u0435\u0440\u0435\u0437: <b>${new Intl.NumberFormat().format(nextLevelPixels)}</b> \u043F\u0438\u043A\u0441\u0435\u043B${nextLevelPixels == 1 ? "\u044C" : "\u0435\u0439"}`);
            overlay.updateInnerHTML("bm-11", "\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u0440\u044F\u0434\u043E\u0432 \u0447\u0435\u0440\u0435\u0437: <b>" + Math.ceil(dataJSON.charges.cooldownMs * (dataJSON.charges.max - dataJSON.charges.count) / 1e3 / 60) + "</b> \u043C\u0438\u043D");
            this.sendOnlineStatus(overlay, dataJSON);
            break;
          case "pixel":
            const coordsTile = data["endpoint"].split("?")[0].split("/").filter((s) => s && !isNaN(Number(s)));
            const payloadExtractor = new URLSearchParams(data["endpoint"].split("?")[1]);
            const coordsPixel = [payloadExtractor.get("x"), payloadExtractor.get("y")];
            if (this.coordsTilePixel.length && (!coordsTile.length || !coordsPixel.length)) {
              overlay.handleDisplayError(`Coordinates are malformed!
Did you try clicking the canvas first?`);
              return;
            }
            this.coordsTilePixel = [...coordsTile, ...coordsPixel];
            const displayTP = serverTPtoDisplayTP(coordsTile, coordsPixel);
            const spanElements = document.querySelectorAll("span");
            for (const element of spanElements) {
              if (element.textContent.trim().includes(`${displayTP[0]}, ${displayTP[1]}`)) {
                let displayCoords = document.querySelector("#bm-h");
                const text = `(Tl X: ${coordsTile[0]}, Tl Y: ${coordsTile[1]}, Px X: ${coordsPixel[0]}, Px Y: ${coordsPixel[1]})`;
                if (!displayCoords) {
                  displayCoords = document.createElement("span");
                  displayCoords.id = "bm-h";
                  displayCoords.textContent = text;
                  displayCoords.style = "margin-left: calc(var(--spacing)*3); font-size: small;";
                  element.parentNode.parentNode.parentNode.insertAdjacentElement("afterend", displayCoords);
                } else {
                  displayCoords.textContent = text;
                }
              }
            }
            break;
          case "tiles":
            let tileCoordsTile = data["endpoint"].split("/");
            tileCoordsTile = [parseInt(tileCoordsTile[tileCoordsTile.length - 2]), parseInt(tileCoordsTile[tileCoordsTile.length - 1].replace(".png", ""))];
            const blobUUID = data["blobID"];
            const blobData = data["blobData"];
            const templateBlob = await this.templateManager.drawTemplateOnTile(blobData, tileCoordsTile);
            window.postMessage({
              source: "blue-marble",
              blobID: blobUUID,
              blobData: templateBlob,
              blink: data["blink"]
            });
            break;
          case "robots":
            this.disableAll = dataJSON["userscript"]?.toString().toLowerCase() == "false";
            break;
        }
      });
    }
    async sendOnlineStatus(overlay, dataJSON) {
      const userSettings2 = JSON.parse(GM_getValue("bmUserSettings", "{}"));
      const uuid = userSettings2.uuid;
      const data = JSON.stringify({
        count: Math.floor(dataJSON.charges.count),
        max: Math.floor(dataJSON.charges.max),
        uuid
      });
      console.log("data", data);
      GM_xmlhttpRequest({
        method: "POST",
        url: `${base_url}/wplace-api/online`,
        headers: {
          "Content-Type": "application/json"
        },
        data,
        onload: (response) => {
          if (response.status !== 200) {
            consoleError("Failed to send online status:", response.statusText);
            return;
          }
          const responseJSON = JSON.parse(response.responseText);
          overlay.updateInnerHTML("bm-12", `\u0412 \u043A\u043B\u0430\u043D\u0435 <b>${responseJSON.online_count}</b> \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u043E\u043D\u043B\u0430\u0439\u043D.<br> \u0423 \u043A\u043B\u0430\u043D\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E <b>${responseJSON.count}</b> \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439 \u0438\u0437 <b>${responseJSON.max}</b> \u043C\u0430\u043A\u0441.`);
        },
        onerror: (error) => {
          consoleError("Error sending online status:", error);
        }
      });
    }
    // Sends a heartbeat to the telemetry server
    async sendHeartbeat(version2) {
      console.log("Sending heartbeat to telemetry server...");
      let userSettings2 = GM_getValue("bmUserSettings", "{}");
      userSettings2 = JSON.parse(userSettings2);
      if (!userSettings2 || !userSettings2.telemetry || !userSettings2.uuid) {
        console.log("Telemetry is disabled, not sending heartbeat.");
        return;
      }
      const ua = navigator.userAgent;
      let browser = await __privateMethod(this, _ApiManager_instances, getBrowserFromUA_fn).call(this, ua);
      let os = __privateMethod(this, _ApiManager_instances, getOS_fn).call(this, ua);
      GM_xmlhttpRequest({
        method: "POST",
        url: `${base_url}/heartbeat`,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          uuid: userSettings2.uuid,
          version: version2,
          browser,
          os
        }),
        onload: (response) => {
          if (response.status !== 200) {
            consoleError("Failed to send heartbeat:", response.statusText);
          }
        },
        onerror: (error) => {
          consoleError("Error sending heartbeat:", error);
        }
      });
    }
  };
  _ApiManager_instances = new WeakSet();
  getBrowserFromUA_fn = async function(ua = navigator.userAgent) {
    ua = ua || "";
    if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
    if (ua.includes("Edg/")) return "Edge";
    if (ua.includes("Vivaldi")) return "Vivaldi";
    if (ua.includes("YaBrowser")) return "Yandex";
    if (ua.includes("Kiwi")) return "Kiwi";
    if (ua.includes("Brave")) return "Brave";
    if (ua.includes("Firefox/")) return "Firefox";
    if (ua.includes("Chrome/")) return "Chrome";
    if (ua.includes("Safari/")) return "Safari";
    if (navigator.brave && typeof navigator.brave.isBrave === "function") {
      if (await navigator.brave.isBrave()) return "Brave";
    }
    return "Unknown";
  };
  getOS_fn = function(ua = navigator.userAgent) {
    ua = ua || "";
    if (/Windows NT 11/i.test(ua)) return "Windows 11";
    if (/Windows NT 10/i.test(ua)) return "Windows 10";
    if (/Windows NT 6\.3/i.test(ua)) return "Windows 8.1";
    if (/Windows NT 6\.2/i.test(ua)) return "Windows 8";
    if (/Windows NT 6\.1/i.test(ua)) return "Windows 7";
    if (/Windows NT 6\.0/i.test(ua)) return "Windows Vista";
    if (/Windows NT 5\.1|Windows XP/i.test(ua)) return "Windows XP";
    if (/Mac OS X 10[_\.]15/i.test(ua)) return "macOS Catalina";
    if (/Mac OS X 10[_\.]14/i.test(ua)) return "macOS Mojave";
    if (/Mac OS X 10[_\.]13/i.test(ua)) return "macOS High Sierra";
    if (/Mac OS X 10[_\.]12/i.test(ua)) return "macOS Sierra";
    if (/Mac OS X 10[_\.]11/i.test(ua)) return "OS X El Capitan";
    if (/Mac OS X 10[_\.]10/i.test(ua)) return "OS X Yosemite";
    if (/Mac OS X 10[_\.]/i.test(ua)) return "macOS";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Linux/i.test(ua)) return "Linux";
    return "Unknown";
  };

  // src/main.js
  var name = GM_info.script.name.toString();
  var version = GM_info.script.version.toString();
  var consoleStyle = "color: cornflowerblue;";
  var base_url = "https://freakland.egorrko.ru";
  function inject(callback) {
    const script = document.createElement("script");
    script.setAttribute("bm-E", name);
    script.setAttribute("bm-B", consoleStyle);
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
  }
  inject(() => {
    const script = document.currentScript;
    const name2 = script?.getAttribute("bm-E") || "Blue Marble";
    const consoleStyle2 = script?.getAttribute("bm-B") || "";
    const fetchedBlobQueue = /* @__PURE__ */ new Map();
    window.addEventListener("message", (event) => {
      const { source, endpoint, blobID, blobData, blink } = event.data;
      const elapsed = Date.now() - blink;
      console.groupCollapsed(`%c${name2}%c: ${fetchedBlobQueue.size} Recieved IMAGE message about blob "${blobID}"`, consoleStyle2, "");
      console.log(`Blob fetch took %c${String(Math.floor(elapsed / 6e4)).padStart(2, "0")}:${String(Math.floor(elapsed / 1e3) % 60).padStart(2, "0")}.${String(elapsed % 1e3).padStart(3, "0")}%c MM:SS.mmm`, consoleStyle2, "");
      console.log(fetchedBlobQueue);
      console.groupEnd();
      if (source == "blue-marble" && !!blobID && !!blobData && !endpoint) {
        const callback = fetchedBlobQueue.get(blobID);
        if (typeof callback === "function") {
          callback(blobData);
        } else {
          consoleWarn(`%c${name2}%c: Attempted to retrieve a blob (%s) from queue, but the blobID was not a function! Skipping...`, consoleStyle2, "", blobID);
        }
        fetchedBlobQueue.delete(blobID);
      }
    });
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      const cloned = response.clone();
      const endpointName = (args[0] instanceof Request ? args[0]?.url : args[0]) || "ignore";
      const contentType = cloned.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        console.log(`%c${name2}%c: Sending JSON message about endpoint "${endpointName}"`, consoleStyle2, "");
        cloned.json().then((jsonData) => {
          window.postMessage({
            source: "blue-marble",
            endpoint: endpointName,
            jsonData
          }, "*");
        }).catch((err) => {
          console.error(`%c${name2}%c: Failed to parse JSON: `, consoleStyle2, "", err);
        });
      } else if (contentType.includes("image/") && (!endpointName.includes("openfreemap") && !endpointName.includes("maps"))) {
        const blink = Date.now();
        const blob = await cloned.blob();
        console.log(`%c${name2}%c: ${fetchedBlobQueue.size} Sending IMAGE message about endpoint "${endpointName}"`, consoleStyle2, "");
        return new Promise((resolve) => {
          const blobUUID = crypto.randomUUID();
          fetchedBlobQueue.set(blobUUID, (blobProcessed) => {
            resolve(new Response(blobProcessed, {
              headers: cloned.headers,
              status: cloned.status,
              statusText: cloned.statusText
            }));
            console.log(`%c${name2}%c: ${fetchedBlobQueue.size} Processed blob "${blobUUID}"`, consoleStyle2, "");
          });
          window.postMessage({
            source: "blue-marble",
            endpoint: endpointName,
            blobID: blobUUID,
            blobData: blob,
            blink
          });
        }).catch((exception) => {
          const elapsed = Date.now();
          console.error(`%c${name2}%c: Failed to Promise blob!`, consoleStyle2, "");
          console.groupCollapsed(`%c${name2}%c: Details of failed blob Promise:`, consoleStyle2, "");
          console.log(`Endpoint: ${endpointName}
There are ${fetchedBlobQueue.size} blobs processing...
Blink: ${blink.toLocaleString()}
Time Since Blink: ${String(Math.floor(elapsed / 6e4)).padStart(2, "0")}:${String(Math.floor(elapsed / 1e3) % 60).padStart(2, "0")}.${String(elapsed % 1e3).padStart(3, "0")} MM:SS.mmm`);
          console.error(`Exception stack:`, exception);
          console.groupEnd();
        });
      }
      return response;
    };
  });
  var cssOverlay = GM_getResourceText("CSS-BM-File");
  GM_addStyle(cssOverlay);
  var stylesheetLink = document.createElement("link");
  stylesheetLink.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap";
  stylesheetLink.rel = "preload";
  stylesheetLink.as = "style";
  stylesheetLink.onload = function() {
    this.onload = null;
    this.rel = "stylesheet";
  };
  document.head?.appendChild(stylesheetLink);
  var observers = new Observers();
  var overlayMain = new Overlay(name, version);
  var overlayTabTemplate = new Overlay(name, version);
  var templateManager = new TemplateManager(name, version, overlayMain);
  var apiManager = new ApiManager(templateManager);
  overlayMain.setApiManager(apiManager);
  var storageTemplates = JSON.parse(GM_getValue("bmTemplates", "{}"));
  console.log(storageTemplates);
  templateManager.importJSON(storageTemplates);
  var userSettings = JSON.parse(GM_getValue("bmUserSettings", "{}"));
  console.log(userSettings);
  console.log(Object.keys(userSettings).length);
  if (Object.keys(userSettings).length == 0) {
    const uuid = crypto.randomUUID();
    console.log(uuid);
    GM.setValue("bmUserSettings", JSON.stringify({
      "uuid": uuid
    }));
  }
  buildOverlayMain();
  overlayMain.handleDrag("#bm-A", "#bm-z");
  apiManager.spontaneousResponseListener(overlayMain);
  observeBlack();
  consoleLog(`%c${name}%c (${version}) userscript has loaded!`, "color: cornflowerblue;", "");
  function observeBlack() {
    const observer = new MutationObserver((mutations, observer2) => {
      const black = document.querySelector("#color-1");
      if (!black) {
        return;
      }
      let move = document.querySelector("#bm-t");
      if (!move) {
        move = document.createElement("button");
        move.id = "bm-t";
        move.textContent = "Move \u2191";
        move.className = "btn btn-soft";
        move.onclick = function() {
          const roundedBox = this.parentNode.parentNode.parentNode.parentNode;
          const shouldMoveUp = this.textContent == "Move \u2191";
          roundedBox.parentNode.className = roundedBox.parentNode.className.replace(shouldMoveUp ? "bottom" : "top", shouldMoveUp ? "top" : "bottom");
          roundedBox.style.borderTopLeftRadius = shouldMoveUp ? "0px" : "var(--radius-box)";
          roundedBox.style.borderTopRightRadius = shouldMoveUp ? "0px" : "var(--radius-box)";
          roundedBox.style.borderBottomLeftRadius = shouldMoveUp ? "var(--radius-box)" : "0px";
          roundedBox.style.borderBottomRightRadius = shouldMoveUp ? "var(--radius-box)" : "0px";
          this.textContent = shouldMoveUp ? "Move \u2193" : "Move \u2191";
        };
        const paintPixel = black.parentNode.parentNode.parentNode.parentNode.querySelector("h2");
        paintPixel.parentNode?.appendChild(move);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function buildOverlayMain() {
    let isMinimized = false;
    let savedCoords = {};
    try {
      savedCoords = JSON.parse(GM_getValue("bmCoords", "{}")) || {};
    } catch (_) {
      savedCoords = {};
    }
    const updateSelector = async (selector) => {
      const input = await fetch(`${base_url}/wplace-api/data`);
      const input_json = await input.json();
      GM.setValue("bmOptions", JSON.stringify(input_json));
      overlayMain.handleSelectorStatus(input_json.images);
      loadSelectedTemplate(selector);
      overlayMain.handleDisplayStatus(`\u0421\u043A\u0430\u0447\u0438\u0432\u0430\u0435\u043C \u0448\u0430\u0431\u043B\u043E\u043D! \u041E\u0436\u0438\u0434\u0430\u0439\u0442\u0435...`);
    };
    const loadSelectedTemplate = async (selector) => {
      const selected_template = JSON.parse(selector.value);
      console.log("selected_template", selected_template);
      const input = await fetch(`${base_url}${selected_template.path}`);
      const input_blob = await input.blob();
      const name2 = selected_template.name;
      templateManager.createTemplate(input_blob, name2, [selected_template.coords.tx, selected_template.coords.ty, selected_template.coords.px, selected_template.coords.py]);
      overlayMain.handleDisplayStatus(`\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0448\u0430\u0431\u043B\u043E\u043D "${name2}"! \u041E\u0436\u0438\u0434\u0430\u0439\u0442\u0435...`);
    };
    overlayMain.addDiv({ "id": "bm-A", "style": "top: 10px; right: 75px;" }).addDiv({ "id": "bm-j" }).addDiv({ "id": "bm-z" }).buildElement().addImg(
      { "alt": "Blue Marble Icon - Click to minimize/maximize", "src": "https://freakland.egorrko.ru/favicon/favicon-96x96.png", "style": "cursor: pointer;" },
      (instance, img) => {
        img.addEventListener("click", () => {
          isMinimized = !isMinimized;
          const overlay = document.querySelector("#bm-A");
          const header = document.querySelector("#bm-j");
          const dragBar = document.querySelector("#bm-z");
          const coordsContainer = document.querySelector("#bm-k");
          const coordsButton = document.querySelector("#bm-q");
          const createButton = document.querySelector("#bm-r");
          const enableButton = document.querySelector("#bm-s");
          const disableButton = document.querySelector("#bm-l");
          const coordInputs = document.querySelectorAll("#bm-k input");
          if (!isMinimized) {
            overlay.style.width = "auto";
            overlay.style.maxWidth = "300px";
            overlay.style.minWidth = "200px";
            overlay.style.padding = "10px";
          }
          const elementsToToggle = [
            "#bm-A h1",
            // Main title "Blue Marble"
            "#bm-f",
            // User information section (username, droplets, level)
            "#bm-A hr",
            // Visual separator lines
            "#bm-c > *:not(#bm-k)",
            // Automation section excluding coordinates
            "#bm-a",
            // Template file upload interface
            "#bm-6",
            // Action buttons container
            `#${instance.outputStatusId}`,
            // Status log textarea for user feedback
            "#bm-9"
            // Color filter UI
          ];
          elementsToToggle.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
              element.style.display = isMinimized ? "none" : "";
            });
          });
          if (isMinimized) {
            if (coordsContainer) {
              coordsContainer.style.display = "none";
            }
            if (coordsButton) {
              coordsButton.style.display = "none";
            }
            if (createButton) {
              createButton.style.display = "none";
            }
            if (enableButton) {
              enableButton.style.display = "none";
            }
            if (disableButton) {
              disableButton.style.display = "none";
            }
            coordInputs.forEach((input) => {
              input.style.display = "none";
            });
            overlay.style.width = "60px";
            overlay.style.height = "76px";
            overlay.style.maxWidth = "60px";
            overlay.style.minWidth = "60px";
            overlay.style.padding = "8px";
            img.style.marginLeft = "3px";
            header.style.textAlign = "center";
            header.style.margin = "0";
            header.style.marginBottom = "0";
            if (dragBar) {
              dragBar.style.display = "";
              dragBar.style.marginBottom = "0.25em";
            }
          } else {
            if (coordsContainer) {
              coordsContainer.style.display = "";
              coordsContainer.style.flexDirection = "";
              coordsContainer.style.justifyContent = "";
              coordsContainer.style.alignItems = "";
              coordsContainer.style.gap = "";
              coordsContainer.style.textAlign = "";
              coordsContainer.style.margin = "";
            }
            if (coordsButton) {
              coordsButton.style.display = "";
            }
            if (createButton) {
              createButton.style.display = "";
              createButton.style.marginTop = "";
            }
            if (enableButton) {
              enableButton.style.display = "";
              enableButton.style.marginTop = "";
            }
            if (disableButton) {
              disableButton.style.display = "";
              disableButton.style.marginTop = "";
            }
            coordInputs.forEach((input) => {
              input.style.display = "";
            });
            img.style.marginLeft = "";
            overlay.style.padding = "10px";
            header.style.textAlign = "";
            header.style.margin = "";
            header.style.marginBottom = "";
            if (dragBar) {
              dragBar.style.marginBottom = "0.5em";
            }
            overlay.style.width = "";
            overlay.style.height = "";
          }
          img.alt = isMinimized ? "Blue Marble Icon - Minimized (Click to maximize)" : "Blue Marble Icon - Maximized (Click to minimize)";
        });
      }
    ).buildElement().addHeader(1, { "textContent": name }).buildElement().buildElement().addHr().buildElement().addDiv({ "id": "bm-f" }).addP({ "id": "bm-u", "textContent": "\u042E\u0437\u0435\u0440\u043D\u0435\u0439\u043C:" }).buildElement().addP({ "id": "bm-p", "textContent": "\u041A\u0430\u043F\u0435\u043B\u044C:" }).buildElement().addP({ "id": "bm-i", "textContent": "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0447\u0435\u0440\u0435\u0437:" }).buildElement().addP({ "id": "bm-11", "textContent": "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0447\u0435\u0440\u0435\u0437:" }).buildElement().addP({ "id": "bm-12", "textContent": "" }).buildElement().buildElement().addHr().buildElement().addDiv({ "id": "bm-c" }).addButton({ "id": "bm-r", "textContent": "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u044B" }, (instance, button) => {
      button.onclick = async () => {
        const input = await fetch(`${base_url}/wplace-api/data`);
        const input_json = await input.json();
        GM.setValue("bmOptions", JSON.stringify(input_json));
        instance.handleSelectorStatus(input_json.images);
        instance.handleDisplayStatus(`\u0421\u043A\u0430\u0447\u0438\u0432\u0430\u0435\u043C \u0448\u0430\u0431\u043B\u043E\u043D! \u041E\u0436\u0438\u0434\u0430\u0439\u0442\u0435...`);
      };
    }).buildElement().addDiv({ "id": "bm-H", "style": "margin-top: 10px;" }).addSelector(
      { "id": "bm-O" },
      (instance, selector) => {
        console.log("selector", selector);
        updateSelector(selector);
        selector.onchange = async () => {
          loadSelectedTemplate(selector);
        };
      }
    ).buildElement().buildElement().addDiv({ "id": "bm-9", "style": "max-height: 140px; overflow: auto; border: 1px solid rgba(255,255,255,0.1); padding: 4px; border-radius: 4px; display: none;" }).addDiv({ "style": "display: flex; gap: 6px; margin-bottom: 6px;" }).addButton({ "id": "bm-3", "textContent": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430" }, (instance, button) => {
      button.onclick = () => {
        const t = templateManager.templatesArray[0];
        if (!t?.colorPalette) {
          return;
        }
        Object.values(t.colorPalette).forEach((v) => v.enabled = true);
        buildColorFilterList();
        instance.handleDisplayStatus("\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430");
      };
    }).buildElement().addButton({ "id": "bm-0", "textContent": "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430" }, (instance, button) => {
      button.onclick = () => {
        const t = templateManager.templatesArray[0];
        if (!t?.colorPalette) {
          return;
        }
        Object.values(t.colorPalette).forEach((v) => v.enabled = false);
        buildColorFilterList();
        instance.handleDisplayStatus("\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0441\u0435 \u0446\u0432\u0435\u0442\u0430");
      };
    }).buildElement().buildElement().addDiv({ "id": "bm-g" }).buildElement().buildElement().addDiv({ "id": "bm-4" }).addButton({ "id": "bm-s", "textContent": "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }, (instance, button) => {
      button.onclick = () => {
        instance.apiManager?.templateManager?.setTemplatesShouldBeDrawn(true);
        instance.handleDisplayStatus(`\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u0430! \u041E\u0436\u0438\u0434\u0430\u0439\u0442\u0435...`);
      };
    }).buildElement().addButton({ "id": "bm-l", "textContent": "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }, (instance, button) => {
      button.onclick = () => {
        instance.apiManager?.templateManager?.setTemplatesShouldBeDrawn(false);
        instance.handleDisplayStatus(`\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u0430! \u041E\u0436\u0438\u0434\u0430\u0439\u0442\u0435...`);
      };
    }).buildElement().buildElement().addTextarea({ "id": overlayMain.outputStatusId, "placeholder": `\u0421\u0442\u0430\u0442\u0443\u0441: \u0421\u043F\u0438\u0442...
\u0412\u0435\u0440\u0441\u0438\u044F: ${version}`, "readOnly": true }).buildElement().addDiv({ "id": "bm-6" }).addDiv().addHyperLink({ "href": "https://t.me/YrodstvoDesinova", "target": "_blank", "textContent": "\u0413\u0435\u043D\u0435\u0440\u0430\u043B: @MishaDesinov", "style": "font-size: 12px;" }).buildElement().addDiv().addHyperLink({ "href": "https://freakland.egorrko.ru", "target": "_blank", "textContent": "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A: @Egorrko", "style": "font-size: 12px;" }).buildElement().buildElement().buildElement().buildOverlay(document.body);
    window.buildColorFilterList = function buildColorFilterList2() {
      const listContainer = document.querySelector("#bm-g");
      const t = templateManager.templatesArray?.[0];
      if (!listContainer || !t?.colorPalette) {
        if (listContainer) {
          listContainer.innerHTML = "<small>No template colors to display.</small>";
        }
        return;
      }
      listContainer.innerHTML = "";
      const entries = Object.entries(t.colorPalette).sort((a, b) => b[1].count - a[1].count);
      for (const [rgb, meta] of entries) {
        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.margin = "4px 0";
        let swatch = document.createElement("div");
        swatch.style.width = "14px";
        swatch.style.height = "14px";
        swatch.style.border = "1px solid rgba(255,255,255,0.5)";
        let label = document.createElement("span");
        label.style.fontSize = "12px";
        let labelText = `${meta.count.toLocaleString()}`;
        if (rgb === "other") {
          swatch.style.background = "#888";
          labelText = `Other \u2022 ${labelText}`;
        } else if (rgb === "#deface") {
          swatch.style.background = "#deface";
          labelText = `Transparent \u2022 ${labelText}`;
        } else {
          const [r, g, b] = rgb.split(",").map(Number);
          swatch.style.background = `rgb(${r},${g},${b})`;
          try {
            const tMeta = templateManager.templatesArray?.[0]?.rgbToMeta?.get(rgb);
            if (tMeta && typeof tMeta.id === "number") {
              const displayName = tMeta?.name || `rgb(${r},${g},${b})`;
              const starLeft = tMeta.premium ? "\u2605 " : "";
              labelText = `#${tMeta.id} ${starLeft}${displayName} \u2022 ${labelText}`;
            }
          } catch (ignored) {
          }
        }
        label.textContent = labelText;
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = !!meta.enabled;
        toggle.addEventListener("change", () => {
          meta.enabled = toggle.checked;
          overlayMain.handleDisplayStatus(`${toggle.checked ? "Enabled" : "Disabled"} ${rgb}`);
          try {
            const t2 = templateManager.templatesArray?.[0];
            const key = t2?.storageKey;
            if (t2 && key && templateManager.templatesJSON?.templates?.[key]) {
              templateManager.templatesJSON.templates[key].palette = t2.colorPalette;
              GM.setValue("bmTemplates", JSON.stringify(templateManager.templatesJSON));
            }
          } catch (_) {
          }
        });
        row.appendChild(toggle);
        row.appendChild(swatch);
        row.appendChild(label);
        listContainer.appendChild(row);
      }
    };
    window.addEventListener("message", (event) => {
      if (event?.data?.bmEvent === "bm-b") {
        try {
          buildColorFilterList();
        } catch (_) {
        }
      }
    });
    setTimeout(() => {
      try {
        if (templateManager.templatesArray?.length > 0) {
          const colorUI = document.querySelector("#bm-9");
          if (colorUI) {
            colorUI.style.display = "";
          }
          buildColorFilterList();
        }
      } catch (_) {
      }
    }, 0);
  }
})();
