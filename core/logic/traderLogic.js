```js
// core/logic/traderLogic.js

function processProfit(profitAmount, userConsent) {
  if (!userConsent) return { retained: profitAmount, donated: 0 };

  const donation = profitAmount * 0.05;
  const toPhilanthropy = donation / 2;
  const toCooperatives = donation / 2;
  const retained = profitAmount - donation;

  // Simulated transaction logs
  logContribution('philanthropy', toPhilanthropy);
  logContribution('cooperatives', toCooperatives);

  return { retained, donated: donation };
}

function logContribution(destination, amount) {
  console.log(`[new Date().toISOString()] Donatedamount to{destination}`);
}

module.exports = { processProfit };
```

// core/trading/TraderLogic.js
const eventBus = require('../../utils/eventBus');

// When profit is taken (mock example)
function handleTakeProfit(userId, profitAmount) {
  console.log(`Profit taken: 
    
{profitAmount} by user ${userId}`);

  // Emit event for contribution processing
  eventBus.emit('profitTaken', { userId, profitAmount });
}

module.exports = { handleTakeProfit }
```

In `contributionManager.js`, listen and handle:
```
// core/finance/contributionManager.js
const eventBus = require('../../utils/eventBus');
const walletManager = require('./walletManager'); // hypothetical module

const CONTRIBUTION_PERCENT = 0.05; // 5% total
const PHILANTHROPY_SHARE = 0.025;
const COOPERATIVE_SHARE = 0.025;

eventBus.on('profitTaken', ({ userId, profitAmount }) => {
  const contribution = profitAmount * CONTRIBUTION_PERCENT;

  // Optional: check user consent before proceeding
  const consent = true; // Placeholder — replace with real check

  if (consent && contribution > 0) {
    walletManager.allocateFunds('philanthropy', PHILANTHROPY_SHARE * profitAmount);
