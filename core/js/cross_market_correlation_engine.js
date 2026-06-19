/**

* =====================================================
* QuantumTrader-AI
* STAGE 28 — CROSS-MARKET CORRELATION
* & SHOCK PROPAGATION ENGINE
* =====================================================
* 
* Purpose:
* Model how shocks in one market propagate
* across all other markets and asset classes.
* 
* This is NOT prediction.
* This is SYSTEMIC RESPONSE MAPPING.
* 
* It connects:
* - Equities
* - Forex
* - Bonds
* - Commodities
* - Metals
* - Indices
* - Crypto
* - Futures
* 
* =====================================================
  */

export class CrossMarketCorrelationEngine {

constructor() {

this.correlationMatrix = new Map();

this.shockHistory = [];

this.baseLinks = {
  "OIL": ["FOREX", "INDICES", "AIRLINES", "LOGISTICS"],
  "USD": ["GOLD", "CRYPTO", "EMERGING_MARKETS"],
  "BONDS": ["EQUITIES", "BANKS", "TECH"],
  "EQUITIES": ["INDICES", "ETF", "OPTIONS"],
  "CRYPTO": ["RISK_ASSETS", "TECH", "LIQUIDITY"],
  "FREIGHT": ["COMMODITIES", "INFLATION", "FOREX"]
};

}

// =====================================================
// REGISTER MARKET SHOCK
// =====================================================

registerShock({

source,
magnitude = 0,
assetClass = "UNKNOWN",
type = "PRICE_SHOCK"

}) {

const shock = {

  source,

  assetClass,

  magnitude,

  type,

  timestamp: Date.now()
};

this.shockHistory.push(shock);

if (this.shockHistory.length > 200) {
  this.shockHistory.shift();
}

return this.propagateShock(shock);

}

// =====================================================
// SHOCK PROPAGATION ENGINE
// =====================================================

propagateShock(shock) {

const affected = [];

const links =
  this.baseLinks[
    shock.source
  ] || [];

for (const target of links) {

  const impact =
    this.calculateImpact(
      shock.magnitude,
      target
    );

  affected.push({

    target,

    impact,

    direction:
      impact > 0 ? "POSITIVE" : "NEGATIVE",

    severity:
      Math.abs(impact)
  });
}

return {

  source: shock.source,

  affected,

  systemicRisk:
    this.calculateSystemicRisk()
};

}

// =====================================================
// IMPACT MODEL
// =====================================================

calculateImpact(magnitude, target) {

const base = magnitude * 0.6;

// risk-sensitive amplification
if (
  target === "FOREX" ||
  target === "CRYPTO"
) {
  return base * 1.2;
}

if (
  target === "INDICES"
) {
  return base * 0.9;
}

return base;

}

// =====================================================
// SYSTEMIC RISK INDEX
// =====================================================

calculateSystemicRisk() {

if (this.shockHistory.length < 5) {
  return 0;
}

const recent =
  this.shockHistory.slice(-20);

const avg =
  recent.reduce(
    (s, x) => s + Math.abs(x.magnitude),
    0
  ) / recent.length;

const clustering =
  recent.filter(
    x => Math.abs(x.magnitude) > 0.7
  ).length;

return Math.min(
  1,
  (avg * 0.6) + (clustering * 0.1)
);

}

// =====================================================
// CORRELATION LOOKUP
// =====================================================

getCorrelatedMarkets(asset) {

return this.baseLinks[asset] || [];

}

// =====================================================
// SYSTEM SNAPSHOT
// =====================================================

snapshot() {

return {

  systemicRisk:
    this.calculateSystemicRisk(),

  recentShocks:
    this.shockHistory.slice(-10),

  correlationMap:
    this.baseLinks
};

}
  }
