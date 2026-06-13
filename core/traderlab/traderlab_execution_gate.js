// core/js/traderlab_execution_gate.js

import { getGuidance } from "../cpilot/cpilot_engine.js";

/**
 * TraderLab Execution Gate
 * ------------------------
 * Central safety + permission layer.
 * Uses CPilot HOLD logic.
 */

export function evaluateAccess(context = {}) {

  const marketData = context.marketData || {};
  const qualification = context.qualification || {};

  let decision;

  try {
    decision = getGuidance({
      marketData,
      qualification
    });
  } catch (e) {
    return {
      allowed: false,
      reason: "CPilot Engine unavailable",
      confidence: 0,
      riskLevel: "high"
    };
  }

  // HARD BLOCK
  if (decision.hold === true) {
    return {
      allowed: false,
      reason: "CPilot HOLD active",
      confidence: decision.confidence,
      riskLevel: decision.riskLevel,
      context: decision.context
    };
  }

  // ALLOW EXECUTION
  return {
    allowed: true,
    reason: "CPilot clearance granted",
    confidence: decision.confidence,
    riskLevel: decision.riskLevel,
    context: decision.context
  };
}
