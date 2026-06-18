/**

* =====================================================
* QuantumTrader-AI
* STAGE 25 — PORTFOLIO RISK GOVERNOR
* =====================================================
* 
* Responsibilities:
* - Portfolio-wide risk oversight
* - Exposure protection
* - Concentration controls
* - Asset class limits
* - Correlation warnings
* - Drawdown monitoring
* - Emergency risk controls
* - Capital preservation
* 
* Purpose:
* Protect the portfolio from
* systemic risk accumulation.
* =====================================================
  */

export class PortfolioRiskGovernor {

constructor(config = {}) {

this.config = {

  maxPortfolioExposure:
    config.maxPortfolioExposure ?? 0.90,

  maxSingleAssetExposure:
    config.maxSingleAssetExposure ?? 0.15,

  maxAssetClassExposure:
    config.maxAssetClassExposure ?? 0.40,

  maxDrawdown:
    config.maxDrawdown ?? 0.20,

  emergencyDrawdown:
    config.emergencyDrawdown ?? 0.30
};

this.state = {

  mode: "NORMAL",

  restrictions: [],

  warnings: []
};

}

// =====================================================
// MAIN RISK EVALUATION
// =====================================================

evaluate({

portfolio = {},

allocation = {},

drawdown = 0

}) {

const warnings = [];
const restrictions = [];

const exposure =
  portfolio.totalExposure ?? 0;

// -------------------------------------------------
// PORTFOLIO EXPOSURE
// -------------------------------------------------

if (
  exposure >
  this.config.maxPortfolioExposure
) {

  restrictions.push(
    "PORTFOLIO_EXPOSURE_LIMIT"
  );
}

// -------------------------------------------------
// ASSET CLASS EXPOSURE
// -------------------------------------------------

for (
  const assetClass
  of Object.keys(allocation)
) {

  const weight =
    allocation[assetClass];

  if (
    weight >
    this.config.maxAssetClassExposure
  ) {

    warnings.push(
      `ASSET_CLASS_CONCENTRATION:${assetClass}`
    );
  }
}

// -------------------------------------------------
// CONCENTRATION RISK
// -------------------------------------------------

if (
  portfolio.concentrationRisk >
  this.config.maxSingleAssetExposure
) {

  warnings.push(
    "POSITION_CONCENTRATION"
  );
}

// -------------------------------------------------
// DRAWDOWN
// -------------------------------------------------

if (
  drawdown >
  this.config.maxDrawdown
) {

  warnings.push(
    "DRAWDOWN_WARNING"
  );
}

if (
  drawdown >
  this.config.emergencyDrawdown
) {

  restrictions.push(
    "EMERGENCY_DRAWDOWN"
  );
}

// -------------------------------------------------
// DETERMINE MODE
// -------------------------------------------------

let mode = "NORMAL";

if (
  warnings.length > 0
) {

  mode = "CAUTION";
}

if (
  restrictions.length > 0
) {

  mode = "RESTRICTED";
}

this.state = {
  mode,
  warnings,
  restrictions
};

return {

  approved:
    restrictions.length === 0,

  mode,

  warnings,

  restrictions
};

}

// =====================================================
// CORRELATION MONITOR
// =====================================================

correlationRisk(
positions = []
) {

const assets =
  positions.map(
    p => p.assetClass
  );

const unique =
  new Set(assets);

const diversificationRatio =
  unique.size /
  Math.max(
    1,
    positions.length
  );

return {

  diversificationRatio,

  diversified:
    diversificationRatio > 0.40
};

}

// =====================================================
// EMERGENCY ACTIONS
// =====================================================

emergencyActions() {

if (
  this.state.mode !==
  "RESTRICTED"
) {

  return [];
}

return [

  "REDUCE_EXPOSURE",

  "BLOCK_NEW_POSITIONS",

  "PRIORITIZE_LIQUIDITY",

  "PRESERVE_CAPITAL"
];

}

// =====================================================
// STATUS
// =====================================================

status() {

return {

  ...this.state,

  emergencyActions:
    this.emergencyActions()
};

}
}
