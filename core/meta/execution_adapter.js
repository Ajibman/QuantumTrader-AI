// =====================================================
// STAGE 21E — MARKET ACCESS GATEWAY
// EXECUTION ADAPTER
// =====================================================

export class ExecutionAdapter {

  constructor() {

    this.metrics = {
      adapted: 0,
      rejected: 0,
      executed: 0
    };

    this.mode = "PAPER"; 
    // PAPER | SIMULATION | LIVE (future phase)
  }

  // =====================================================
  // MAIN ADAPT FUNCTION
  // =====================================================

  adapt({
    signal,
    decision,
    route,
    liquidity,
    order = {}
  }) {

    this.metrics.adapted++;

    // -----------------------------------------------------
    // SAFETY CHECKS
    // -----------------------------------------------------

    if (!liquidity?.approved) {
      this.metrics.rejected++;

      return {
        success: false,
        reason: "LIQUIDITY_NOT_APPROVED"
      };
    }

    if (!route?.success) {
      this.metrics.rejected++;

      return {
        success: false,
        reason: "INVALID_ROUTE"
      };
    }

    // -----------------------------------------------------
    // BUILD EXECUTION INTENT
    // -----------------------------------------------------

    const intent = this._buildIntent({
      signal,
      decision,
      route,
      liquidity,
      order
    });

    // -----------------------------------------------------
    // MODE HANDLING
    // -----------------------------------------------------

    if (this.mode === "PAPER") {

      this.metrics.executed++;

      return {
        success: true,
        mode: "PAPER",

        execution: {
          type: "SIMULATED",
          intent
        }
      };
    }

    if (this.mode === "SIMULATION") {

      this.metrics.executed++;

      return {
        success: true,
        mode: "SIMULATION",

        execution: {
          type: "BACKTEST",
          intent
        }
      };
    }

    // -----------------------------------------------------
    // LIVE MODE (future integration)
    // -----------------------------------------------------

    if (this.mode === "LIVE") {

      this.metrics.executed++;

      return {
        success: true,
        mode: "LIVE",

        execution: {
          type: "REAL_ORDER",
          intent
        }
      };
    }

    // fallback safety
    this.metrics.rejected++;

    return {
      success: false,
      reason: "UNKNOWN_EXECUTION_MODE"
    };
  }

  // =====================================================
  // INTENT BUILDER
  // =====================================================

  _buildIntent({
    signal,
    decision,
    route,
    liquidity,
    order
  }) {

    return {
      symbol: signal.symbol,
      side: decision.action,

      confidence: decision.confidence,
      strength: decision.strength,

      size: order.size ?? 1,
      urgency: order.urgency ?? 0.5,
      risk: order.risk ?? 0.5,

      venue: route.route?.venueId || null,

      marketQuality: {
        liquidity: liquidity.liquidity,
        spread: liquidity.spread,
        volatility: liquidity.volatility
      },

      timestamp: Date.now()
    };
  }

  // =====================================================
  // MODE CONTROL
  // =====================================================

  setMode(mode) {

    const allowed = ["PAPER", "SIMULATION", "LIVE"];

    if (!allowed.includes(mode)) {
      throw new Error("INVALID_EXECUTION_MODE");
    }

    this.mode = mode;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    const total = this.metrics.adapted;

    return {
      ...this.metrics,
      successRate: total === 0
        ? 0
        : this.metrics.executed / total,
      mode: this.mode
    };
  }

  resetMetrics() {

    this.metrics = {
      adapted: 0,
      rejected: 0,
      executed: 0
    };
  }
}
