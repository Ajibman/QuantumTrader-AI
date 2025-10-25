```js
const ngoDatabase = require('../../data/ngoDatabase.json');
const walletManager = require('../finance/walletManager');

function getDashboardData() {
  return {
    totalBalance: walletManager.getTotalBalance(),
    ngos: ngoDatabase.ngos,
    auditLog: walletManager.getAuditLog(),
  };
}

function updateNGOStatus(ngoId, newStatus) {
  const ngo = ngoDatabase.ngos.find(n => n.id === ngoId);
  if (ngo) {
    ngo.status = newStatus;
    return { success: true, message: `NGO status updated to ${newStatus}` };
  }
  return { success: false, message: 'NGO not found' };
}

module.exports = {
  getDashboardData,
  updateNGOStatus
};
```
