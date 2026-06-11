// core/js/state.js
// QuantumTrader-AI Global State Manager

const state = {

  // Trading State
  currentTradeMode: "Manual",
  currentTpTiming: "15s",
  currentGuidance: "awaiting", // favorable | caution | unfavorable

  // Wallet State
  walletBalance: 0,

  // User Progress
  traderLabCompleted: false,
  cPilotQualified: false,
  tradingFloorApproved: false,

  // Observer Registry
  observers: [],

  /**
   * Subscribe to state updates
   */
  subscribe(fn) {
    if (typeof fn === "function") {
      this.observers.push(fn);
    }
  },

  /**
   * Remove observer
   */
  unsubscribe(fn) {
    this.observers = this.observers.filter(
      observer => observer !== fn
    );
  },

  /**
   * Notify observers
   */
  notify() {
    this.observers.forEach(observer => {
      try {
        observer(this);
      } catch (error) {
        console.error(
          "State observer error:",
          error
        );
      }
    });
  },

  /**
   * Generic state update helper
   */
  update(key, value) {
    if (key in this) {
      this[key] = value;
      this.notify();
    }
  },

  /**
   * Safe state snapshot
   */
  getSnapshot() {
    return {
      currentTradeMode: this.currentTradeMode,
      currentTpTiming: this.currentTpTiming,
      currentGuidance: this.currentGuidance,
      walletBalance: this.walletBalance,
      traderLabCompleted: this.traderLabCompleted,
      cPilotQualified: this.cPilotQualified,
      tradingFloorApproved: this.tradingFloorApproved
    };
  }

};

export default state;
