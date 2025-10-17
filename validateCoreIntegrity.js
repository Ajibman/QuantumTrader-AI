 ```js
// validateCoreIntegration.js

const fs = require('fs');
const path = require('path');

const primaryPath = path.join(__dirname, 'src', 'core');
const fallbackPath = path.join(__dirname, 'SRC', 'core');

if (fs.existsSync(primaryPath)) {
  console.log('✅ Core folder found in src/.');
  process.exit(0);
} else if (fs.existsSync(fallbackPath)) {
  console.warn('⚠️ Core folder not found in src/, but found in SRC/. Consider renaming to maintain consistency.');
  process.exit(0);
} else {
  console.error('❌ Core folder not found in either src/ or SRC/. Please ensure it exists.');
  process.exit(1);
}
```
