/* =========================================================
   QuantumTrader-AI
   AutoTrader Strategy Interface — SERIAL 2 of 6
   Purpose: Strategy signal generation (NO execution)
   ========================================================= */

/* ---------- STRATEGY REGISTRY ---------- */
const StrategyRegistry = new Map();

/* ---------- REGISTER STRATEGY ---------- */
export function registerStrategy(name, handler) {
  if (typeof handler !== "function") {
    throw new Error("Strategy handler must be a function");
  }

  StrategyRegistry.set(name, handler);
  console.log(`[Strategy] Registered → ${name}`);
}

/* ---------- UNREGISTER STRATEGY ---------- */
export function unregisterStrategy(name) {
  StrategyRegistry.delete(name);
  console.log(`[Strategy] Unregistered → ${name}`);
}

/* ---------- EVALUATE STRATEGIES ---------- */
export function evaluateStrategies(context) {
  const signals = [];

  for (const [name, handler] of StrategyRegistry.entries()) {
    try {
      const signal = handler(context);

      if (signal && signal.action) {
        signals.push({
          strategy: name,
          ...signal
        });
      }
    } catch (err) {
      console.warn(`[Strategy Error] ${name}`, err.message);
    }
  }

  return signals;
}

/* ---------- DEFAULT PLACEHOLDER STRATEGY ---------- */
/* This mirrors manual trading logic later */
registerStrategy("baseline", () => {
  return {
    action: "HOLD",
    confidence: 0.5,
    reason: "Baseline neutral state",
    timestamp: Date.now()
  };
});
