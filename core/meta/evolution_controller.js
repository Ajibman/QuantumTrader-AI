// ======================================================
// STAGE 16 — EVOLUTION CONTROLLER (PRODUCTION)
// Swarm-Stabilized Learning Layer
// ======================================================

export class EvolutionController {

  constructor(learning) {
    this.learning = learning;

    this.history = {
      accuracy: [],
      swarmAlignment: [],
      drift: []
    };
  }

  adapt(results = []) {

    let correct = 0;
    let total = 0;

    let aligned = 0;
    let driftSum = 0;

    for (const r of results) {

      total++;

      if (r.evaluation?.actionCorrect) {
        correct++;
      }

      // Stage 14 integration signals
      const swarm = r.meta?.swarm;

      if (swarm) {

        if (swarm.alignment > 0.5) {
          aligned++;
        }

        driftSum += (swarm.drift || 0);
      }
    }

    const accuracy =
      total ? correct / total : 0;

    const alignment =
      total ? aligned / total : 0;

    const drift =
      total ? driftSum / total : 0;

    // store history (bounded)
    this._push(this.history.accuracy, accuracy);
    this._push(this.history.swarmAlignment, alignment);
    this._push(this.history.drift, drift);

    // update learning system
    this._adaptConfidence(accuracy, alignment, drift);
    this._stabilizeBiases(accuracy, drift);
  }

  // ------------------------------------------------------
  // CONFIDENCE EVOLUTION
  // ------------------------------------------------------

  _adaptConfidence(accuracy, alignment, drift) {

    let factor =
      this.learning.confidenceCalibrator;

    const stabilityBoost =
      alignment * (1 - drift);

    if (accuracy > 0.70) {
      factor *= (1.01 + stabilityBoost * 0.5);
    }

    else if (accuracy < 0.40) {
      factor *= (0.99 - drift * 0.3);
    }

    this.learning.confidenceCalibrator =
      Math.max(0.5, Math.min(1.5, factor));
  }

  // ------------------------------------------------------
  // BIAS STABILIZATION
  // ------------------------------------------------------

  _stabilizeBiases(accuracy, drift) {

    const damp =
      accuracy < 0.40
        ? -0.01 - drift * 0.02
        : 0.01 - drift * 0.01;

    this.learning.trendBias *= (1 + damp);
    this.learning.riskBias *= (1 + damp);
    this.learning.volatilityBias *= (1 + damp);

    this.learning.trendBias =
      this._clamp(this.learning.trendBias);

    this.learning.riskBias =
      this._clamp(this.learning.riskBias);

    this.learning.volatilityBias =
      this._clamp(this.learning.volatilityBias);
  }

  // ------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------

  _push(arr, value) {
    arr.push(value);
    if (arr.length > 50) arr.shift();
  }

  _clamp(v) {
    return Math.max(-0.5, Math.min(0.5, v));
  }
}
