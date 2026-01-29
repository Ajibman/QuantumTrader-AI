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

// core/js/cpilot/cpilot_engine.js

import { SimulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;
let running = false;

export const CPilotEngine = {

  loadSignal(signal) {
    activeSignal = signal;
  },

  start() {
    if (!activeSignal) throw new Error("No signal loaded");
    running = true;

    SimulationFeed.subscribe(this.onTick.bind(this));
    SimulationFeed.start();
  },

  stop() {
    running = false;
    SimulationFeed.stop();
  },

  onTick(tick) {
    if (!running) return;

    console.log("CPilot observing tick:", tick);
    this.emitToMonitor(tick);
  },

  emitToMonitor(tick) {
    const monitor = document.getElementById("cpilot-monitor");
    if (!monitor) return;

    monitor.textContent =
      `[${tick.timestamp}]
Price: ${tick.price}
Volume: ${tick.volume}\n\n` + monitor.textContent;
  }
};

// core/js/cpilot/cpilot_engine.js

import { SimulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;
let running = false;
let takeProfitTimer = null;

export const CPilotEngine = {

  loadSignal(signal) {
    activeSignal = signal;
  },

  start() {
    if (!activeSignal) throw new Error("No signal loaded");
    if (running) return;

    running = true;

    // ⏱ bind timing from Full Signal Object
    const { value, unit, label } = activeSignal.timing.takeProfit;
    const durationMs = this._toMilliseconds(value, unit);

    takeProfitTimer = setTimeout(() => {
      console.log(`Take-profit reached (${label})`);
      this.stop();
    }, durationMs);

    SimulationFeed.subscribe(this.onTick.bind(this));
    SimulationFeed.start();
  },

  stop() {
    running = false;

    if (takeProfitTimer) {
      clearTimeout(takeProfitTimer);
      takeProfitTimer = null;
    }

    SimulationFeed.stop();
  },

  onTick(tick) {
    if (!running) return;
    this.emitToMonitor(tick);
  },

  emitToMonitor(tick) {
    const monitor = document.getElementById("cpilot-monitor");
    if (!monitor) return;

    monitor.textContent =
      `[${tick.timestamp}]
Price: ${tick.price}
Volume: ${tick.volume}\n\n` + monitor.textContent;
  },

  _toMilliseconds(value, unit) {
    return {
      seconds: 1_000,
      minutes: 60_000,
      hours: 3_600_000,
      days: 86_400_000
    }[unit] * value;
  }
};
