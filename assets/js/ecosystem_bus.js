 // ecosystem_bus.js

// ─────────────────────────────────────────────
// Social Responsibility Bus
// ─────────────────────────────────────────────
export const SocialResponsibilityBus = {
  logs: {},

  init(nodes = []) {
    nodes.forEach(node => {
      this.logs[node] = [];
    });
  },

  broadcast(event) {
    Object.keys(this.logs).forEach(node => {
      const weight = NODE_CONSEQUENCE_WEIGHTS[node];

      // log each observation with its consequence weight
      this.logs[node].push({
        observedAt: new Date().toISOString(),
        weight,
        event
      });

      // handle ESCALATE nodes
      if (weight === "ESCALATE") {
        console.warn(`[SRL][ESCALATE] ${node} flagged XT consequence`);
      }

      // handle PUBLIC_SURFACE nodes
      if (weight === "PUBLIC_SURFACE") {
        console.info(`[SRL][PUBLIC] ${node} ready for disclosure`);
      }
    });

    // persist logs
    localStorage.setItem(
      "SRL_ECOSYSTEM_LOGS",
      JSON.stringify(this.logs)
    );

    // public consequence surfacing
    this.surfacePublicConsequences(event);
  },

  // ─────────────────────────────────────────────
  // Public Consequence Surfacing
  // ─────────────────────────────────────────────
  surfacePublicConsequences(event) {
    Object.keys(this.logs).forEach(node => {
      const weight = NODE_CONSEQUENCE_WEIGHTS[node];

      if (weight === "PUBLIC_SURFACE") {
        const publicData = {
          node,
          observedAt: new Date().toISOString(),
          eventType: event.type,
          layer: event.layer
        };
        console.info(`[SRL][PUBLIC] Surfacing event:`, publicData);

        // Optional: push to actual public-facing array or API
        // e.g., publicConsequences.push(publicData);
      }
    });
  }
};

// ─────────────────────────────────────────────
// Node Consequence Weighting (Locked / Immutable)
// ─────────────────────────────────────────────
const deepFreeze = obj => {
  Object.getOwnPropertyNames(obj).forEach(name => {
    let prop = obj[name];
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
};

export const NODE_CONSEQUENCE_WEIGHTS = deepFreeze({
  TradingFloor:     "SILENT",
  TraderLab:        "LOG_ONLY",
  AutoTrader:       "LOG_ONLY",
  RiskEngine:       "ESCALATE",
  PolicyMatrix:     "SILENT",
  Compliance:       "ESCALATE",
  Ethics:           "ESCALATE",
  Audit:            "ESCALATE",
  Settlement:       "LOG_ONLY",
  Liquidity:        "LOG_ONLY",
  Intelligence:     "LOG_ONLY",
  PublicTrust:      "PUBLIC_SURFACE"
});
"EnhancementNode"
