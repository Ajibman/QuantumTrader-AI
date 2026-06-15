// core/execution/executionSim.js

import { metaBrain } from "../brain/meta_brain/meta_brain.js";

/**
 * ======================================================
 * EXECUTION SIMULATION ENGINE (UNIFIED SIM + LIVE)
 * ======================================================
 *
 * Responsibility:
 * - Execute simulated or live trades
 * - Normalize trade results
 * - Report outcomes to MetaBrain SyncEngine
 *
 * IMPORTANT:
 * - Does NOT make decisions
 * - Does NOT learn
 * - Only executes + reports
 */

// ------------------------------------------------------
// TRADE NORMALIZER
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
// CORE EXECUTION REPORTER
// ------------------------------------------------------

function reportTradeOutcome(trade) {
  const result = normalizeTrade(trade);

  // Send ONLY outcome signal to MetaBrain
  metaBrain.recordLiveOutcome(result.success);

  return result;
}

// ------------------------------------------------------
// SIMULATION EXECUTION
// ------------------------------------------------------

export function executeSimulationTrade(trade) {
  const result = reportTradeOutcome(trade);

  console.log("[SIM TRADE]", {
    asset: result.asset,
    action: result.action,
    pnl: result.pnl,
    success: result.success
  });

  return result;
}

// ------------------------------------------------------
// LIVE EXECUTION
// ------------------------------------------------------

export function executeLiveTrade(trade) {
  const result = reportTradeOutcome(trade);

  console.log("[LIVE TRADE]", {
    asset: result.asset,
    action: result.action,
    pnl: result.pnl,
    success: result.success
  });

  return result;
}

// ------------------------------------------------------
// OPTIONAL: BULK PROCESSING (SIM BACKTESTING)
// ------------------------------------------------------

export function runSimulationBatch(trades = []) {
  const results = [];

  for (const trade of trades) {
    results.push(executeSimulationTrade(trade));
  }

  return results;
}
