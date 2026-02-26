// core/js/cpilot.js
function setTradeMode(mode){
  state.currentTradeMode = mode;
  state.notify(); // broadcast to observers
}

function setTpTiming(timing){
  state.currentTpTiming = timing;
  state.notify();
}

function setMarketGuidance(guidance){
  state.currentGuidance = guidance; // "favorable" | "caution" | "unfavorable"
  state.notify();
}
