 /* =========================================
   QuantumTrader AI — Core State Authority
========================================= */

window.QTState = {
  mode: 'IDLE',
  trainingCompleted: false,
  paymentLayer: 'NONE',

  init() {
    console.log('[QTState] initialized');
  },

  bindUI() {
    const buttons = document.querySelectorAll('[data-action]');
    if (!buttons.length) {
      console.warn('[QTState] No actionable buttons found');
      return;
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleAction(action);
      });
    });

    console.log('[QTState] UI bound to actions');
  },

  handleAction(action) {
    console.log('[QTState] Action received →', action);

    switch (action) {
      case 'ENTER_DASHBOARD':
        window.location.href = 'index.html';
        break;

      case 'START_SIMULATION':
        this.mode = 'SIMULATION';
        console.log('[QTState] Simulation started');
        break;

      default:
        console.warn('[QTState] Unknown action:', action);
    }
  }
};

// TEMPORARY — for testing only
window.forceExpire = () => {
  AppState.subscription.expiresAt = Date.now() - 1000;
  saveState();
  alert("Subscription forcibly expired for test.");
};

// core/js/state.js

const AppState = {
  user: {
    id: "primary_user",
    traderLab: {
      paid: false,
      expiresAt: null,
      passed: false
    }
  },

  hasValidTraderLabAccess() {
    const exp = this.user.traderLab.expiresAt;
    return exp && Date.now() < exp;
  }
};
