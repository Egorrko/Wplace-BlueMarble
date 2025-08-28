/** Builds the userscript using esbuild.
 * This will:
 * 1. Update the package version across the entire project
 * 2. Bundle the JS files into one file (esbuild)
 * 3. Bundle the CSS files into one file (esbuild)
 * 4. Compress & obfuscate the bundled JS file (terner)
 * 5. Runs the CSS selector mangler (cssMandler.js)
 * @since 0.0.6
*/

// ES Module imports
import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';
import { consoleStyle } from './utils.js';
import mangleSelectors from './cssMangler.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// CommonJS imports (require)
const terser = require('terser');

const isGitHub = !!process.env?.GITHUB_ACTIONS; // Is this running in a GitHub Action Workflow?'

console.log(`${consoleStyle.BLUE}Starting build...${consoleStyle.RESET}`);

// Tries to build the wiki if build.js is run in a GitHub Workflow
// if (isGitHub) {
//   try {
//     console.log(`Generating JSDoc...`);
//     execSync(`npx jsdoc src/ -r -d docs -t node_modules/minami`, { stdio: "inherit" });
//     console.log(`JSDoc built ${consoleStyle.GREEN}successfully${consoleStyle.RESET}`);
//   } catch (error) {
//     console.error(`${consoleStyle.RED + consoleStyle.BOLD}Failed to generate JSDoc${consoleStyle.RESET}:`, error);
//     process.exit(1);
//   }
// }

// Tries to bump the version
try {
  const update = execSync('node build/update-version.js', { stdio: 'inherit' });
  console.log(`Version updated in meta file ${consoleStyle.GREEN}successfully${consoleStyle.RESET}`);
} catch (error) {
  console.error(`${consoleStyle.RED + consoleStyle.BOLD}Failed to update version number${consoleStyle.RESET}:`, error);
  process.exit(1);
}

// Fetches the userscript metadata banner
const metaContent = fs.readFileSync('src/BlueMarble.meta.js', 'utf8');

// Compiles the CSS files
const resultCss = await esbuild.build({
  entryPoints: ['src/main.css'], 
  bundle: true,
  minify: true,
  write: false,
}).catch(() => process.exit(1));

const cssContent = resultCss.outputFiles[0].text;


// Compiles the JS files
const resultEsbuild = await esbuild.build({
  entryPoints: ['src/main.js'], // "Infect" the files from this point (it spreads from this "patient 0")
  bundle: true, // Should the code be bundled?
  outfile: 'dist/BlueMarble.user.js', // The file the bundled code is exported to
  format: 'iife', // What format the bundler bundles the code into
  target: 'es2020', // What is the minimum version/year that should be supported? When omited, it attempts to support backwards compatability with legacy browsers
  platform: 'browser', // The platform the bundled code will be operating on
  legalComments: 'inline', // What level of legal comments are preserved? (Hard: none, Soft: inline)
  minify: true, // Should the code be minified?
  write: false, // Should we write the outfile to the disk?
  define: {
    'INJECTED_CSS': JSON.stringify(cssContent)
  }
}).catch(() => process.exit(1));

// Retrieves the JS file
const resultEsbuildJS = resultEsbuild.outputFiles.find(file => file.path.endsWith('.js'));

fs.writeFileSync('dist/BlueMarble.user.js', resultEsbuildJS.text, 'utf8');

// Adds the banner
fs.writeFileSync(
  'dist/BlueMarble.user.js', 
  metaContent + fs.readFileSync('dist/BlueMarble.user.js', 'utf8'), 
  'utf8'
);

console.log(`${consoleStyle.GREEN + consoleStyle.BOLD + consoleStyle.UNDERLINE}Building complete!${consoleStyle.RESET}`);
