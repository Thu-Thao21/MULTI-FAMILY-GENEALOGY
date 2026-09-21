const fs = require('fs');

const originalCssPath = 'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/temp_clone/FE/src/styles/AdminTheme.css';
const targetCssPath = 'e:/MULTI-FAMILY-GENEALOGY/MULTI-FAMILY-GENEALOGY/FE/src/styles/AdminTheme.css';

let css = fs.readFileSync(originalCssPath, 'utf8');

// Find all class selectors
// A regex to match css rules blocks
const lines = css.split('\n');
let outputLines = [];

for (let line of lines) {
  // if line contains CSS selectors before a '{' or just selectors separated by comma
  if (line.includes('{') || line.includes(',') || (line.trim().startsWith('.') && !line.includes('}'))) {
    // We only care about replacing .clan- with .admin- and appending to the selector list
    // Example: ".clan-account-container, .clan-profile-container {"
    // Becomes: ".clan-account-container, .admin-account-container, .clan-profile-container, .admin-profile-container {"
    let newSelectorLine = line;
    const classRegex = /\.clan-[a-zA-Z0-9_-]+/g;
    let matches = line.match(classRegex);
    if (matches) {
      let uniqueMatches = [...new Set(matches)];
      for (let m of uniqueMatches) {
        let adminClass = m.replace('.clan-', '.admin-');
        // Add the admin- class to the line safely. 
        // We'll replace the existing match with "match, adminClass"
        // But doing a global string replace might mess up if they are substrings.
        // It's safer to just duplicate the rule for simplicity, or append the generated class
        newSelectorLine = newSelectorLine.replace(new RegExp(m.replace('.', '\\.') + '(?=[,\\s{])', 'g'), m + ', ' + adminClass);
      }
    }
    outputLines.push(newSelectorLine);
  } else {
    outputLines.push(line);
  }
}

fs.writeFileSync(targetCssPath, outputLines.join('\n'));
console.log('Successfully updated AdminTheme.css with duplicated admin- classes.');
