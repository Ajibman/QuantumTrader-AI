/* =========================================================
   QuantumTrader-AI
   AutoTrader Execution Adapter — SERIAL 5 of 6
   Purpose: Convert discipline-approved signals to live trades
   ========================================================= */

import { AutoTraderState } from "./autotrader.core.mjs";
import { evaluateDiscipline } from "./autotrader.discipline.mjs";

/* ---------- EXECUTION SETTINGS ---------- */
export const ExecutionMode = {
  SIMULATION: "SIMULATION",
  LIVE: "LIVE"
};

export let currentMode = ExecutionMode.SIMULATION;

/* ---------- TOGGLE MODE ---------- */
export function setExecutionMode(mode) {
  if (!Object.values(ExecutionMode).includes(mode)) {
    throw new Error("Invalid execution mode");
  }
  currentMode = mode;
  console.log("[ExecutionAdapter] Mode set to", currentMode);
}

/* ---------- CORE EXECUTION FUNCTION ---------- */
export function executeSignal(signal, context) {
  const disciplineResult = evaluateDiscipline({ ...context, signal });

  if (!disciplineResult.permitted) {
    console.log("[ExecutionAdapter] Signal blocked by discipline:", disciplineResult.reason);
    return { executed: false, reason: disciplineResult.reason };
  }

  if (currentMode === ExecutionMode.SIMULATION) {
    console.log("[ExecutionAdapter] Simulation ONLY →", signal.action);
    return { executed: false, simulated: true };
  }

  if (currentMode === ExecutionMode.LIVE) {
    // Placeholder: replace with broker API call
    console.log("[ExecutionAdapter] LIVE TRADE →", signal.action);
    // Example: broker.placeOrder(signal.action, quantity, price)
    return { executed: true, simulated: false };
  }
}

/* ---------- BATCH EXECUTION FOR MULTIPLE SIGNALS ---------- */
export function executeBatchSignals(signals, context) {
  return signals.map(signal => executeSignal(signal, context));
}
