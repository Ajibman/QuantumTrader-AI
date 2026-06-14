 // TradingFloor Run Controller — App-ready

import { tradingFloorFeed } from "./tradingfloor_sim_feed.js";
import { evaluateAccess } from "./traderlab_execution_gate.js";
import { recordCycleOutcome } from "../cpilot/cpilot_memory.js";

let activeSignal = null;
let running = false;

/**
 * Load Signal
 */
export function loadTradingFloorSignal(signal) {
  if (!signal) {
    throw new Error("No signal loaded");
  }

  activeSignal = signal;
}

/**
 * Start TradingFloor
 */
export function startTradingFloor() {

  if (!activeSignal) {
    throw new Error("TradingFloor not armed with signal");
  }

  if (running) return;

  /**
   * CPilot Permission Check
   */
  const verdict = evaluateAccess({
    marketData: activeSignal.marketData || {},
    qualification: {
      allowed: true
    }
  });

  if (!verdict.allowed) {
    logMonitor(
      `CPilot HOLD: ${verdict.reason}`
    );
    return;
  }

  running = true;

  const tp = activeSignal.tp || {
    value: 5,
    unit: "m"
  };

  const timing = {
    value: tp.value,
    unit: tp.unit
  };

  /**
   * Bind Simulation Feed
   */
  tradingFloorFeed.subscribe(onTick);
  tradingFloorFeed.start(timing);

  updateButtons(true);

  logMonitor(
    `TradingFloor STARTED — Auto TP: ${timing.value}${timing.unit}`
  );

  logMonitor(
    `CPilot Clearance — Confidence ${Math.round(
      verdict.confidence * 100
    )}%`
  );
}

/**
 * Stop TradingFloor
 */
export function stopTradingFloor() {

  running = false;

  tradingFloorFeed.stop();

  activeSignal = null;

  updateButtons(false);

  logMonitor("TradingFloor STOPPED");
}

/**
 * Feed Tick Handler
 */
function onTick(tick) {

  if (!running) return;

  logMonitor(
    `[${tick.timestamp}] Price: ${tick.price}, Volume: ${tick.volume}`
  );

  /**
   * Temporary Learning Feed
   *
   * Replace later with:
   * - execution engine result
   * - strategy result
   * - simulation outcome
   */
  const result = {
    pnl: (Math.random() - 0.5) * 10
  };

  recordCycleOutcome({
    guidance: "execution",
    result,
    marketData: activeSignal?.marketData || {}
  });
}

/**
 * Monitor Logging
 */
function logMonitor(msg) {

  const monitor =
    document.getElementById("simulation-monitor");

  if (!monitor) return;

  const p = document.createElement("p");

  p.textContent = msg;

  monitor.appendChild(p);

  monitor.scrollTop =
    monitor.scrollHeight;
}

/**
 * UI State
 */
function updateButtons(isRunning) {

  const startBtn =
    document.getElementById("start-trade-btn");

  const stopBtn =
    document.getElementById("stop-trade-btn");

  if (startBtn) {
    startBtn.disabled = isRunning;
  }

  if (stopBtn) {
    stopBtn.disabled = !isRunning;
  }
}

/**
 * Status Snapshot
 */
export function getTradingFloorStatus() {
  return {
    running,
    activeSignal
  };
}
