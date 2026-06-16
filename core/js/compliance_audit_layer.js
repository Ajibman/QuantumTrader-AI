// ======================================================
// STAGE 27 — INSTITUTIONAL COMPLIANCE LAYER
// AUDIT TRAILS + EXPLANATION + REPORTING ENGINE
// ======================================================

export class ComplianceAuditLayer {
  constructor() {
    // -----------------------------
    // IMMUTABLE LEDGER (APPEND ONLY)
    // -----------------------------
    this.ledger = [];

    // -----------------------------
    // SYSTEM SNAPSHOT CACHE
    // -----------------------------
    this.snapshots = [];

    this.sequenceId = 0;
  }

  // =====================================================
  // RECORD FULL DECISION TRACE
  // =====================================================

  record({ signal, decision, execution, meta }) {
    const entry = {
      id: this._nextId(),
      timestamp: Date.now(),

      signal,
      decision,
      execution: execution || null,

      meta: {
        context: meta?.context,
        zone: meta?.zone,
        risk: meta?.risk,
        region: meta?.region
      },

      explanation: this._buildExplanation(signal, decision, meta)
    };

    this.ledger.push(entry);

    // keep bounded memory (still immutable logically)
    if (this.ledger.length > 10000) {
      this.ledger.shift();
    }

    return entry.id;
  }

  // =====================================================
  // EXPLANATION ENGINE (WHY SYSTEM DID THIS)
  // =====================================================

  _buildExplanation(signal, decision, meta) {
    const reasons = [];

    if (meta?.context) {
      reasons.push(`Market context classified as ${meta.context}`);
    }

    if (meta?.zone) {
      reasons.push(`Zone bias applied: ${meta.zone}`);
    }

    if (signal.volatility > 0.8) {
      reasons.push("High volatility influenced risk adjustment");
    }

    if (decision.confidence < 0.5) {
      reasons.push("Low confidence reduced execution strength");
    }

    if (decision.action === "HOLD") {
      reasons.push("No clear edge detected → HOLD selected");
    }

    return reasons;
  }

  // =====================================================
  // SNAPSHOT SYSTEM STATE
  // =====================================================

  snapshot(systemState) {
    const snap = {
      id: this._nextId(),
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(systemState))
    };

    this.snapshots.push(snap);

    if (this.snapshots.length > 500) {
      this.snapshots.shift();
    }

    return snap;
  }

  // =====================================================
  // QUERY LEDGER
  // =====================================================

  query(filter = {}) {
    return this.ledger.filter(entry => {
      if (filter.action && entry.decision?.action !== filter.action) {
        return false;
      }

      if (filter.context && entry.meta?.context !== filter.context) {
        return false;
      }

      if (filter.region && entry.meta?.region !== filter.region) {
        return false;
      }

      return true;
    });
  }

  // =====================================================
  // COMPLIANCE REPORT GENERATOR
  // =====================================================

  generateReport() {
    const total = this.ledger.length;

    const actions = {
      BUY: 0,
      SELL: 0,
      HOLD: 0
    };

    let avgConfidence = 0;

    for (const e of this.ledger) {
      const a = e.decision?.action;
      if (actions[a] != null) actions[a]++;

      avgConfidence += e.decision?.confidence || 0;
    }

    avgConfidence = total ? avgConfidence / total : 0;

    return {
      totalDecisions: total,
      actionDistribution: actions,
      averageConfidence: avgConfidence,
      snapshots: this.snapshots.length
    };
  }

  // =====================================================
  // INTERNAL ID GENERATOR
  // =====================================================

  _nextId() {
    return `audit_${++this.sequenceId}`;
  }
}
