// traderlab_access.js

import { runEngineCycle } from "./traderlab_engine.js";
import { readQualification } from "./traderlab_controller.js";

/**
 * TraderLab Access Layer
 * ----------------------
 * This is the safe entry point into the TraderLab system.
 * It does NOT execute trades directly.
 * It only:
 *  - pulls market data
 *  - validates readiness
 *  - triggers engine cycles
 */

let intervalId = null;

const state = {
  isRunning: false,
  lastCycleTime: null,
  lastMarketSnapshot: null
};

/**
 * Start autonomous or semi-autonomous trading cycles
 */
export function startTraderLab({
  getMarketData,
  interval = 5000,
  mode = "simulation" // simulation | live (live still controlled internally)
}) {
  if (state.isRunning) return;

  state.isRunning = true;

  intervalId = setInterval(async () => {
    try {
      const marketData = await getMarketData();

      state.lastMarketSnapshot = marketData;

      // Step 1: qualification gate (filters bad conditions)
      const qualification = readQualification(marketData);

      if (!qualification.allowed) {
        return;
      }

      // Step 2: run engine cycle
      await runEngineCycle({
        marketData,
        qualification,
        mode
      });

      state.lastCycleTime = Date.now();
    } catch (err) {
      console.error("[TraderLab Access Error]", err);
    }
  }, interval);
}

/**
 * Stop all trading cycles
 */
export function stopTraderLab() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  state.isRunning = false;
}

/**
 * Manual single-cycle trigger (useful for testing/debugging)
 */
export async function triggerSingleCycle(getMarketData, mode = "simulation") {
  const marketData = await getMarketData();
  const qualification = readQualification(marketData);

  if (!qualification.allowed) {
    return { status: "blocked", reason: qualification.reason };
  }

  const result = await runEngineCycle({
    marketData,
    qualification,
    mode
  });

  state.lastCycleTime = Date.now();

  return {
    status: "executed",
    result
  };
}

/**
 * Access internal state (safe read-only snapshot)
 */
export function getTraderLabState() {
  return {
    ...state
  };
}
