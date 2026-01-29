 /* ======================================================
   QuantumTrader AI — Wallet Utility (Phase 5.1)
   Authority: Wallet + History + Audit
   Location: core/js/utils/wallet.js
====================================================== */

(function () {
  const STORAGE_KEY = "QT_WALLET_V1";

  /* =========================
     INTERNAL HELPERS
  ========================= */
  function nowISO() {
    return new Date().toISOString();
  }

  function uid() {
    return "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    const fresh = {
      active: false,
      balance: 0,
      history: [],
      permissions: {
        traderlab: false,
        tradingfloor: false,
        cpilot: false
      },
      createdAt: nowISO(),
      lastUpdated: nowISO()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  function save(wallet) {
    wallet.lastUpdated = nowISO();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  }

  function logEvent(wallet, entry) {
    const record = Object.freeze({
      id: uid(),
      type: entry.type,               // credit | debit | withdrawal | system
      source: entry.source,           // traderlab | tradingfloor | cpilot | system
      amount: Number(entry.amount),
      balanceAfter: wallet.balance,
      meta: entry.meta || {},
      timestamp: nowISO()
    });

    wallet.history.push(record);
  }

  /* =========================
     WALLET API
  ========================= */
  const QTWallet = {

    /* ----- Core ----- */
    get() {
      return load();
    },

    getBalance() {
      return load().balance;
    },

    isActive() {
      return load().active === true;
    },

    /* ----- Permissions ----- */
    grantAccess(page) {
      const wallet = load();
      wallet.permissions[page] = true;
      save(wallet);
    },

    canAccess(page) {
      const wallet = load();
      return wallet.permissions[page] === true;
    },

    /* ----- Funding / Credit ----- */
    activate(initialAmount = 0) {
      const wallet = load();

      if (!wallet.active) {
        wallet.active = true;
        wallet.balance += Number(initialAmount);

        logEvent(wallet, {
          type: "credit",
          source: "traderlab",
          amount: initialAmount,
          meta: { reason: "wallet_activation" }
        });

        save(wallet);
      }
    },

    credit(amount, meta = {}) {
      const wallet = load();
      const value = Number(amount);

      if (value <= 0) return;

      wallet.balance += value;

      logEvent(wallet, {
        type: "credit",
        source: meta.source || "system",
        amount: value,
        meta
      });

      save(wallet);
    },

    /* ----- Debit / Withdraw ----- */
    debit(amount, meta = {}) {
      const wallet = load();
      const value = Number(amount);

      if (value <= 0 || value > wallet.balance) return false;

      wallet.balance -= value;

      logEvent(wallet, {
        type: "debit",
        source: meta.source || "system",
        amount: value,
        meta
      });

      save(wallet);
      return true;
    },

    withdrawAll(meta = {}) {
      const wallet = load();
      if (wallet.balance <= 0) return 0;

      const amount = wallet.balance;
      wallet.balance = 0;

      logEvent(wallet, {
        type: "withdrawal",
        source: meta.source || "system",
        amount,
        meta
      });

      save(wallet);
      return amount;
    },

    /* ----- History (READ ONLY) ----- */
    getHistory() {
      return [...load().history]; // defensive copy
    },

    getHistoryBySource(source) {
      return load().history.filter(h => h.source === source);
    },

    resetHistory() {
      // intentionally restricted — internal/system only
      const wallet = load();
      wallet.history = [];
      save(wallet);
    }
  };

  /* =========================
     EXPOSE GLOBAL
  ========================= */
  window.QTWallet = QTWallet;

})();
