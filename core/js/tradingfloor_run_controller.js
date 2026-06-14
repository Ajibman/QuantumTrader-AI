 // TradingFloor Run Controller — Fully Integrated Event + CPilot System

import { tradingFloorFeed } from "./tradingfloor_sim_feed.js";

import { evaluateAccess } from "./traderlab_execution_gate.js";
import { recordCycleOutcome } from "../cpilot/cpilot_memory.js";

import { emit } from "../event_bus.js";
import { EVENTS } from "../event_types.js";

let activeSignal = null;
let running = false;

/**
 * LOAD SIGNAL
 */
export function loadTradingFloorSignal(signal) {
  if (!signal) throw new Error("No signal loaded");
  activeSignal = signal;
}

/**
 * START TRADING FLOOR
 */
export function startTradingFloor() {
  if (!activeSignal) throw new Error("TradingFloor not armed with signal");
  if (running) return;

  // 1. Execution Gate check (CPilot HOLD system)
  const verdict = evaluateAccess({
    marketData: activeSignal.marketData || {},
    qualification: { allowed: true }
  });

  if (!verdict.allowed) {
    logMonitor(`CPilot HOLD: ${verdict.reason}`);
    return;
  }

  running = true;

  // 2. Emit system event
  emit(EVENTS.EXECUTION_START, {
    signal: activeSignal,
    timestamp: Date.now()
  });

  const tp = activeSignal.tp || { value: 5, unit: "s" };

  // 3. Start feed
  tradingFloorFeed.subscribe(onTick);
  tradingFloorFeed.start(tp);

  updateButtons(true);

  logMonitor(`TradingFloor STARTED — TP: ${tp.value}${tp.unit}`);
  logMonitor(`CPilot clearance: APPROVED`);
}

/**
 * STOP TRADING FLOOR
 */
export function stopTradingFloor() {
  running = false;

  tradingFloorFeed.stop();

  emit(EVENTS.EXECUTION_STOP, {
    signal: activeSignal,
    timestamp: Date.now()
  });

  activeSignal = null;

  updateButtons(false);

  logMonitor("TradingFloor STOPPED");
}

/**
 * CORE TICK LOOP (SYSTEM HEARTBEAT)
 */
function onTick(tick) {
  if (!running) return;

  // 1. Global tick event
  emit(EVENTS.TICK, {
    tick,
    signal: activeSignal
  });

  logMonitor(
    `[${tick.timestamp}] Price: ${tick.price}, Volume: ${tick.volume}`
  );

  // 2. Simulated execution outcome (placeholder engine)
  const result = {
    pnl: (Math.random() - 0.5) * 10
  };

  // 3. Strategy learning event
  emit(EVENTS.STRATEGY_RESULT, {
    result,
    marketData: activeSignal?.marketData || {}
  });

  // 4. CPilot memory learning (fallback safe path)
  recordCycleOutcome({
    guidance: "execution",
    result,
    marketData: activeSignal?.marketData || {}
  });
}

/**
 * LOGGING
 */
function logMonitor(msg) {
  const monitor = document.getElementById("simulation-monitor");
  if (!monitor) return;

  const p = document.createElement("p");
  p.textContent = msg;

  monitor.appendChild(p);
  monitor.scrollTop = monitor.scrollHeight;
}

/**
 * UI CONTROL
 */
function updateButtons(isRunning) {
  const startBtn = document.getElementById("start-trade-btn");
  const stopBtn = document.getElementById("stop-trade-btn");

  if (startBtn) startBtn.disabled = isRunning;
  if (stopBtn) stopBtn.disabled = !isRunning;
}

/**
 * STATUS
 */
export function getTradingFloorStatus() {
  return {
    running,
    activeSignal
  };
}
