// QuantumTrader-AI — System Audit Log & Compliance Trail Engine
// Immutable event tracing + system accountability layer

export class SystemAuditLogEngine {

  constructor({ stateManager }) {

    this.stateManager = stateManager;

    // immutable audit trail
    this.logs = [];
  }

  // =====================================
  // CORE AUDIT ENTRY
  // =====================================

  record(entry) {

    if (!entry) {
      return this._error("Invalid audit entry");
    }

    const log = {
      id: this._generateId(),
      timestamp: Date.now(),

      // snapshot context
      state: this._safeSnapshot(),

      // event data
      entry,

      // integrity flag
      hash: this._hash(entry)
    };

    this.logs.push(log);

    return {
      success: true,
      logId: log.id
    };
  }

  // =====================================
  // GET FULL AUDIT TRAIL
  // =====================================

  getLogs(filter = {}) {

    let result = [...this.logs];

    if (filter.type) {
      result = result.filter(l =>
        l.entry?.type === filter.type
      );
    }

    if (filter.since) {
      result = result.filter(l =>
        l.timestamp >= filter.since
      );
    }

    return result;
  }

  // =====================================
  // SYSTEM TRACE (FULL COMPLIANCE SNAPSHOT)
  // =====================================

  trace() {

    return {
      totalLogs: this.logs.length,

      latest: this.logs[this.logs.length - 1] || null,

      integrity: this._computeIntegrity()
    };
  }

  // =====================================
  // INTEGRITY CHECK
  // =====================================

  _computeIntegrity() {

    if (this.logs.length === 0) {
      return { status: "clean", score: 100 };
    }

    // simple deterministic integrity score
    let score = 100;

    for (const log of this.logs) {

      if (!log.hash || !log.entry) {
        score -= 5;
      }
    }

    return {
      status: score === 100 ? "clean" : "degraded",
      score
    };
  }

  // =====================================
  // SAFE STATE CAPTURE
  // =====================================

  _safeSnapshot() {

    try {

      return this.stateManager?.snapshot?.() || null;

    } catch {

      return null;
    }
  }

  // =====================================
  // SIMPLE HASH (deterministic placeholder)
  // =====================================

  _hash(entry) {

    let str = JSON.stringify(entry || {});

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    return hash;
  }

  // =====================================
  // ID GENERATOR
  // =====================================

  _generateId() {

    return `audit_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  }

  // =====================================
  // ERROR FORMAT
  // =====================================

  _error(message) {

    return {
      success: false,
      error: message,
      layer: "SystemAuditLogEngine"
    };
  }
                                                 }
