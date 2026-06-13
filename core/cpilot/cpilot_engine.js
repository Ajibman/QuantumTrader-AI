 // core/cpilot/cpilot_engine.js

import { getContextStrength } from "./cpilot_memory.js";

const listeners = new Set();

/**
 * Subscribe to CPilot events
 */
export function subscribeCPilot(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Publish CPilot event
 */
function emit(event) {
  listeners.forEach(fn => fn(event));
}

/**
 * HOLD-Based Guidance Engine
 */
export function getGuidance({
  marketData = {},
  qualification = {}
} = {}) {

  const qualified =
    qualification.allowed ?? true;

  const context = getContextStrength(marketData);

  let hold = false;
  let confidence = 0.5;
  let riskLevel = "medium";

  // Not qualified
  if (!qualified) {
    hold = true;
    confidence = 0.2;
    riskLevel = "high";
  }

  // Weak context
  else if (context.weight < 0.8) {
    hold = true;
    confidence = 0.4;
    riskLevel = "high";
  }

  // Strong context
  else if (context.weight > 1.2) {
    hold = false;
    confidence = 0.8;
    riskLevel = "low";
  }

  // Neutral
  else {
    hold = false;
    confidence = 0.6;
    riskLevel = "medium";
  }

  const decision = {
    hold,
    confidence,
    riskLevel,
    context: context.context,
    weight: context.weight
  };

  emit({
    type: "guidance",
    decision
  });

  return decision;
}

/**
 * Manual event publishing
 */
export function publishDecision(decision) {
  emit({
    type: "decision",
    decision
  });
}
