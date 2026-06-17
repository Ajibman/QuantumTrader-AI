// ======================================================
// STAGE 17 — EXECUTION INTELLIGENCE LAYER
// QuantumTrader-AI
// ======================================================

export class ExecutionIntelligence {

  constructor() {

    this.state = {
      latencySensitivity: 0.5,
      slippageTolerance: 0.3,
      executionPressure: 0.5
    };
  }

  // --------------------------------------------------
  // MAIN EXECUTION STRATEGY BUILDER
  // --------------------------------------------------

  build(signal, decision, risk, swarm = null) {

    const volatility = signal.volatility ?? 0;

    const confidence = decision.confidence ?? 0.5;

    const riskIntensity =
      risk?.riskIntensity ?? 0.5;

    const alignment =
      swarm?.alignmentScore ?? 0.5;

    // --------------------------------------------------
    // EXECUTION PRESSURE MODEL
    // --------------------------------------------------

    const urgency =
      confidence *
      alignment *
      (1 - riskIntensity);

    const slippageRisk =
      volatility * (1 - alignment);

    const liquidityPreference =
      1 - riskIntensity + alignment;

    // --------------------------------------------------
    // EXECUTION MODE SELECTION
    // --------------------------------------------------

    let mode = "STANDARD";

    if (urgency > 0.75) {
      mode = "AGGRESSIVE_MARKET";
    }

    else if (urgency < 0.35) {
      mode = "PASSIVE_LIMIT";
    }

    else if (slippageRisk > 0.6) {
      mode = "PROTECTED_EXECUTION";
    }

    // --------------------------------------------------
    // POSITION SIZING ADJUSTMENT
    // --------------------------------------------------

    let size =
      confidence *
      alignment *
      (1 - riskIntensity);

    size = this._clamp(size, 0, 1);

    // --------------------------------------------------
    // LATENCY + ROUTING SIGNALS
    // --------------------------------------------------

    const routing = {
      preferMarket: urgency > 0.6,
      splitOrders: slippageRisk > 0.5,
      iceberg: liquidityPreference < 0.4,
      delayExecution: urgency < 0.3
    };

    return {
      mode,
      size,
      urgency,
      slippageRisk,
      liquidityPreference,
      routing,
      meta: {
        volatility,
        riskIntensity,
        alignment
      }
    };
  }

  // --------------------------------------------------
  // FEEDBACK LOOP (REAL EXECUTION RESULTS)
  // --------------------------------------------------

  feedback(executionResult) {

    if (!executionResult) return;

    const slippage =
      executionResult.slippage ?? 0;

    const latency =
      executionResult.latency ?? 0;

    // adaptive tuning (system learns execution quality)
    this.state.slippageTolerance =
      this._clamp(
        this.state.slippageTolerance +
        (slippage < 0.01 ? -0.01 : 0.02),
        0,
        1
      );

    this.state.latencySensitivity =
      this._clamp(
        this.state.latencySensitivity +
        (latency < 100 ? -0.01 : 0.02),
        0,
        1
      );
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  }
