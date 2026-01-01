// decay_engine.js

export function applyRelevanceDecay(ai, metrics) {
  if (metrics.performance < metrics.threshold ||
      metrics.regimeMismatch === true ||
      metrics.serialViolation === true) {
    ai.status = "inactive";
  }
}
