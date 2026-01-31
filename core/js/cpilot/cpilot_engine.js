 // core/js/cpilot/cpilot_engine.js

import { simulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;
let running = false;
let takeProfitTimer = null;

export const CPilotEngine = {
  /**
   * Load a Full Signal Object into the engine.
   */
  loadSignal(signal) {
    if (!signal || signal.execution?.engine !== "CPilot") {
      throw new Error("[CPilotEngine] Invalid or incompatible signal");
    }
    activeSignal = signal;
    console.log("[CPilotEngine] Signal loaded:", signal);
  },

  /**
   * Start CPilot execution.
   * Binds simulation feed and take-profit timing.
   */
  start() {
    if (!activeSignal) throw new Error("[CPilotEngine] No signal loaded");
    if (running) return; // prevent double-start

    running = true;

    // ⏱ Bind take-profit from Full Signal Object
    const { value, unit, label } = activeSignal.timing.takeProfit;
    const durationMs = this._toMilliseconds(value, unit);

    takeProfitTimer = setTimeout(() => {
      console.log(`[CPilotEngine] Take-profit reached (${label})`);
      this.stop();
    }, durationMs);

    // Subscribe to simulation feed
    simulationFeed.subscribe(this.onTick.bind(this));
    simulationFeed.start(activeSignal.timing);

    console.log("[CPilotEngine] Started");
  },

  /**
   * Stop CPilot execution safely.
   */
  stop() {
    running = false;

    if (takeProfitTimer) {
      clearTimeout(takeProfitTimer);
      takeProfitTimer = null;
    }

    simulationFeed.stop();
    console.log("[CPilotEngine] Stopped");
  },

  /**
   * Handle each market tick from simulation feed.
   */
  onTick(tick) {
    if (!running) return;

    console.log("[CPilotEngine] Tick:", tick);
    this.emitToMonitor(tick);
  },

  /**
   * Push tick to CPilot monitor.
   */
  emitToMonitor(tick) {
    const monitor = document.getElementById("cpilot-monitor");
    if (!monitor) return;

    monitor.textContent =
      `[${tick.timestamp}] Price: ${tick.price} Volume: ${tick.volume}\n\n` +
      monitor.textContent;
  },

  /**
   * Convert timing to milliseconds
   */
  _toMilliseconds(value, unit) {
    const multipliers = {
      seconds: 1_000,
      minutes: 60_000,
      hours: 3_600_000,
      days: 86_400_000
    };
    return (multipliers[unit] || 1000) * value;
  }
};
