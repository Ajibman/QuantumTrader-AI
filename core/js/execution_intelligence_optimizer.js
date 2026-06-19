/**

* =====================================================
* QuantumTrader-AI
* STAGE 29 — EXECUTION INTELLIGENCE OPTIMIZER
* =====================================================
* 
* Purpose:
* Optimize HOW trades are executed across venues,
* liquidity conditions, and market structure.
* 
* This layer does NOT decide WHAT to trade.
* It decides HOW to execute it efficiently.
* 
* Responsibilities:
* - Slippage minimization
* - Liquidity-aware execution sizing
* - Venue routing logic
* - Execution timing optimization
* - Spread awareness
* - Market impact reduction
* - Latency-sensitive adjustments
* 
* =====================================================
  */

export class ExecutionIntelligenceOptimizer {

constructor(config = {}) {

this.config = {

  maxSlippageTolerance:
    config.maxSlippageTolerance ?? 0.002,

  liquiditySensitivity:
    config.liquiditySensitivity ?? 1.0,

  spreadPenaltyWeight:
    config.spreadPenaltyWeight ?? 0.8,

  urgencyBoost:
    config.urgencyBoost ?? 1.2
};

}

// =====================================================
// MAIN EXECUTION OPTIMIZATION
// =====================================================

optimize({

signal,
decision,
allocation,
market = {},
routing = {}

}) {

const liquidity =
  market.liquidity ?? 0.5;

const spread =
  market.spread ?? 0.01;

const volatility =
  signal.volatility ?? 0;

const urgency =
  routing.urgency ?? 0.5;

// -------------------------------------------------
// BASE EXECUTION SCORE
// -------------------------------------------------

let executionQuality =
  liquidity * this.config.liquiditySensitivity;

executionQuality -=
  spread * this.config.spreadPenaltyWeight;

executionQuality -=
  volatility * 0.3;

// -------------------------------------------------
// URGENCY ADJUSTMENT
// -------------------------------------------------

executionQuality *=
  1 + (urgency * this.config.urgencyBoost * 0.1);

// -------------------------------------------------
// SIZE ADJUSTMENT (market impact control)
// -------------------------------------------------

const sizeAdjustment =
  Math.max(
    0.1,
    Math.min(
      1,
      liquidity * (1 - volatility)
    )
  );

// -------------------------------------------------
// SLIPPAGE ESTIMATION
// -------------------------------------------------

const estimatedSlippage =
  spread * (1 + volatility) * (1 / liquidity);

const safeToExecute =
  estimatedSlippage <=
  this.config.maxSlippageTolerance;

// -------------------------------------------------
// EXECUTION MODE SELECTION
// -------------------------------------------------

const mode =
  this.selectExecutionMode({
    liquidity,
    volatility,
    urgency,
    spread
  });

// -------------------------------------------------
// FINAL OUTPUT
// -------------------------------------------------

return {

  approved: safeToExecute,

  executionQuality,

  mode,

  adjustedSizeMultiplier:
    sizeAdjustment,

  estimatedSlippage,

  routingRecommendation:
    this.selectRoutingStrategy({
      liquidity,
      volatility,
      urgency
    })
};

}

// =====================================================
// EXECUTION MODE LOGIC
// =====================================================

selectExecutionMode({

liquidity,
volatility,
urgency

}) {

if (liquidity < 0.3) {
  return "PASSIVE_LIMIT_ONLY";
}

if (volatility > 0.8) {
  return "SPLIT_EXECUTION";
}

if (urgency > 0.8) {
  return "MARKET_AGGRESSIVE";
}

return "SMART_LIMIT";

}

// =====================================================
// ROUTING STRATEGY
// =====================================================

selectRoutingStrategy({

liquidity,
volatility,
urgency

}) {

if (liquidity > 0.7 && volatility < 0.5) {
  return "SINGLE_VENUE_OPTIMAL";
}

if (liquidity < 0.4) {
  return "MULTI_VENUE_SPLIT";
}

if (volatility > 0.7) {
  return "DYNAMIC_ROUTING";
}

return "STANDARD_ROUTING";

}

// =====================================================
// MARKET IMPACT ESTIMATION
// =====================================================

estimateMarketImpact(size, liquidity) {

const impact =
  (size / Math.max(0.01, liquidity)) * 0.5;

return Math.min(1, impact);

}

// =====================================================
// EXECUTION HEALTH SCORE
// =====================================================

executionHealth({

filled = 0,
slippage = 0,
latency = 0

}) {

let score = 1;

if (slippage > this.config.maxSlippageTolerance) {
  score -= 0.4;
}

if (latency > 200) {
  score -= 0.2;
}

if (filled < 1) {
  score -= 0.3;
}

return Math.max(0, Math.min(1, score));

}
}
