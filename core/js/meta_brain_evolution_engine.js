/**

* =====================================================
* QuantumTrader-AI
* STAGE 31 — META BRAIN EVOLUTION ENGINE
* =====================================================
* 
* Purpose:
* Enable controlled self-improvement of MetaBrain
* through outcome-based learning loops.
* 
* Key principle:
* "Evolve behavior, not structure."
* 
* This system:
* - Learns from execution outcomes
* - Adjusts decision weights
* - Tunes risk sensitivity
* - Updates strategy preferences
* - Tracks performance drift
* - Prevents unstable self-modification
* 
* =====================================================
  */

export class MetaBrainEvolutionEngine {

constructor(metaBrain, config = {}) {

this.metaBrain = metaBrain;

this.config = {

  learningRate: config.learningRate ?? 0.01,

  maxAdjustment: config.maxAdjustment ?? 0.05,

  stabilityThreshold: config.stabilityThreshold ?? 0.6,

  rollbackThreshold: config.rollbackThreshold ?? 0.35
};

this.history = [];

this.performanceWindow = [];

}

// =====================================================
// MAIN LEARNING LOOP
// =====================================================

learnFromCycle(cycleResult = {}) {

const reward =
  this.calculateReward(cycleResult);

this.performanceWindow.push(reward);

if (this.performanceWindow.length > 50) {
  this.performanceWindow.shift();
}

const stability =
  this.calculateStability();

// ---------------------------------------------
// SAFETY CHECK — DO NOT EVOLVE IF UNSTABLE
// ---------------------------------------------

if (stability < this.config.rollbackThreshold) {

  this.rollback();

  return {
    status: "ROLLBACK_TRIGGERED",
    stability
  };
}

// ---------------------------------------------
// APPLY ADAPTIVE LEARNING
// ---------------------------------------------

this.adjustBiases(reward, stability);

this.adjustRiskCalibration(reward);

this.adjustConfidenceModel(reward);

return {

  status: "LEARNING_APPLIED",

  reward,

  stability
};

}

// =====================================================
// REWARD FUNCTION (CORE INTELLIGENCE SIGNAL)
// =====================================================

calculateReward(result) {

const pnl =
  result?.execution?.pnl ?? 0;

const confidence =
  result?.decision?.confidence ?? 0.5;

const riskPenalty =
  result?.risk?.approved ? 0 : -0.5;

const executionQuality =
  result?.execution?.quality ?? 0.5;

return (

  pnl * 0.6 +
  confidence * 0.2 +
  executionQuality * 0.2 +
  riskPenalty
);

}

// =====================================================
// STABILITY ANALYSIS
// =====================================================

calculateStability() {

if (this.performanceWindow.length < 10) {
  return 1;
}

const variance =
  this.performanceWindow.reduce(
    (acc, val, _, arr) => {
      const mean =
        arr.reduce((a, b) => a + b, 0) / arr.length;

      return acc + Math.pow(val - mean, 2);
    },
    0
  ) / this.performanceWindow.length;

return Math.max(0, 1 - variance);

}

// =====================================================
// BIAS ADJUSTMENT
// =====================================================

adjustBiases(reward, stability) {

const adjustment =
  Math.max(
    -this.config.maxAdjustment,
    Math.min(
      this.config.maxAdjustment,
      reward * this.config.learningRate * stability
    )
  );

this.metaBrain.learning.trendBias += adjustment;
this.metaBrain.learning.riskBias += adjustment;
this.metaBrain.learning.volatilityBias += adjustment;

}

// =====================================================
// RISK CALIBRATION TUNING
// =====================================================

adjustRiskCalibration(reward) {

this.metaBrain.learning.confidenceCalibrator +=
  reward * 0.001;

this.metaBrain.learning.confidenceCalibrator =
  Math.max(
    0.5,
    Math.min(
      1.5,
      this.metaBrain.learning.confidenceCalibrator
    )
  );

}

// =====================================================
// CONFIDENCE MODEL TUNING
// =====================================================

adjustConfidenceModel(reward) {

if (reward < 0) {

  this.metaBrain.learning.confidenceCalibrator *= 0.99;
}

}

// =====================================================
// ROLLBACK MECHANISM
// =====================================================

rollback() {

this.metaBrain.learning = {

  trendBias: 0,

  riskBias: 0,

  volatilityBias: 0,

  confidenceCalibrator: 1
};

this.performanceWindow = [];

}

// =====================================================
// SYSTEM SNAPSHOT
// =====================================================

snapshot() {

return {

  stability:
    this.calculateStability(),

  recentPerformance:
    this.performanceWindow.slice(-10),

  learningState:
    this.metaBrain.learning
};

}
  }
