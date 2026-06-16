// ======================================================
// STAGE 28 — SELF-OPTIMIZATION ENGINE
// PERFORMANCE-DRIVEN PARAMETER TUNING LAYER
// ======================================================

export class SelfOptimizationEngine {
  constructor({ learning, complianceLayer }) {
    this.learning = learning;
    this.compliance = complianceLayer;

    // -----------------------------
    // OPTIMIZATION STATE
    // -----------------------------
    this.state = {
      lastRun: null,
      adjustmentHistory: []
    };

    // -----------------------------
    // BOUNDS (CRITICAL SAFETY LIMITS)
    // -----------------------------
    this.bounds = {
      trendBias: 0.5,
      riskBias: 0.5,
      volatilityBias: 0.5,
      confidenceCalibrator: [0.5, 1.5]
    };
  }

  // =====================================================
  // MAIN OPTIMIZATION CYCLE
  // =====================================================

  runOptimization() {
    const report = this.compliance.generateReport();

    const adjustments = [];

    // -----------------------------
    // CONFIDENCE TUNING
    // -----------------------------
    if (report.averageConfidence < 0.45) {
      this.learning.confidenceCalibrator *= 0.98;
      adjustments.push("LOW_CONFIDENCE_DETECTED → REDUCE_CALIBRATION");
    }

    if (report.averageConfidence > 0.75) {
      this.learning.confidenceCalibrator *= 1.01;
      adjustments.push("HIGH_CONFIDENCE_STABLE → INCREASE_CALIBRATION");
    }

    // -----------------------------
    // ACTION BALANCE TUNING
    // -----------------------------
    const imbalance =
      Math.abs(report.actionDistribution.BUY - report.actionDistribution.SELL);

    if (imbalance > report.totalDecisions * 0.6) {
      this.learning.trendBias *= 0.99;
      adjustments.push("ACTION_IMBALANCE → REDUCE_TREND_BIAS");
    }

    // -----------------------------
    // VOLATILITY RESPONSE TUNING
    // -----------------------------
    const holdRatio =
      report.actionDistribution.HOLD / Math.max(1, report.totalDecisions);

    if (holdRatio > 0.6) {
      this.learning.volatilityBias *= 1.02;
      adjustments.push("OVER-HOLDING → INCREASE_VOLATILITY_SENSITIVITY");
    }

    if (holdRatio < 0.2) {
      this.learning.volatilityBias *= 0.98;
      adjustments.push("UNDER-HOLDING → REDUCE_VOLATILITY_SENSITIVITY");
    }

    // -----------------------------
    // SAFETY CLAMPING
    // -----------------------------
    this._clampLearning();

    // -----------------------------
    // STORE HISTORY
    // -----------------------------
    this.state.adjustmentHistory.push({
      timestamp: Date.now(),
      adjustments,
      snapshot: { ...this.learning }
    });

    this.state.lastRun = Date.now();

    return {
      adjustmentsMade: adjustments,
      learningState: { ...this.learning }
    };
  }

  // =====================================================
  // SAFETY CLAMPING (CRITICAL)
  // =====================================================

  _clampLearning() {
    this.learning.trendBias = this._clamp(
      this.learning.trendBias,
      -this.bounds.trendBias,
      this.bounds.trendBias
    );

    this.learning.riskBias = this._clamp(
      this.learning.riskBias,
      -this.bounds.riskBias,
      this.bounds.riskBias
    );

    this.learning.volatilityBias = this._clamp(
      this.learning.volatilityBias,
      -this.bounds.volatilityBias,
      this.bounds.volatilityBias
    );

    const [minC, maxC] = this.bounds.confidenceCalibrator;

    this.learning.confidenceCalibrator = this._clamp(
      this.learning.confidenceCalibrator,
      minC,
      maxC
    );
  }

  // =====================================================
  // UTILITY
  // =====================================================

  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // =====================================================
  // INSPECTION API
  // =====================================================

  getHistory(limit = 20) {
    return this.state.adjustmentHistory.slice(-limit);
  }
      }
