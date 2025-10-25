```js
// testTraderLab.js
const traderLab = require('./core/lab/traderLab');

// Simulate server calling init()
async function testInit() {
  try {
    await traderLab.init();
    console.log('✅ TraderLab init() ran successfully');
  } catch (err) {
    console.error('❌ TraderLab init() failed:', err);
  }
}

testInit();
```   
