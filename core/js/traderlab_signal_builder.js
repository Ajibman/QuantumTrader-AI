/**
 * TraderLab Signal Builder
 * ------------------------
 * Creates structured execution signals for TraderLab modules.
 * This is the "intent layer" before execution.
 */

export function prepareModuleSignal(moduleName, context = {}) {

  const timestamp = Date.now();

  const signal = {
    module: moduleName,
    timestamp,

    // execution context
    marketData: context.marketData || {},
    userContext: context.userContext || {},

    // session identity
    sessionId: context.sessionId || `session_${timestamp}`,

    // default configuration
    config: {
      riskMode: context.riskMode || "balanced",
      executionMode: context.executionMode || "simulation",
      volatilityProfile: context.volatilityProfile || "auto"
    },

    // placeholder for future Meta-Brain injection
    meta: {
      metaBrainEnabled: false,
      overrides: {}
    }
  };

  return signal;
}
