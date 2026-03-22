const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'src', 'pages');

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace backgrounds for a matte blue/green theme
      // Base background
      content = content.replace(/bg-gray-50/g, 'bg-[#e0f0ea]'); // muted light mint/blue base
      // Cards
      content = content.replace(/bg-white/g, 'bg-[#f0f7f4]'); // very light matte tint
      // Inputs & secondary
      content = content.replace(/bg-gray-100/g, 'bg-[#cce3de]'); // matte teal
      content = content.replace(/bg-black\/5/g, 'bg-[#cce3de]/50'); // inputs
      // Buttons
      content = content.replace(/bg-gray-200/g, 'bg-[#a4c3b2]'); // matte mid-green
      // Hover states
      content = content.replace(/bg-gray-300/g, 'bg-[#6b9080]'); // matte dark green
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

// Also update App.jsx or main layout if needed, but pages contain almost everything.
processDir(dir);

// Fix index.css body background just in case it's set there
const cssPath = path.join(__dirname, 'frontend', 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(/background-color: var\(--color-pay-gray-light\);/, 'background-color: #e0f0ea;');
fs.writeFileSync(cssPath, cssContent);

console.log('Matte blue/green theme applied.');
