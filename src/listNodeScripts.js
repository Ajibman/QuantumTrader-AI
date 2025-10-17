'''js

// src/listNodeScripts.js

Certainly! Since you have `Node.js` scripts inside the `src/` folder, here's a *helper script* that scans for and reports all `.js` files within `src/` and offers a way to *collaborate or invoke them easily*.

*Script Name:* `listNodeScripts.js`

```js
// src/listNodeScripts.js

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname);
const nodeFiles = [];

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  files.forEach(file => {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.js')) {
      nodeFiles.push(path.relative(srcPath, fullPath));
    }
  });
}

walkDir(srcPath);

if (nodeFiles.length > 0) {
  console.log('✅ Node.js scripts in src/:');
  nodeFiles.forEach(script => console.log(` - ${script}`));
  console.log('\nTo run any: node src/<script-name>');
} else {
  console.log('❌ No .js files found in src/');
}
```
