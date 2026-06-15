 import { metaBrain } from "../brain/meta_brain/meta_brain.js";
import { AutoTraderOrchestrator } from "../autotrader/autotrader_orchestrator.js";

const orchestrator = new AutoTraderOrchestrator();

// ------------------------------------------------------
// NORMALIZER
// ------------------------------------------------------

function normalizeTrade(trade) {
  return {
    tradeId: trade.tradeId,
    asset: trade.asset,
    action: trade.action,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    pnl: trade.pnl,
    success: trade.pnl > 0,
    timestamp: Date.now()
  };
}

// ------------------------------------------------------
// CORE EXECUTION PIPELINE
// ------------------------------------------------------

function executeThroughOrchestrator(trade, signal, mode = "SIMULATION") {

  const control = orchestrator.evaluate(signal);

  // --------------------------
  // GLOBAL GATE
  // --------------------------

  if (!control.allowTrade) {
    return {
      status: "BLOCKED",
      mode,
      reason: control.mode,
      trade: null
    };
  }

  // --------------------------
  // RISK APPLICATION
  // --------------------------

  const adjustedTrade = {
    ...trade,
    riskMultiplier: control.riskMultiplier
  };

  const result = normalizeTrade(adjustedTrade);

  // --------------------------
  // FEEDBACK LOOP (META BRAIN)
  // --------------------------

  const success = result.success;

  if (mode === "SIMULATION") {
    metaBrain.recordSimulationOutcome(success);
  } else {
    metaBrain.recordLiveOutcome(success);
  }

  // --------------------------
  // RETURN STANDARDIZED OUTPUT
  // --------------------------

  return {
    status: "EXECUTED",
    mode,
    control,
    result
  };
}

// ------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------

export function executeSimulationTrade(trade, signal) {
  const output = executeThroughOrchestrator(trade, signal, "SIMULATION");

  console.log("[SIM]", output.status);

  return output;
}

export function executeLiveTrade(trade, signal) {
  const output = executeThroughOrchestrator(trade, signal, "LIVE");

  console.log("[LIVE]", output.status);

  return output;
}

// ------------------------------------------------------
// BATCH SIMULATION
// ------------------------------------------------------

export function runSimulationBatch(trades = [], signals = []) {

  const results = [];

  for (let i = 0; i < trades.length; i++) {
    results.push(
      executeSimulationTrade(trades[i], signals[i] || {})
    );
  }

  return results;
}
