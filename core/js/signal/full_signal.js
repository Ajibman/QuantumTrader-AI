// core/js/signal/full_signal.js

export function createFullSignal({
  permission,
  context,
  timing,
  mode
}) {
  if (!permission?.cpilotAllowed) {
    throw new Error("CPilot permission not granted");
  }

  return Object.freeze({
    meta: {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      environment: "simulation",
      source: "TraderLab"
    },

    permission: {
      traderLabPassed: true,
      cpilotAllowed: true,
      tradingFloorAllowed: false
    },

    context: {
      market: context.market || "SIMULATED",
      asset: context.asset || "BTC/USDT",
      riskProfile: context.riskProfile || "neutral",
      capitalClass: "virtual"
    },

    execution: {
      mode: mode,                 // "manual" | "auto"
      engine: "CPilot",
      reversible: true
    },

    timing: {
      takeProfit: {
        value: timing.value,      // number
        unit: timing.unit,        // "seconds" | "minutes" | "hours" | "days"
        label: timing.label       // "15 Seconds", "7 Days"
      }
    },

    state: {
      status: "armed",            // armed | running | stopped | completed
      locked: false
    },

    audit: {
      mutable: false,
      inspected: false,
      notes: []
    }
  });
}
