```js
// validateFolderNames.js

const fs = require('fs');
const path = require('path');

const requiredFolders = ['src', 'assets', 'public'];
const rootDir = __dirname;

let errors = [];

requiredFolders.forEach(folder => {
  const folderPath = path.join(rootDir, folder);

  if (!fs.existsSync(folderPath)) {
    errors.push(`❌ Missing required folder: folder`);
  );

fs.readdirSync(rootDir,  withFileTypes: true ).forEach(entry => 
  if (entry.isDirectory()) 
    const actualName = entry.name;
    const lowerName = actualName.toLowerCase();

    if (actualName !== lowerName        requiredFolders.includes(lowerName)) 
      errors.push(`⚠️ Folder "{actualName}" should be lowercase: "${lowerName}"`);
    }
  }
});

if (errors.length) {
  console.log('🧪 Folder Validation Report:\n');
  errors.forEach(err => console.log(err));
  process.exit(1);
} else {
  console.log('✅ All folder names are valid.');
}
```
