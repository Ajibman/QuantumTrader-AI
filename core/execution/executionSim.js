 // core/engine/executionSim.js

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
// EXECUTION CORE
// ------------------------------------------------------

function executeThroughOrchestrator(trade, signal) {

  // 1. MetaBrain evaluation FIRST (new core wiring)
  const brainDecision = metaBrain.evaluate(signal);

  // 2. Orchestrator control layer
  const control = orchestrator.evaluate({
    ...signal,
    brain: brainDecision
  });

  // --------------------------
  // HARD GATE
  // --------------------------

  if (!control.allowTrade) {
    return {
      status: "BLOCKED",
      reason: control.mode,
      brainDecision,
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
  // FEEDBACK LOOP (META BRAIN LEARNING)
  // --------------------------

  metaBrain.recordLiveOutcome(result.success);

  // optional simulation hook if running backtests
  if (signal.__simulation === true) {
    metaBrain.recordSimulationOutcome(result.success);
  }

  return {
    status: "EXECUTED",
    mode: control.mode,
    brainDecision,
    control,
    result
  };
}

// ------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------

export function executeSimulationTrade(trade, signal) {

  const output = executeThroughOrchestrator(trade, {
    ...signal,
    __simulation: true
  });

  console.log("[SIM]", output.status, output.mode || "");

  return output;
}

export function executeLiveTrade(trade, signal) {

  const output = executeThroughOrchestrator(trade, {
    ...signal,
    __simulation: false
  });

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

  // optional learning consolidation after batch
  metaBrain.learnFromSimulation(
    results.map(r => ({
      evaluation: { actionCorrect: r.result?.success },
      decision: { meta: r.brainDecision?.meta || {} }
    }))
  );

  return results;
}
