/**

* =====================================================
* QuantumTrader-AI
* STAGE 24 — CAPITAL ALLOCATION ENGINE
* =====================================================
* 
* Responsibilities:
* - Capital deployment sizing
* - Portfolio-aware allocation
* - Risk-adjusted position sizing
* - Confidence weighting
* - Exposure controls
* - Drawdown protection
* - Allocation recommendations
* 
* Purpose:
* Decide HOW MUCH to deploy,
* not WHETHER to trade.
* =====================================================
  */

export class CapitalAllocationEngine {

constructor(config = {}) {

this.config = {

  maxPortfolioExposure:
    config.maxPortfolioExposure ?? 0.90,

  maxSinglePosition:
    config.maxSinglePosition ?? 0.10,

  minAllocation:
    config.minAllocation ?? 0.01,

  confidenceWeight:
    config.confidenceWeight ?? 1.0,

  drawdownReduction:
    config.drawdownReduction ?? 0.50
};

}

// =====================================================
// MAIN ALLOCATION DECISION
// =====================================================

allocate({

capital = 0,

confidence = 0,

riskLevel = "medium",

portfolio = {},

existingExposure = 0

}) {

const riskMultiplier =
  this.getRiskMultiplier(
    riskLevel
  );

const confidenceMultiplier =
  Math.max(
    0,
    Math.min(
      1,
      confidence
    )
  );

const healthMultiplier =
  this.getHealthMultiplier(
    portfolio.healthScore ?? 100
  );

let allocationPercent =

  this.config.maxSinglePosition *

  confidenceMultiplier *

  riskMultiplier *

  healthMultiplier *

  this.config.confidenceWeight;

allocationPercent =
  Math.max(
    this.config.minAllocation,
    allocationPercent
  );

allocationPercent =
  Math.min(
    this.config.maxSinglePosition,
    allocationPercent
  );

const projectedExposure =
  existingExposure +
  allocationPercent;

const approved =
  projectedExposure <=
  this.config.maxPortfolioExposure;

return {

  approved,

  allocationPercent,

  allocationAmount:
    capital *
    allocationPercent,

  projectedExposure,

  healthMultiplier,

  riskMultiplier,

  confidenceMultiplier
};

}

// =====================================================
// RISK MULTIPLIER
// =====================================================

getRiskMultiplier(riskLevel) {

switch (riskLevel) {

  case "low":
    return 1.0;

  case "medium":
    return 0.75;

  case "high":
    return 0.50;

  default:
    return 0.75;
}

}

// =====================================================
// PORTFOLIO HEALTH EFFECT
// =====================================================

getHealthMultiplier(
healthScore
) {

if (healthScore >= 90) {
  return 1.0;
}

if (healthScore >= 75) {
  return 0.80;
}

if (healthScore >= 60) {
  return 0.60;
}

return this.config
  .drawdownReduction;

}

// =====================================================
// REBALANCE ANALYSIS
// =====================================================

rebalance(allocation = {}) {

const recommendations = [];

for (
  const assetClass
  of Object.keys(allocation)
) {

  const weight =
    allocation[assetClass];

  if (weight > 0.40) {

    recommendations.push({

      assetClass,

      action:
        "REDUCE_EXPOSURE",

      weight
    });
  }

  if (weight < 0.05) {

    recommendations.push({

      assetClass,

      action:
        "UNDER_ALLOCATED",

      weight
    });
  }
}

return recommendations;

}

// =====================================================
// CAPITAL HEALTH
// =====================================================

capitalHealth({

exposure = 0,

healthScore = 100

}) {

let score = healthScore;

if (exposure > 0.80) {
  score -= 15;
}

if (exposure > 0.90) {
  score -= 25;
}

return Math.max(
  0,
  Math.min(100, score)
);

}
}
