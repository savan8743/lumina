const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace double backslash version
    content = content.replace(/\(import\.meta\.env\.VITE_API_URL \|\| ''\)\.replace\(\/\\\\\/\\$\/, ''\)/g, "(import.meta.env.VITE_API_URL || '').replace(/\\/$/, '')");
    
    // Actually, just to be extremely safe against ALL Babel parsing errors for trailing slashes,
    // let's completely remove the .replace() and just use the variable, since we set it to a strict URL.
    content = content.replace(/\$\{\(import\.meta\.env\.VITE_API_URL \|\| ''\)\.replace\(\/[\\\\/]+\/\$\/, ''\)\}/g, "${import.meta.env.VITE_API_URL || ''}");
    content = content.replace(/\$\{\(import\.meta\.env\.VITE_API_URL \|\| ''\)\.replace\(\/\\\/\\$\/, ''\)\}/g, "${import.meta.env.VITE_API_URL || ''}");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
      count++;
    }
  }
});
console.log('Files fixed:', count);
