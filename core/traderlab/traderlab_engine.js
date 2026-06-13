 // core/js/traderlab_engine.js

import cpilot from "../cpilot/cpilot.js";

/**
 * Core Engine
 * -----------
 * Executes ONE trading cycle ONLY when CPilot allows it.
 * CPilot HOLD = hard stop gate.
 */

export async function runEngineCycle({
  marketData,
  qualification,
  mode = "simulation"
}) {
  try {

    // 🧠 STEP 1: Ask CPilot if we are allowed to act
    const guidance = cpilot.getGuidance({
      marketData,
      qualification
    });

    // 🚫 HARD GATE: HOLD = NO ACTION
    if (guidance?.hold === true) {
      return {
        timestamp: Date.now(),
        skipped: true,
        reason: "CPilot HOLD active",
        guidance
      };
    }

    // 🧠 STEP 2: Safe execution logic (only runs if NOT HOLD)
    const decision = evaluateMarket(marketData, guidance);

    const result = simulateExecution(decision, marketData, mode);

    return {
      timestamp: Date.now(),
      skipped: false,
      mode,
      qualification,
      guidance,
      decision,
      result
    };

  } catch (err) {
    console.error("[Engine Cycle Error]", err);

    return {
      timestamp: Date.now(),
      error: err.message
    };
  }
}

/**
 * Simple decision logic (non-directional strategy placeholder)
 * Still not a broker system—pure simulation logic.
 */
function evaluateMarket(marketData, guidance) {
  const volatility = marketData?.volatility || 0;

  let action = "HOLD";

  // Only acts when CPilot allows execution window
  if (volatility > 0.3 && guidance?.riskLevel !== "high") {
    action = "EXECUTE";
  }

  return {
    action,
    strength: guidance?.confidence || 0.5
  };
}

/**
 * Simulation layer (NO external execution)
 */
function simulateExecution(decision, marketData, mode) {
  if (decision.action === "HOLD") {
    return {
      executed: false,
      reason: "No valid execution signal"
    };
  }

  const price = marketData?.price || 1;
  const drift = (Math.random() - 0.5) * 0.01;

  return {
    executed: true,
    action: "EXECUTE",
    entryPrice: price,
    simulatedExit: price * (1 + drift),
    pnl: drift * 100,
    mode
  };
}
