```js
// src/index.js

console.log('🚀 QonexAI Node.js Core: Index Booting Up');

// Define collaborators and their roles
const collaborators = [
  { name: 'validateFolderNames', path: './validateFolderNames.js' },
  { name: 'validateCoreIntegration', path: './validateCoreIntegration.js' },
  { name: 'listNodeScripts', path: './listNodeScripts.js' }
];

const fs = require('fs');
const path = require('path');

// Loop through and initialize each script if it exists
collaborators.forEach(({ name, path: relPath }) => {
  const absPath = path.join(__dirname, relPath);
  if (fs.existsSync(absPath)) {
    console.log(`✅ Loading collaborator: name`);
    require(absPath);
   else 
    console.warn(`⚠️  Collaborator "{name}" not found at ${relPath}`);
  }
});

console.log('✅ QonexAI Node.js Index initialized. All assigned modules managed.');
```
