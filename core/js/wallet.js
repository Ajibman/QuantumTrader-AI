// core/js/wallet.js

const Wallet = {
  balances: {
    primary_user: 0
  },

  getBalance(userId) {
    return this.balances[userId] || 0;
  }
};
