// core/js/traderlab_execution_gate.js

import cpilot from "./cpilot/cpilot.js";

/**
 * TraderLab Execution Gate
 * ------------------------
 * Central permission layer for ALL execution cycles.
 *
 * NOTHING should execute without passing here.
 */

export function evaluateAccess(context = {}) {

  const marketData = context.marketData || {};
  const qualification = context.qualification || {};

  // 🧠 Call CPilot HOLD logic
  let cpilotDecision = null;

  try {
    cpilotDecision = cpilot.getGuidance({
      marketData,
      qualification
    });
  } catch (e) {
    return {
      allowed: false,
      reason: "CPilot unavailable",
      confidence: 0
    };
  }

  // 🛑 HARD BLOCK CONDITIONS
  if (cpilotDecision.hold === true) {
    return {
      allowed: false,
      reason: "CPilot HOLD active",
      confidence: cpilotDecision.confidence,
      riskLevel: cpilotDecision.riskLevel
    };
  }

  // ✅ ALLOW EXECUTION
  return {
    allowed: true,
    reason: "Gate cleared by CPilot",
    confidence: cpilotDecision.confidence,
    riskLevel: cpilotDecision.riskLevel
  };
}
