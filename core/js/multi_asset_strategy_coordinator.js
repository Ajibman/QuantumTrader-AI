/**

* =====================================================
* QuantumTrader-AI
* STAGE 26 — MULTI-ASSET STRATEGY COORDINATOR
* =====================================================
* 
* Purpose:
* Decide WHICH market structure to trade:
* - Spot markets
* - Futures markets
* 
* Responsibilities:
* - Asset class selection
* - Market routing decision
* - Opportunity ranking across asset classes
* - Liquidity-aware switching
* - Volatility-aware market preference
* - Execution path selection (Spot vs Futures)
* 
* This layer does NOT execute trades.
* It ONLY chooses the best market structure.
* =====================================================
  */

export class MultiAssetStrategyCoordinator {

constructor(config = {}) {

this.config = {

  futuresPreferenceBoost:
    config.futuresPreferenceBoost ?? 1.1,

  spotPreferenceBoost:
    config.spotPreferenceBoost ?? 1.0,

  volatilityFuturesBias:
    config.volatilityFuturesBias ?? 0.7,

  liquidityThreshold:
    config.liquidityThreshold ?? 0.5
};

}

// =====================================================
// MAIN ROUTING DECISION
// =====================================================

route({

signal,
decision,
portfolio,
marketData = {}

}) {

const volatility =
  signal.volatility ?? 0;

const liquidity =
  marketData.liquidity ?? 0.5;

const trend =
  signal.trendStrength ?? 0;

const risk =
  signal.riskLevel ?? "medium";

// -------------------------------------------------
// BASE SCORES
// -------------------------------------------------

let spotScore =
  trend +
  (liquidity * this.config.spotPreferenceBoost);

let futuresScore =
  trend +
  (volatility * this.config.volatilityFuturesBias) +
  this.config.futuresPreferenceBoost;

// -------------------------------------------------
// RISK ADJUSTMENT
// -------------------------------------------------

if (risk === "high") {
  futuresScore += 0.2;
}

if (risk === "low") {
  spotScore += 0.2;
}

// -------------------------------------------------
// PORTFOLIO CONTEXT ADJUSTMENT
// -------------------------------------------------

const exposure =
  portfolio?.totalExposure ?? 0;

if (exposure > 0.7) {
  futuresScore += 0.15; // hedge flexibility
}

// -------------------------------------------------
// DECISION LOGIC
// -------------------------------------------------

const selected =
  futuresScore > spotScore
    ? "FUTURES"
    : "SPOT";

const confidence =
  Math.max(0, Math.min(1,
    Math.abs(futuresScore - spotScore)
  ));

return {

  assetRoute: selected,

  confidence,

  scores: {

    spot: spotScore,

    futures: futuresScore
  },

  reason:

    selected === "FUTURES"
      ? "VOLATILITY_OR_HEDGE_OPTIMAL"
      : "LIQUIDITY_OR_TREND_OPTIMAL"
};

}

// =====================================================
// MARKET TYPE WEIGHTING
// =====================================================

weightMarket({

assetClass,
volatility = 0,
liquidity = 0

}) {

const base = 1;

switch (assetClass) {

  case "FUTURES":
    return base + volatility * 0.5;

  case "SPOT":
    return base + liquidity * 0.3;

  case "FOREX":
    return base + liquidity * 0.4;

  default:
    return base;
}

}

// =====================================================
// STRATEGY CLASSIFICATION
// =====================================================

classifyStrategy(signal) {

const v = signal.volatility ?? 0;
const t = signal.trendStrength ?? 0;

if (v > 0.8) return "FUTURES_SPECULATIVE";

if (t > 0.7 && v < 0.5) return "SPOT_TREND";

if (v > 0.5 && v < 0.8) return "HYBRID";

return "SPOT_STABLE";

}
}
