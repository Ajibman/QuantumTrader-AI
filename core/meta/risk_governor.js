 // ======================================================
// STAGE 15 — EVOLUTION CONTROLLER (ADVANCED / SWARM-AWARE)
// Aligns with continuous risk-field architecture
// ======================================================

export class EvolutionController {

  constructor(learning) {
    this.learning = learning;

    this.history = {
      accuracy: [],
      swarmAlignment: [],
      drift: [],
      confidenceQuality: []
    };
  }

  // ------------------------------------------------------
  // MAIN ADAPTATION LOOP
  // ------------------------------------------------------

  adapt(results = []) {

    let correct = 0;
    let total = 0;

    let alignmentSum = 0;
    let driftSum = 0;
    let confidenceSum = 0;

    for (const r of results) {

      total++;

      // --------------------------------------------------
      // CORE ACCURACY SIGNAL
      // --------------------------------------------------
      if (r.evaluation?.actionCorrect) {
        correct++;
      }

      // --------------------------------------------------
      // SWARM SIGNALS (continuous, not boolean)
      // --------------------------------------------------
      const swarm = r.meta?.swarm;

      if (swarm) {

        alignmentSum += (swarm.alignmentScore ?? 0.5);
        driftSum += (swarm.driftLevel ?? 0.5);
      }

      // --------------------------------------------------
      // CONFIDENCE QUALITY SIGNAL
      // (how well system confidence matched outcome stability)
      // --------------------------------------------------
      confidenceSum += (r.confidence ?? r.decision?.confidence ?? 0.5);
    }

    const accuracy =
      total ? correct / total : 0;

    const alignment =
      total ? alignmentSum / total : 0;

    const drift =
      total ? driftSum / total : 0;

    const confidenceQuality =
      total ? confidenceSum / total : 0;

    // ------------------------------------------------------
    // STORE HISTORY (bounded)
    // ------------------------------------------------------

    this._push(this.history.accuracy, accuracy);
    this._push(this.history.swarmAlignment, alignment);
    this._push(this.history.drift, drift);
    this._push(this.history.confidenceQuality, confidenceQuality);

    // ------------------------------------------------------
    // CONTINUOUS SYSTEM EVOLUTION
    // ------------------------------------------------------

    this._adaptConfidenceField(
      accuracy,
      alignment,
      drift,
      confidenceQuality
    );

    this._stabilizeLearningField(
      accuracy,
      drift,
      alignment
    );
  }

  // ------------------------------------------------------
  // CONFIDENCE FIELD EVOLUTION (NOT STATIC FACTOR)
  // ------------------------------------------------------

  _adaptConfidenceField(accuracy, alignment, drift, confidenceQuality) {

    const stability =
      alignment * (1 - drift);

    const qualitySignal =
      confidenceQuality * stability;

    let factor =
      this.learning.confidenceCalibrator;

    // non-linear adaptation (important upgrade)
    const delta =
      (accuracy - 0.5) * 0.02 +
      (qualitySignal - 0.5) * 0.015;

    factor *= (1 + delta);

    this.learning.confidenceCalibrator =
      this._clamp(factor, 0.4, 1.8);
  }

  // ------------------------------------------------------
  // LEARNING FIELD STABILIZATION (SWARM-AWARE DAMPING)
  // ------------------------------------------------------

  _stabilizeLearningField(accuracy, drift, alignment) {

    const instability =
      drift * (1 - alignment);

    const stability =
      accuracy * alignment;

    const damp =
      instability > stability
        ? -0.015 - instability * 0.01
        : 0.01 + stability * 0.005;

    this.learning.trendBias *= (1 + damp);
    this.learning.riskBias *= (1 + damp);
    this.learning.volatilityBias *= (1 + damp);

    this.learning.trendBias =
      this._clamp(this.learning.trendBias, -0.5, 0.5);

    this.learning.riskBias =
      this._clamp(this.learning.riskBias, -0.5, 0.5);

    this.learning.volatilityBias =
      this._clamp(this.learning.volatilityBias, -0.5, 0.5);
  }

  // ------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------

  _push(arr, value) {
    arr.push(value);
    if (arr.length > 50) arr.shift();
  }

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
      }
