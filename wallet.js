```js
// wallet.js

const Wallet = {
  balance: 0,

  createWallet(userId) {
    this[userId] = { balance: 0 };
    return `Wallet created for userId`;
  ,

  deposit(userId, amount) 
    if (!this[userId]) this.createWallet(userId);
    this[userId].balance += amount;
    return `Depositedamount to{userId}`;
  },

  getBalance(userId) {
    return this[userId] ? this[userId].balance : 0;
  },

  transferToBank(userId) {
    if (!this[userId] || this[userId].balance <= 0) return "No funds to transfer.";
    const amount = this[userId].balance;
    this[userId].balance = 0;
    return `Transferred 
    
{amount} to bank for ${userId}`;
  }
};

export default Wallet;

javascript
function checkWallet() {
  const balance = localStorage.getItem('qtai_wallet_balance') || 0;
  document.getElementById('wallet-balance').textContent = `₦${parseFloat(balance).toFixed(2)}`;
}
