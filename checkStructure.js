'''js
 checkStructure.js
 Verifies that src/server.js and other key paths exist after restructuring.
 Run with: node checkStructure.js

const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname);
const srcPath = path.join(base, 'src');
const serverFile = path.join(srcPath, 'server.js');
const foldersToCheck = [
  'src/controllers',
  'src/models',
  'src/routes',
  'src/utils',
  'src/middleware',
  'src/config'
];

console.log('\n🔍 QuantumTrader-AI Structure Check\n----------------------------------');

if (fs.existsSync(srcPath)) {
  console.log(`✅ "src" directory found at: ${srcPath}`);
} else {
  console.log(`❌ "src" directory missing! Please ensure it's created.`);
}

if (fs.existsSync(serverFile)) {
  console.log(`✅ "server.js" found inside src/`);
} else {
  console.log(`❌ Missing "server.js" in src/. Check file placement.`);
}

// Check subfolders
foldersToCheck.forEach(folder => {
  const fullPath = path.join(base, folder);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${folder} exists`);
  } else {
    console.log(`⚠️  ${folder} missing`);
  }
});

console.log('\n✅ Structure check complete.\n');

Great. Here's an *improved `checkStructure.js` script* that:

- Checks for casing issues (`Assets` → `assets`, `Public` → `public`, etc.)
- *Optionally renames them automatically* (if you allow it)
- Helps keep your folder structure consistent for Termux, Git, and Node.js (which are case-sensitive)

const fs = require('fs');
const path = require('path');

// Expected folder names (all lowercase)
const expectedFolders = ['views', 'assets', 'public', 'src'];

expectedFolders.forEach(folder => {
  const entries = fs.readdirSync(__dirname, { withFileTypes: true });

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const actual = entry.name;
      if (actual.toLowerCase() === folder && actual !== folder) {
        console.log(`⚠️  Found case mismatch: 'actual' should be '{folder}'`);

        // Attempt rename
        try {
          fs.renameSync(path.join(_dirname, actual), path.join(_dirname, folder));
          console.log(`✅ Renamed 'actual' to '{folder}'`);
        } catch (err) {
          console.error(`❌ Failed to rename '${actual}':`, err.message);
        }
      }
    }
  });
});
```

 
