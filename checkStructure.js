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
