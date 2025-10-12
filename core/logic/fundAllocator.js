// core/logic/fundAllocator.js

const { getUserConsent } = require('../data/userProfile');
const { addFundsToPool } = require('../wallet/walletManager');

async function handleProfitConsent(userId, profitAmount) {
  const consent = await getUserConsent(userId); // Returns { philanthropy: true/false, cooperative: true/false }

  const allocated = {
    philanthropy: 0,
    cooperative: 0
  };

  if (consent.philanthropy) {
    allocated.philanthropy = profitAmount * 0.025;
    await addFundsToPool('philanthropy', allocated.philanthropy);
  }

  if (consent.cooperative) {
    allocated.cooperative = profitAmount * 0.025;
    await addFundsToPool('cooperative', allocated.cooperative);
  }

  return allocated;
}

module.exports = { handleProfitConsent };
```
