```js
// /core/wallet/walletManager.js

const wallets = {
  philanthropy: { balance: 0, transactions: [] },
  cooperatives: { balance: 0, transactions: [] }
};

function allocateFunds(profit, consent) {
  if (!consent) return { success: false, message: "User declined contribution." };

  const contribution = profit * 0.025;

  wallets.philanthropy.balance += contribution;
  wallets.cooperatives.balance += contribution;

  const tx = {
    amount: contribution,
    timestamp: new Date().toISOString()
  };

  wallets.philanthropy.transactions.push({ ...tx, type: "Philanthropy" });
  wallets.cooperatives.transactions.push({ ...tx, type: "Cooperative" });

  return {
    success: true,
    message: "Funds allocated successfully.",
    updatedBalances: {
      philanthropy: wallets.philanthropy.balance,
      cooperatives: wallets.cooperatives.balance
    }
  };
}

function getWallets() {
  return wallets;
}

module.exports = {
  allocateFunds,
  getWallets
};
```

const wallet = {
  philanthropy: 0,
  cooperative: 0
};

function addFundsToPool(type, amount) {
  if (wallet[type] !== undefined) {
    wallet[type] += amount;
  }
  return Promise.resolve(wallet);
}

function getWalletBalances() {
  return Promise.resolve(wallet);
}

module.exports = { addFundsToPool, getWalletBalances };
```
