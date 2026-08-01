const fs = require('fs');
const path = require('path');

const envVar = "import.meta.env.VITE_API_URL || ''";

function traverseAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndReplace(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace fetch('http://localhost:5000/api/...')
            const fetchLocalhostRegex = /fetch\(\s*(['"])http:\/\/localhost:5000(\/api\/.*?)\1/g;
            if (fetchLocalhostRegex.test(content)) {
                content = content.replace(fetchLocalhostRegex, (match, p1, p2) => {
                    return `fetch(\`\${${envVar}}${p2}\``;
                });
                modified = true;
            }

            // Replace fetch('/api/...')
            const fetchApiRegex = /fetch\(\s*(['"])(\/api\/.*?)\1/g;
            if (fetchApiRegex.test(content)) {
                content = content.replace(fetchApiRegex, (match, p1, p2) => {
                    return `fetch(\`\${${envVar}}${p2}\``;
                });
                modified = true;
            }
            
            // Handle fetch(url, ...) where url is a template literal: fetch(`/api/products/${id}`)
            // This is harder because it's already using backticks.
            const fetchTemplateRegex = /fetch\(\s*`(\/api\/.*?)`/g;
            if (fetchTemplateRegex.test(content)) {
                content = content.replace(fetchTemplateRegex, (match, p1) => {
                    return `fetch(\`\${${envVar}}${p1}\``;
                });
                modified = true;
            }
            
            // Wait, we also need to remove console.log?
            // "Remove debug logs, console.log statements"
            const consoleLogRegex = /\bconsole\.log\s*\([^)]*\)\s*;/g;
            if (consoleLogRegex.test(content)) {
                content = content.replace(consoleLogRegex, "");
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
console.log("Done updating frontend files.");
