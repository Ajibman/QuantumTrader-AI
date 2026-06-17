// ======================================================
// STAGE 19 — INSTITUTIONAL GOVERNANCE LAYER
// QuantumTrader-AI
// ======================================================

export class InstitutionalGovernanceLayer {

  constructor() {

    this.limits = {
      maxDailyLoss: 0.07,
      maxExposure: 0.85,
      maxLeverage: 3,
      maxOrderFrequency: 120
    };

    this.state = {
      dailyLoss: 0,
      exposure: 0,
      orderCount: 0,
      locked: false
    };
  }

  // --------------------------------------------------
  // PRE-EXECUTION GOVERNANCE CHECK
  // --------------------------------------------------

  validate({ signal, decision, risk, execution }) {

    const violations = [];

    const volatility = signal?.volatility ?? 0;

    // --------------------------------------------------
    // CAPITAL SAFETY RULES
    // --------------------------------------------------

    if (this.state.dailyLoss >= this.limits.maxDailyLoss) {
      violations.push("DAILY_LOSS_LIMIT_REACHED");
    }

    if (this.state.exposure >= this.limits.maxExposure) {
      violations.push("EXPOSURE_LIMIT_REACHED");
    }

    if (this.state.orderCount >= this.limits.maxOrderFrequency) {
      violations.push("ORDER_RATE_LIMIT");
    }

    if (volatility > 0.95) {
      violations.push("EXTREME_VOLATILITY_BLOCK");
    }

    // --------------------------------------------------
    // RISK INTENSITY OVERRIDE CHECK
    // --------------------------------------------------

    const riskIntensity =
      risk?.riskIntensity ?? 0.5;

    if (riskIntensity > 0.9) {
      violations.push("RISK_INTENSITY_CUTOFF");
    }

    // --------------------------------------------------
    // GOVERNANCE STATE
    // --------------------------------------------------

    this.state.locked = violations.length > 0;

    return {
      allowed: !this.state.locked,
      violations,
      mode: this._mode()
    };
  }

  // --------------------------------------------------
  // EXECUTION TRACKING
  // --------------------------------------------------

  recordExecution(result = {}) {

    this.state.orderCount++;

    if (result.pnl) {
      this.state.dailyLoss += Math.max(0, -result.pnl);
    }

    if (result.exposure) {
      this.state.exposure =
        Math.min(1, this.state.exposure + result.exposure);
    }
  }

  // --------------------------------------------------
  // RESET (DAILY CYCLE)
  // --------------------------------------------------

  reset() {
    this.state.dailyLoss = 0;
    this.state.exposure = 0;
    this.state.orderCount = 0;
    this.state.locked = false;
  }

  // --------------------------------------------------
  // GOVERNANCE MODE
  // --------------------------------------------------

  _mode() {

    if (this.state.locked) {
      return "RESTRICTED";
    }

    if (this.state.dailyLoss > 0.04) {
      return "CAUTIOUS";
    }

    return "NORMAL";
  }
}
