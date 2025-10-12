'''js
// routes/socialRoutes.js
const express = require('express');
const router = express.Router();
const { allocateProfit } = require('../core/finance/profitAllocator');
const { getWalletBalances } = require('../core/finance/walletManager');

// POST: Allocate profit with user consent
router.post('/allocate-profit', (req, res) => {
  const { profitAmount, consent } = req.body;
  if (!profitAmount || typeof consent !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request payload.' });
  }

  const allocation = allocateProfit(profitAmount, consent);
  res.status(200).json(allocation);
});

// GET: Retrieve wallet balances
router.get('/wallets', (req, res) => {
  const balances = getWalletBalances();
  res.status(200).json(balances);
});

module.exports = router;
```
