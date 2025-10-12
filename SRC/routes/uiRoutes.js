'''js
// routes/uiRoutes.js
const express = require('express');
const router = express.Router();
const { processProfit } = require('../core/logic/traderLogic');

// Simulated user profit + consent check
router.post('/take-profit', (req, res) => {
  const { profit, consent } = req.body;

  if (typeof profit !== 'number' || typeof consent !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request format.' });
  }

  const result = processProfit(profit, consent);
  res.json(result);
});

router.get('/social-responsibility', (req, res) => {
  res.send('Welcome to QonexAI Social Responsibility Portal.');
});

router.get('/cooperatives', (req, res) => {
  res.send('Welcome to QonexAI Cooperatives Network.');
});

module.exports = router;

app.get('/modals/takeProfitModal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'path/to/takeProfitModal.html'));
});
