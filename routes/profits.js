''`js
const express = require('express');
const router = express.Router();
const { getUserConsent } = require('../core/data/userProfile');
const { addFundsToPool } = require('../core/wallet/walletManager');

router.post('/share', async (req, res) => {
  const { userId, profitAmount } = req.body;
  const consent = await getUserConsent(userId);

  if (consent.philanthropy) await addFundsToPool('philanthropy', profitAmount * 0.025);
  if (consent.cooperative) await addFundsToPool('cooperative', profitAmount * 0.025);

  res.json({ message: "Profit shared successfully.", consent });
});

module.exports = router;
```
