// core/js/traderlab_access.js

import { runEngineCycle } from "./traderlab_engine.js";
import { readQualification } from "./traderlab_controller.js";
import { recordCycleOutcome } from "../cpilot/cpilot_memory.js";

let intervalId = null;

const state = {
  isRunning: false,
  cycleCount: 0,
  executedCycles: 0,
  skippedCycles: 0,
  lastCycleTime: null,
  lastResult: null
};

const cycleBank = {
  totalPnL: 0,
  trades: 0,
  wins: 0,
  losses: 0,
  lastReset: Date.now()
};

/**
 * START LOOP
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
      state.cycleCount += 1;

      const qualification = readQualification(marketData);

      const cycleResult = await runEngineCycle({
        marketData,
        qualification,
        mode
      });

      state.lastResult = cycleResult;
      state.lastCycleTime = Date.now();

      // 🚫 CASE 1: SKIPPED CYCLE (HOLD ACTIVE)
      if (cycleResult?.skipped) {
        state.skippedCycles += 1;
        return; // nothing else happens
      }

      // ✅ CASE 2: EXECUTED CYCLE ONLY
      state.executedCycles += 1;

      const pnl = cycleResult?.result?.pnl;

      if (typeof pnl === "number") {
        cycleBank.totalPnL += pnl;
        cycleBank.trades += 1;

        if (pnl > 0) {
          cycleBank.wins += 1;
        } else {
          cycleBank.losses += 1;
        }

        // 🧠 Feed ONLY real outcomes into CPilot memory
        recordCycleOutcome({
          guidance: cycleResult?.guidance,
          result: cycleResult?.result
        });
      }

    } catch (err) {
      console.error("[TraderLab Access Error]", err);
    }
  }, interval);
}

/**
 * STOP LOOP
 */
export function stopTraderLab() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  state.isRunning = false;
}

/**
 * SINGLE CYCLE (debug)
 */
export async function triggerSingleCycle(getMarketData, mode = "simulation") {
  const marketData = await getMarketData();
  const qualification = readQualification(marketData);

  const cycleResult = await runEngineCycle({
    marketData,
    qualification,
    mode
  });

  state.lastResult = cycleResult;
  state.lastCycleTime = Date.now();

  if (cycleResult?.skipped) {
    state.skippedCycles += 1;
    return {
      status: "skipped",
      reason: cycleResult.reason
    };
  }

  state.executedCycles += 1;

  const pnl = cycleResult?.result?.pnl;

  if (typeof pnl === "number") {
    cycleBank.totalPnL += pnl;
    cycleBank.trades += 1;

    pnl > 0 ? cycleBank.wins++ : cycleBank.losses++;

    recordCycleOutcome({
      guidance: cycleResult?.guidance,
      result: cycleResult?.result
    });
  }

  return {
    status: "executed",
    cycleResult
  };
}

/**
 * SCOOP + RESET
 */
export function scoopAndResetCycle() {
  const snapshot = {
    ...cycleBank,
    winRate: cycleBank.trades
      ? cycleBank.wins / cycleBank.trades
      : 0
  };

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
 * STATE VIEW
 */
export function getTraderLabState() {
  return {
    ...state
  };
}

/**
 * PERFORMANCE VIEW
 */
export function getCycleBank() {
  return {
    ...cycleBank,
    winRate: cycleBank.trades
      ? cycleBank.wins / cycleBank.trades
      : 0
  };
}
