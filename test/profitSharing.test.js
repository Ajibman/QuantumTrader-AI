```js
// test/profitSharing.test.js

const { getUserConsent } = require('../core/data/userProfile');
const { addFundsToPool, getWalletBalances } = require('../core/wallet/walletManager');

async function simulateProfitSharing(userId, profitAmount) {
  const consent = await getUserConsent(userId);
  if (consent.philanthropy) {
    await addFundsToPool('philanthropy', profitAmount * 0.025);
  }
  if (consent.cooperative) {
    await addFundsToPool('cooperative', profitAmount * 0.025);
  }

  const balances = await getWalletBalances();
  console.log(`User: ${userId}, Consent:`, consent);
  console.log(`Wallet Balances:`, balances);
}

// Example test run
simulateProfitSharing('user001', 10000);
simulateProfitSharing('user002', 5000);
```

---
  
