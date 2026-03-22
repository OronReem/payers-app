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
      
      // Make all text black
      content = content.replace(/text-white(\/[0-9]+)?/g, 'text-black');
      content = content.replace(/text-black\/[0-9]+/g, 'text-black');
      content = content.replace(/text-pay-[a-z-]+/g, 'text-black');
      // Any remaining text-gray-* from tailwind
      content = content.replace(/text-gray-[0-9]+/g, 'text-black');
      
      // Fix buttons and dark backgrounds that would hide black text
      content = content.replace(/bg-pay-blue/g, 'bg-gray-200 border border-black');
      content = content.replace(/bg-pay-gray-dark/g, 'bg-white border-2 border-black');
      content = content.replace(/bg-gray-900/g, 'bg-gray-100');
      content = content.replace(/bg-pay-purple/g, 'text-black bg-transparent');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log('Enforced black text everywhere and lightened backgrounds.');
