const fs = require('fs');
const path = require('path');

function traverseAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndReplace(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace ${import.meta.env.VITE_API_URL || ''} with ${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}
            const regex = /\$\{import\.meta\.env\.VITE_API_URL \|\| ''\}/g;
            if (regex.test(content)) {
                content = content.replace(regex, `\${(import.meta.env.VITE_API_URL || '').replace(/\\/$/, '')}`);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

traverseAndReplace(path.join(__dirname, 'src'));
console.log("Done fixing slashes.");
