/* =========================================================
   QuantumTrader-AI
   AutoTrader Orchestrator — FULL 6-SERIAL INTEGRATION
   ========================================================= */

import { AutoTraderState, startAutoTraderTimer } from "./autotrader.core.mjs";
import { evaluateStrategies } from "./autotrader.strategy.mjs";
import { evaluateDiscipline } from "./autotrader.discipline.mjs";
import { simulateTradeTick } from "./autotrader.traderlab.mjs";
import { executeBatchSignals, setExecutionMode, ExecutionMode } from "./autotrader.execution.mjs";
import { startMedusa } from "./autotrader.medusa.mjs";

/* ---------- CONFIGURATION ---------- */
const ORCHESTRATOR_CONFIG = {
  liftbridgeScore: 21,     // default max, auto-adjustable by Medusa later
  autoTraderIntervalMs: 30_000,  // AutoTrader tick
  initialBalance: 5000,
  initialEquity: 5000,
  initialExposure: 0,
  liveMode: false          // start in SIMULATION
};

/* ---------- SYSTEM CONTEXT ---------- */
const SystemContext = {
  liftbridgeScore: ORCHESTRATOR_CONFIG.liftbridgeScore,
  balance: ORCHESTRATOR_CONFIG.initialBalance,
  equity: ORCHESTRATOR_CONFIG.initialEquity,
  exposure: ORCHESTRATOR_CONFIG.initialExposure,
  lastTradeTime: null
};

/* ---------- INITIALIZE EXECUTION MODE ---------- */
setExecutionMode(
  ORCHESTRATOR_CONFIG.liveMode ? ExecutionMode.LIVE : ExecutionMode.SIMULATION
);

/* ---------- AUTO-TRADER MAIN LOOP ---------- */
function autoTraderTick() {
  // 1️⃣ Evaluate strategy signals
  const signals = evaluateStrategies({ tick: { price: Math.random()*100, timestamp: Date.now(), volume: 1000 } });

  // 2️⃣ Simulate signals in TraderLab
  const simulatedResults = simulateTradeTick({ ...SystemContext, liftbridgeScore: SystemContext.liftbridgeScore, marketTick: { price: Math.random()*100, timestamp: Date.now(), volume: 1000 }, lastTradeTime: SystemContext.lastTradeTime, balance: SystemContext.balance, equity: SystemContext.equity, exposure: SystemContext.exposure });

  // 3️⃣ Execute approved signals (Live / Simulation)
  const executionResults = executeBatchSignals(signals, SystemContext);

  // 4️⃣ Update lastTradeTime if any executed
  const anyExecuted = executionResults.some(r => r.executed);
  if (anyExecuted) SystemContext.lastTradeTime = Date.now();

  // Optional: adjust balance/exposure here if liveMode
}

/* ---------- START AUTO-TRADER ---------- */
export function startOrchestrator() {
  if (AutoTraderState.enabled) return console.warn("[Orchestrator] AutoTrader already running");

  AutoTraderState.enabled = true;
  AutoTraderState.interval = ORCHESTRATOR_CONFIG.autoTraderIntervalMs;
  startMedusa(); // Serial 6

  startAutoTraderTimer(autoTraderTick, AutoTraderState.interval);

  console.log("[Orchestrator] AutoTrader started in", ORCHESTRATOR_CONFIG.liveMode ? "LIVE" : "SIMULATION", "mode");
}

/* ---------- STOP AUTO-TRADER ---------- */
export function stopOrchestrator() {
  if (!AutoTraderState.enabled) return console.warn("[Orchestrator] AutoTrader not running");

  clearInterval(AutoTraderState.timer);
  AutoTraderState.timer = null;
  AutoTraderState.enabled = false;
  console.log("[Orchestrator] AutoTrader stopped");
}

/* ---------- TOGGLE MODE DURING RUN ---------- */
export function toggleLiveMode(enable) {
  setExecutionMode(enable ? ExecutionMode.LIVE : ExecutionMode.SIMULATION);
  console.log("[Orchestrator] Live mode", enable ? "ENABLED" : "DISABLED");
}

/* ---------- SAMPLE USAGE ---------- */
/*
import { startOrchestrator, stopOrchestrator, toggleLiveMode } from "./autotrader.orchestrator.mjs";

// Start AutoTrader
startOrchestrator();

// Switch to live trading
toggleLiveMode(true);

// Stop AutoTrader
stopOrchestrator();
*/
