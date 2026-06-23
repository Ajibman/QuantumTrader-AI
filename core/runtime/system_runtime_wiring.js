// QuantumTrader-AI
// core/runtime/system_runtime_wiring.js
// System Runtime Wiring Layer (Observability Backbone)

export class SystemRuntimeWiring {

  constructor({

    eventBus = null,
    healthEngine = null,
    auditEngine = null

  } = {}) {

    this.eventBus = eventBus;
    this.healthEngine = healthEngine;
    this.auditEngine = auditEngine;

    this.subscriptions = [];
  }

  // =====================================
  // INITIALIZE WIRING
  // =====================================

  initialize() {

    if (!this.eventBus) {

      console.warn(
        "RuntimeWiring: Missing EventBus"
      );

      return {
        success: false,
        reason: "event_bus_missing"
      };
    }

    // Wire EventBus → Audit Engine
    this._wireAudit();

    // Wire EventBus → Health Engine
    this._wireHealth();

    return {
      success: true,
      status: "runtime_wiring_active"
    };
  }

  // =====================================
  // AUDIT WIRING
  // =====================================

  _wireAudit() {

    if (!this.auditEngine) return;

    const unsub =
      this.eventBus.on("*", (event) => {

        this.auditEngine.record({

          type: "EVENT",

          source:
            event?.eventName ||
            "unknown",

          message:
            "Runtime event captured",

          payload: event
        });
      });

    this.subscriptions.push(unsub);
  }

  // =====================================
  // HEALTH WIRING
  // =====================================

  _wireHealth() {

    if (!this.healthEngine) return;

    const unsub =
      this.eventBus.on("*", (event) => {

        const current =
          this.healthEngine.getStatus?.() || "UNKNOWN";

        let scoreDelta = 0;

        // Simple deterministic scoring rules
        if (event?.type === "ERROR") {

          scoreDelta = -5;
        }

        if (event?.type === "WARNING") {

          scoreDelta = -2;
        }

        if (event?.type === "INFO") {

          scoreDelta = +0;
        }

        this.healthEngine.update?.({
          delta: scoreDelta,
          source: "event_bus",
          event
        });
      });

    this.subscriptions.push(unsub);
  }

  // =====================================
  // STOP WIRING (SAFE SHUTDOWN)
  // =====================================

  shutdown() {

    for (const unsub of this.subscriptions) {

      if (typeof unsub === "function") {

        unsub();
      }
    }

    this.subscriptions = [];
  }
}
