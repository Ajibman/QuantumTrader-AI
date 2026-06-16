// ======================================================
// STAGE 25 — PRODUCTION HARDENING LAYER
// SECURITY + RATE LIMIT + AUDIT + VALIDATION
// ======================================================

export class ProductionHardeningLayer {
  constructor({ metaBrain }) {
    this.metaBrain = metaBrain;

    // -----------------------------
    // RATE LIMIT STATE
    // -----------------------------
    this.rateMap = new Map(); // ip → timestamps[]

    // -----------------------------
    // AUDIT LOGS
    // -----------------------------
    this.auditLog = [];

    // -----------------------------
    // CONFIG
    // -----------------------------
    this.config = {
      maxRequestsPerMinute: 60,
      maxPayloadSize: 1000 // signals
    };
  }

  // =====================================================
  // MAIN ENTRY WRAPPER
  // =====================================================

  async evaluate(request) {
    const { signal, meta } = request;

    this._validatePayload(signal);
    this._rateLimit(meta?.ip || "unknown");

    const start = Date.now();

    const result = await this.metaBrain.evaluate(signal);

    const duration = Date.now() - start;

    this._audit({
      signal,
      result,
      ip: meta?.ip,
      duration
    });

    return result;
  }

  // =====================================================
  // RATE LIMITING
  // =====================================================

  _rateLimit(ip) {
    const now = Date.now();

    if (!this.rateMap.has(ip)) {
      this.rateMap.set(ip, []);
    }

    const timestamps = this.rateMap.get(ip);

    // remove old requests (> 60 sec)
    const recent = timestamps.filter(t => now - t < 60000);

    recent.push(now);
    this.rateMap.set(ip, recent);

    if (recent.length > this.config.maxRequestsPerMinute) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
  }

  // =====================================================
  // PAYLOAD VALIDATION
  // =====================================================

  _validatePayload(signal) {
    if (!signal) throw new Error("INVALID_SIGNAL");

    if (typeof signal !== "object") {
      throw new Error("SIGNAL_MUST_BE_OBJECT");
    }

    if (Object.keys(signal).length > this.config.maxPayloadSize) {
      throw new Error("PAYLOAD_TOO_LARGE");
    }

    // core sanity checks
    if (signal.volatility != null && signal.volatility < 0) {
      throw new Error("INVALID_VOLATILITY");
    }
  }

  // =====================================================
  // AUDIT TRAIL
  // =====================================================

  _audit(entry) {
    this.auditLog.push({
      ...entry,
      timestamp: Date.now()
    });

    // keep bounded memory
    if (this.auditLog.length > 5000) {
      this.auditLog.shift();
    }
  }

  // =====================================================
  // AUDIT ACCESS
  // =====================================================

  getAuditLogs(limit = 100) {
    return this.auditLog.slice(-limit);
  }

  // =====================================================
  // SYSTEM SAFETY METRICS
  // =====================================================

  getMetrics() {
    return {
      totalAudits: this.auditLog.length,
      activeIPs: this.rateMap.size
    };
  }
}
