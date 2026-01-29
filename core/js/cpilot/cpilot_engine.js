// core/js/cpilot/cpilot_engine.js

let activeSignal = null;
let simulationTimer = null;

export const CPilotEngine = {

  loadSignal(signal) {
    if (!signal || signal.execution?.engine !== "CPilot") {
      throw new Error("Invalid or incompatible signal");
    }

    activeSignal = signal;
    console.log("CPilot armed with signal:", signal);
  },

  start() {
    if (!activeSignal) {
      throw new Error("No signal loaded");
    }

    if (activeSignal.state.locked) {
      throw new Error("Signal is locked");
    }

    console.log("CPilot starting simulation…");

    const { value, unit, label } =
      activeSignal.timing.takeProfit;

    const durationMs = this._toMilliseconds(value, unit);

    simulationTimer = setTimeout(() => {
      console.log(`Take-profit reached (${label})`);
      this.stop();
    }, durationMs);

    return true;
  },

  stop() {
    if (simulationTimer) {
      clearTimeout(simulationTimer);
      simulationTimer = null;
    }

    console.log("CPilot stopped");
  },

  _toMilliseconds(value, unit) {
    const multipliers = {
      seconds: 1000,
      minutes: 60_000,
      hours: 3_600_000,
      days: 86_400_000
    };

    return value * multipliers[unit];
  }
};
