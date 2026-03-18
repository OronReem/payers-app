const fs = require('fs');
const path = require('path');

const frontendSrc = path.join(__dirname, 'frontend', 'src');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix text-gray-* classes
      content = content.replace(/text-gray-100/g, 'text-black/10');
      content = content.replace(/text-gray-200/g, 'text-black/20');
      content = content.replace(/text-gray-300/g, 'text-black/30');
      content = content.replace(/text-gray-400/g, 'text-black/40');
      content = content.replace(/text-gray-500/g, 'text-black/50');
      content = content.replace(/text-gray-600/g, 'text-black/60');
      content = content.replace(/text-gray-700/g, 'text-black/80');
      content = content.replace(/text-gray-800/g, 'text-black');
      content = content.replace(/text-gray-900/g, 'text-black');

      // Fix the bill image preview styling in Editor.jsx to show the whole bill
      if (file === 'Editor.jsx') {
        content = content.replace(
          /className="w-full h-32 object-cover object-top rounded-2xl shadow-sm border border-gray-200 opacity-90"/g,
          'className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-sm opacity-90 bg-white/50"'
        );
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(frontendSrc);
console.log('UI updates applied successfully.');
