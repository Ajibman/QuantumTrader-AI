// =====================================================
// STAGE 21D — MARKET ACCESS GATEWAY
// LIQUIDITY SCANNER
// =====================================================

export class LiquidityScanner {

  constructor() {

    this.metrics = {
      scans: 0,
      blocked: 0,
      passed: 0
    };
  }

  // =====================================================
  // MAIN SCAN FUNCTION
  // =====================================================

  scan({
    asset,
    route,
    order = {}
  }) {

    this.metrics.scans++;

    const urgency = order.urgency ?? 0.5;
    const risk = order.risk ?? 0.5;

    // Simulated market conditions (placeholder hooks)
    const liquidity = this._estimateLiquidity(asset, route);
    const spread = this._estimateSpread(asset, route);
    const volatility = this._estimateVolatility(asset);

    const score =
      this._computeScore({
        liquidity,
        spread,
        volatility,
        urgency,
        risk
      });

    const allowed = score > 0.4;

    if (!allowed) {
      this.metrics.blocked++;

      return {
        approved: false,
        score,
        reason: "INSUFFICIENT_LIQUIDITY"
      };
    }

    this.metrics.passed++;

    return {
      approved: true,
      score,
      liquidity,
      spread,
      volatility
    };
  }

  // =====================================================
  // SCORING MODEL
  // =====================================================

  _computeScore({
    liquidity,
    spread,
    volatility,
    urgency,
    risk
  }) {

    let score = 0;

    // liquidity is primary driver
    score += liquidity * 0.5;

    // tighter spread is better
    score += (1 - spread) * 0.3;

    // volatility reduces score
    score -= volatility * 0.3;

    // urgency slightly increases tolerance
    score += urgency * 0.1;

    // risk reduces acceptable threshold
    score -= risk * 0.2;

    return Math.max(0, Math.min(1, score));
  }

  // =====================================================
  // SIMULATED MARKET SIGNALS (replace later with APIs)
  // =====================================================

  _estimateLiquidity(asset, route) {

    if (asset.class === "INDEX") return 0.9;
    if (asset.class === "EQUITY") return 0.8;
    if (asset.class === "CRYPTO") return 0.6;

    return 0.5;
  }

  _estimateSpread(asset, route) {

    if (asset.class === "INDEX") return 0.1;
    if (asset.class === "EQUITY") return 0.2;
    if (asset.class === "CRYPTO") return 0.4;

    return 0.3;
  }

  _estimateVolatility(asset) {

    if (asset.class === "CRYPTO") return 0.7;
    if (asset.class === "EQUITY") return 0.4;
    if (asset.class === "INDEX") return 0.3;

    return 0.5;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    const total =
      this.metrics.scans;

    return {
      ...this.metrics,
      passRate:
        total === 0
          ? 0
          : this.metrics.passed / total
    };
  }

  resetMetrics() {

    this.metrics = {
      scans: 0,
      blocked: 0,
      passed: 0
    };
  }
}
