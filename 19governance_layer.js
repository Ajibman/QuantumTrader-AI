export class GovernanceLayer {

  constructor(config = {}) {

    this.limits = {
      maxDailyLoss: config.maxDailyLoss ?? 0.07,
      maxExposure: config.maxExposure ?? 0.85,
      maxLeverage: config.maxLeverage ?? 3,
      maxOrdersPerCycle: config.maxOrdersPerCycle ?? 120,
      maxRiskIntensity: config.maxRiskIntensity ?? 0.9
    };

    this.state = {
      dailyLoss: 0,
      exposure: 0,
      orderCount: 0,
      locked: false,
      mode: "NORMAL"
    };

    this.history = [];
  }

  // =====================================================
  // MAIN VALIDATION ENGINE
  // =====================================================

  validate({
    signal,
    decision,
    risk,
    execution,
    coordination,
    awareness
  }) {

    const violations = [];

    const volatility =
      signal?.volatility ?? 0;

    const riskIntensity =
      risk?.riskIntensity ?? 0.5;

    const coherence =
      coordination?.coherence ?? 1;

    const conflict =
      coordination?.conflictLevel ?? 0;

    // --------------------------------------------------
    // CAPITAL CONTROLS
    // --------------------------------------------------

    if (this.state.dailyLoss >= this.limits.maxDailyLoss) {
      violations.push("DAILY_LOSS_LIMIT");
    }

    if (this.state.exposure >= this.limits.maxExposure) {
      violations.push("EXPOSURE_LIMIT");
    }

    if (this.state.orderCount >= this.limits.maxOrdersPerCycle) {
      violations.push("ORDER_LIMIT");
    }

    // --------------------------------------------------
    // MARKET SAFETY CONTROLS
    // --------------------------------------------------

    if (volatility > 0.95) {
      violations.push("EXTREME_VOLATILITY");
    }

    if (riskIntensity > this.limits.maxRiskIntensity) {
      violations.push("RISK_INTENSITY_LIMIT");
    }

    // --------------------------------------------------
    // SYSTEM HEALTH CONTROLS
    // --------------------------------------------------

    if (coherence < 0.3) {
      violations.push("LOW_SYSTEM_COHERENCE");
    }

    if (conflict > 0.8) {
      violations.push("HIGH_SYSTEM_CONFLICT");
    }

    // --------------------------------------------------
    // LOCK STATE
    // --------------------------------------------------

    this.state.locked = violations.length > 0;

    this.state.mode = this._determineMode({
      riskIntensity,
      coherence,
      conflict
    });

    const output = {
      allowed: !this.state.locked,
      violations,
      mode: this.state.mode
    };

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // MODE ENGINE
  // =====================================================

  _determineMode({ riskIntensity, coherence, conflict }) {

    if (this.state.locked) {
      return "LOCKED";
    }

    if (conflict > 0.6 || coherence < 0.5) {
      return "RESTRICTED";
    }

    if (riskIntensity > 0.7) {
      return "CAUTIOUS";
    }

    if (riskIntensity < 0.3) {
      return "AGGRESSIVE";
    }

    return "NORMAL";
  }

  // =====================================================
  // EXECUTION TRACKING
  // =====================================================

  recordExecution(result = {}) {

    this.state.orderCount++;

    if (typeof result.pnl === "number") {
      this.state.dailyLoss += Math.max(0, -result.pnl);
    }

    if (typeof result.exposure === "number") {
      this.state.exposure =
        Math.min(1, this.state.exposure + result.exposure);
    }
  }

  // =====================================================
  // RESET (NEW TRADING CYCLE)
  // =====================================================

  reset() {

    this.state = {
      dailyLoss: 0,
      exposure: 0,
      orderCount: 0,
      locked: false,
      mode: "NORMAL"
    };
  }

  // =====================================================
  // INSIGHT HELPERS
  // =====================================================

  isLocked() {
    return this.state.locked;
  }

  getMode() {
    return this.state.mode;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        lockRate: 0,
        lastMode: "NORMAL"
      };
    }

    const lockedCount =
      this.history.filter(h => h.allowed === false).length;

    return {
      lockRate: lockedCount / this.history.length,
      lastMode: this.history.at(-1)?.mode ?? "NORMAL"
    };
  }
    }
