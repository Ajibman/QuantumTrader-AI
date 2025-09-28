```js
// core/activationScheduler.js
const schedule = require('node-schedule');

// Core modules
const syncGlobalMarkets = require('./marketMatrix');
const startTraderLab = require('../lab/traderLab');
const startCPilot = require('../pilot/cPilot');
const startTradingFloor = require('../floor/tradingFloor');

function scheduleGlobalActivation() {
  const activationTime = new Date('2025-11-08T23:00:00.000Z'); // Midnight WA+1

  console.log("🕓 QT AI Scheduled Activation: Midnight Nov 09, 2025 (WA+1)");

  schedule.scheduleJob(activationTime, () => {
    console.log("🚀 QT AI Global Activation Commencing...");

    syncGlobalMarkets();
    startTraderLab();
    startCPilot();
    startTradingFloor();

    console.log("✅ All systems launched. QT AI is now LIVE.");
  });
}

module.exports = scheduleGlobalActivation;
```

---
