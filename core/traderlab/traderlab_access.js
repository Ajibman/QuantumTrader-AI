 // traderlab_access.js

import { runEngineCycle } from "./traderlab_engine.js";
import { readQualification } from "./traderlab_controller.js";

/**
 * TraderLab Access Layer
 * ----------------------
 * This is the SYSTEM ORCHESTRATOR.
 * It controls:
 *  - lifecycle (start/stop)
 *  - cycle execution
 *  - performance accumulation (scoop system)
 */

let intervalId = null;

/**
 * Internal system state (read-only via getter)
 */
const state = {
  isRunning: false,
  cycleCount: 0,
  lastCycleTime: null,
  lastMarketSnapshot: null,
  lastResult: null
};

/**
 * Profit + performance accumulator ("Scoop Bank")
 * This is the core of your set-and-forget model
 */
const cycleBank = {
  totalPnL: 0,
  trades: 0,
  wins: 0,
  losses: 0,
  lastReset: Date.now()
};

/**
 * START TRADERLAB LOOP
 */
export function startTraderLab({
  getMarketData,
  interval = 5000,
  mode = "simulation"
}) {
  if (state.isRunning) return;

  state.isRunning = true;

  intervalId = setInterval(async () => {
    try {
      const marketData = await getMarketData();

      state.lastMarketSnapshot = marketData;
      state.cycleCount += 1;

      // 1. Qualification Gate (risk filter layer)
      const qualification = readQualification(marketData);

      if (!qualification.allowed) {
        return;
      }

      // 2. Engine Cycle Execution
      const cycleResult = await runEngineCycle({
        marketData,
        qualification,
        mode
      });

      state.lastResult = cycleResult;
      state.lastCycleTime = Date.now();

      // 3. Scoop Profit Tracking
      const pnl = cycleResult?.result?.pnl;

      if (typeof pnl === "number") {
        cycleBank.totalPnL += pnl;
        cycleBank.trades += 1;

        if (pnl > 0) {
          cycleBank.wins += 1;
        } else {
          cycleBank.losses += 1;
        }
      }

    } catch (err) {
      console.error("[TraderLab Access Error]", err);
    }
  }, interval);
}

/**
 * STOP TRADERLAB LOOP
 */
export function stopTraderLab() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  state.isRunning = false;
}

/**
 * MANUAL SINGLE CYCLE (debug / testing / UI trigger)
 */
export async function triggerSingleCycle(getMarketData, mode = "simulation") {
  const marketData = await getMarketData();
  const qualification = readQualification(marketData);

  if (!qualification.allowed) {
    return {
      status: "blocked",
      reason: qualification.reason
    };
  }

  const cycleResult = await runEngineCycle({
    marketData,
    qualification,
    mode
  });

  state.lastResult = cycleResult;
  state.lastCycleTime = Date.now();

  const pnl = cycleResult?.result?.pnl;

  if (typeof pnl === "number") {
    cycleBank.totalPnL += pnl;
    cycleBank.trades += 1;

    pnl > 0 ? cycleBank.wins++ : cycleBank.losses++;
  }

  return {
    status: "executed",
    cycleResult
  };
}

/**
 * SCOOP PROFITS + RESET CYCLE
 * This is your "set and forget → come back → reset" mechanism
 */
export function scoopAndResetCycle() {
  const snapshot = {
    ...cycleBank,
    profitFactor:
      cycleBank.trades > 0
        ? cycleBank.wins / cycleBank.trades
        : 0
  };

  // reset cycle bank
  cycleBank.totalPnL = 0;
  cycleBank.trades = 0;
  cycleBank.wins = 0;
  cycleBank.losses = 0;
  cycleBank.lastReset = Date.now();

  return {
    status: "scooped",
    snapshot
  };
}

/**
 * READ SYSTEM STATE (UI / dashboard safe)
 */
export function getTraderLabState() {
  return {
    ...state
  };
}

/**
 * READ PERFORMANCE BANK (dashboard / analytics)
 */
export function getCycleBank() {
  return {
    ...cycleBank,
    winRate:
      cycleBank.trades > 0
        ? cycleBank.wins / cycleBank.trades
        : 0
  };
      }
