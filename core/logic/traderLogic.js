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
