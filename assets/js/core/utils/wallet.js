 // wallet.js

const Wallet = {
  wallets: {}, // Store all user wallets here

  createWallet(userId) {
    if (!this.wallets[userId]) {
      this.wallets[userId] = { balance: 0 };
      this.syncLocalStorage(userId);
      return `Wallet created for ${userId}`;
    }
    return `Wallet already exists for ${userId}`;
  },

  deposit(userId, amount) {
    if (!this.wallets[userId]) this.createWallet(userId);
    this.wallets[userId].balance += amount;
    this.syncLocalStorage(userId);
    return `Deposited ₦${amount.toFixed(2)} to ${userId}`;
  },

  getBalance(userId) {
    return this.wallets[userId] ? this.wallets[userId].balance : 0;
  },

  transferToBank(userId) {
    if (!this.wallets[userId] || this.wallets[userId].balance <= 0)
      return "No funds to transfer.";
    
    const amount = this.wallets[userId].balance;
    this.wallets[userId].balance = 0;
    this.syncLocalStorage(userId);
    return `Transferred ₦${amount.toFixed(2)} to bank for ${userId}`;
  },

  // Sync individual user balance to localStorage
  syncLocalStorage(userId) {
    localStorage.setItem(`qtai_wallet_balance_${userId}`, this.getBalance(userId));
  },

  // Initialize wallet on page load
  init(userId) {
    if (!userId) return;
    this.createWallet(userId);
    this.updateBalanceDisplay(userId);
  },

  // Update the #wallet-balance element
  updateBalanceDisplay(userId) {
    const el = document.getElementById('wallet-balance');
    if (el) {
      const balance = this.getBalance(userId);
      el.textContent = `₦${parseFloat(balance).toFixed(2)}`;
    }
  }
};

export default Wallet;

// Helper function to refresh wallet display in UI
export function checkWallet(userId) {
  Wallet.updateBalanceDisplay(userId);
}

// Auto-init for single-user setup
const currentUserId = localStorage.getItem('qtai_userId') || 'guest';
Wallet.init(currentUserId);
