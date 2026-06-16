// ======================================================
// HEALTH ENGINE
// Measures overall system reliability
// ======================================================

export class HealthEngine {

  calculate({
    driftScore = 0,
    simulationWinRate = 0.5,
    liveWinRate = 0.5,
    confidenceCalibrator = 1
  } = {}) {

    let score = 100;

    // --------------------------
    // Drift Penalty
    // --------------------------

    score -= driftScore * 40;

    // --------------------------
    // Simulation vs Live Gap
    // --------------------------

    score -= Math.abs(
      simulationWinRate - liveWinRate
    ) * 30;

    // --------------------------
    // Confidence Stability
    // --------------------------

    score -= Math.abs(
      1 - confidenceCalibrator
    ) * 20;

    score = Math.max(0, Math.min(100, score));

    let state = "HEALTHY";
    let recommendedMode = "NORMAL";

    if (score < 80) {
      state = "CAUTION";
      recommendedMode = "REDUCED_RISK";
    }

    if (score < 60) {
      state = "DEGRADED";
      recommendedMode = "SIMULATION_PRIORITY";
    }

    if (score < 40) {
      state = "FAIL_SAFE";
      recommendedMode = "LIVE_TRADING_DISABLED";
    }

    return {
      score,
      state,
      recommendedMode
    };
  }
}
