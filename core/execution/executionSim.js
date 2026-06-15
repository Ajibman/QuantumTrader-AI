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
// EXECUTION GATE
// ------------------------------------------------------

function executeThroughOrchestrator(trade, signal) {

  const control = orchestrator.evaluate(signal);

  // --------------------------
  // HARD GATE (NO OVERRIDE)
  // --------------------------

  if (!control.allowTrade) {
    return {
      status: "BLOCKED",
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
  // FEEDBACK LOOP
  // --------------------------

  metaBrain.recordLiveOutcome(result.success);

  return {
    status: "EXECUTED",
    mode: control.mode,
    control,
    result
  };
}

// ------------------------------------------------------
// PUBLIC INTERFACE
// ------------------------------------------------------

export function executeSimulationTrade(trade, signal) {
  const output = executeThroughOrchestrator(trade, signal);

  console.log("[SIM]", output.status, output.mode || "");

  return output;
}

export function executeLiveTrade(trade, signal) {
  const output = executeThroughOrchestrator(trade, signal);

  console.log("[LIVE]", output.status, output.mode || "");

  return output;
}

// ------------------------------------------------------
// BACKTEST BATCH
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
