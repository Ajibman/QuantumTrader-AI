'''js
// controller/adminController.js
const fs = require('fs');
const path = require('path');

const walletPath = path.join(__dirname, '../wallets/qonexWallet.json');
const ngoDbPath = path.join(__dirname, '../data/ngoDatabase.json');

function getWalletBalances(req, res) {
  try {
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    res.json({ status: 'success', balances: walletData });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to read wallet balances' });
  }
}

function getContributionSummary(req, res) {
  try {
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const total = walletData.philanthropy + walletData.cooperative;
    res.json({
      status: 'success',
      contributions: {
        philanthropy: walletData.philanthropy,
        cooperative: walletData.cooperative,
        total
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error loading contribution summary' });
  }
}

function listRegisteredNGOs(req, res) {
  try {

const ngoData = JSON.parse(fs.readFileSync(ngoDbPath, 'utf-8'));
    res.json({ status: 'success', ngos: ngoData });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Unable to load NGO data' });
  }
}

module.exports = {
  getWalletBalances,
  getContributionSummary,
  listRegisteredNGOs
};
```
