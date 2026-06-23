// QuantumTrader-AI
// core/audit/system_audit_trail_engine.js
// Production Audit & Compliance Trail Engine

export class SystemAuditTrailEngine {

  constructor({
    eventBus = null,
    maxEntries = 1000
  } = {}) {

    this.eventBus = eventBus;

    this.maxEntries = maxEntries;

    this.entries = [];

    this.started = false;
  }

  // =====================================
  // START AUDIT COLLECTION
  // =====================================

  start() {

    if (
      this.started ||
      !this.eventBus
    ) {
      return;
    }

    this.started = true;

    this.unsubscribe =
      this.eventBus.on(
        "*",
        (payload) => {

          this.record({
            type: "EVENT",
            source: payload?.eventName || "unknown",
            payload
          });
        }
      );
  }

  // =====================================
  // RECORD ENTRY
  // =====================================

  record({

    type = "INFO",

    source = "system",

    message = "",

    payload = null

  }) {

    const entry = {

      id:
        this._generateId(),

      type,

      source,

      message,

      payload,

      timestamp:
        Date.now()
    };

    this.entries.push(
      entry
    );

    if (
      this.entries.length >
      this.maxEntries
    ) {

      this.entries.shift();
    }

    return entry;
  }

  // =====================================
  // GET RECENT ENTRIES
  // =====================================

  getRecent(
    limit = 50
  ) {

    return this.entries
      .slice(-limit)
      .reverse();
  }

  // =====================================
  // FILTER BY TYPE
  // =====================================

  getByType(type) {

    return this.entries.filter(
      entry =>
        entry.type === type
    );
  }

  // =====================================
  // FILTER BY SOURCE
  // =====================================

  getBySource(source) {

    return this.entries.filter(
      entry =>
        entry.source === source
    );
  }

  // =====================================
  // SUMMARY
  // =====================================

  getSummary() {

    const summary = {

      total:
        this.entries.length,

      info: 0,

      warning: 0,

      error: 0,

      critical: 0
    };

    for (
      const entry
      of this.entries
    ) {

      switch (
        entry.type
      ) {

        case "INFO":
          summary.info++;
          break;

        case "WARNING":
          summary.warning++;
          break;

        case "ERROR":
          summary.error++;
          break;

        case "CRITICAL":
          summary.critical++;
          break;
      }
    }

    return summary;
  }

  // =====================================
  // EXPORT SAFE REPORT
  // =====================================

  exportReport() {

    return {

      generatedAt:
        Date.now(),

      summary:
        this.getSummary(),

      recent:
        this.getRecent(100)
    };
  }

  // =====================================
  // STOP COLLECTION
  // =====================================

  stop() {

    if (
      typeof this.unsubscribe ===
      "function"
    ) {

      this.unsubscribe();
    }

    this.started = false;
  }

  // =====================================
  // INTERNAL
  // =====================================

  _generateId() {

    return (
      "AUD-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }
      }
