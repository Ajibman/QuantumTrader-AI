// core/js/cpilot.js

const state = {
  currentTradeMode: "manual",
  currentTpTiming: "normal",
  currentGuidance: "caution",

  notify() {
    console.log("CPilot state updated");
  }
};

const cpilot = {

  setTradeMode(mode) {
    state.currentTradeMode = mode;
    state.notify();
  },

  setTpTiming(timing) {
    state.currentTpTiming = timing;
    state.notify();
  },

  setMarketGuidance(guidance) {
    state.currentGuidance = guidance;
    state.notify();
  },

  getStatus() {
    return {
      tradeMode: state.currentTradeMode,
      tpTiming: state.currentTpTiming,
      guidance: state.currentGuidance
    };
  }

};

export default cpilot;
