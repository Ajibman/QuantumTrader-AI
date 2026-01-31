 // core/js/cpilot/cpilot_engine.js

import { simulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;
let running = false;
let takeProfitTimer = null;

export const CPilotEngine = {

  /**
   * Arm the engine with a Full Signal Object
   */
  loadSignal(signal) {
    if (!signal || signal.execution?.engine !== "CPilot") {
      throw new Error("Invalid or incompatible signal");
    }

    activeSignal = signal;
    console.log("[CPilotEngine] Signal loaded:", signal);
  },

  /**
   * Start the CPilot simulation
   */
  start() {
    if (!activeSignal) throw new Error("No signal loaded");
    if (running) return;

    running = true;

    // ⏱ Bind timing from Full Signal Object
    const { value, unit, label } = activeSignal.timing.takeProfit || { value: 15, unit: "seconds", label: "15 Seconds" };
    const durationMs = this._toMilliseconds(value, unit);

    // Auto-stop at take-profit
    takeProfitTimer = setTimeout(() => {
      console.log(`[CPilotEngine] Take-profit reached (${label})`);
      this.stop();
    }, durationMs);

    // Subscribe to market ticks
    simulationFeed.subscribe(this.onTick.bind(this));

    // Start the simulation feed
    simulationFeed.start(activeSignal.timing);
    console.log("[CPilotEngine] Simulation started");
  },

  /**
   * Stop the CPilot simulation safely
   */
  stop() {
    running = false;

    if (takeProfitTimer) {
      clearTimeout(takeProfitTimer);
      takeProfitTimer = null;
    }

    simulationFeed.stop();
    console.log("[CPilotEngine] Simulation stopped");
  },

  /**
   * Called on every tick from SimulationFeed
   */
  onTick(tick) {
    if (!running) return;

    console.log("[CPilotEngine] Tick received:", tick);
    this.emitToMonitor(tick);
  },

  /**
   * Output tick to CPilot monitor UI (read-only)
   */
  emitToMonitor(tick) {
    const monitor = document.getElementById("cpilot-monitor");
    if (!monitor) return;

    monitor.textContent =
      `[${tick.timestamp}] Price: ${tick.price} Volume: ${tick.volume} Trend: ${tick.trend}\n\n` +
      monitor.textContent;
  },

  /**
   * Convert timing unit to milliseconds
   */
  _toMilliseconds(value, unit) {
    return {
      seconds: 1000,
      minutes: 60_000,
      hours: 3_600_000,
      days: 86_400_000
    }[unit] * value;
  }
};
