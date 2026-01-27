// core/js/state.js
const state = {
  currentTradeMode: 'Manual',
  currentTpTiming: '15s',
  currentGuidance: 'awaiting', // "favorable" | "caution" | "unfavorable"
  walletBalance: 0,
  observers: [], // functions to call on state change
  subscribe(fn) { this.observers.push(fn); },
  notify() { this.observers.forEach(fn => fn(this)); }
};
