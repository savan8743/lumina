const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // The exact string in the files is: replace(/\\/$/, '')
    // We want to replace it with: replace(/\/$/, '')
    let target = "replace(/\\\\/$/, '')";
    let replacement = "replace(/\\/$/, '')";
    
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
      modifiedCount++;
    }
  }
});

console.log("Total files modified:", modifiedCount);
