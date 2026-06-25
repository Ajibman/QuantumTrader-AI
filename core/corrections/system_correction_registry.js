// QuantumTrader-AI
// core/corrections/system_correction_registry.js
// Approved System Correction Registry
// Corrections are retrieved, not invented.

export class SystemCorrectionRegistry {

  constructor() {

    this.corrections = new Map();

    this._registerDefaults();
  }

  // =====================================
  // REGISTER CORRECTION
  // =====================================

  register(correction) {

    if (
      !correction ||
      !correction.code
    ) {

      throw new Error(
        "Invalid correction registration"
      );
    }

    this.corrections.set(
      correction.code,
      correction
    );
  }

  // =====================================
  // GET CORRECTION
  // =====================================

  get(code) {

    return (
      this.corrections.get(code) ||
      null
    );
  }

  // =====================================
  // GET BY TARGET
  // =====================================

  getByTarget(target) {

    return Array.from(
      this.corrections.values()
    ).filter(
      item => item.target === target
    );
  }

  // =====================================
  // GET BY SEVERITY
  // =====================================

  getBySeverity(severity) {

    return Array.from(
      this.corrections.values()
    ).filter(
      item => item.severity === severity
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  getAll() {

    return Array.from(
      this.corrections.values()
    );
  }

  // =====================================
  // DEFAULT CORRECTIONS
  // =====================================

  _registerDefaults() {

    // -----------------------------
    // DEGRADED STATE
    // -----------------------------

    this.register({

      code: "CORR-101",

      severity: "DEGRADED",

      target: "session",

      description:
        "Refresh session state",

      execute(context = {}) {

        context.sessionManager?.refresh?.();

        return {
          success: true,
          code: "CORR-101"
        };
      }
    });

    this.register({

      code: "CORR-102",

      severity: "DEGRADED",

      target: "app_state",

      description:
        "Restore application state",

      execute(context = {}) {

        context.appState?.restore?.();

        return {
          success: true,
          code: "CORR-102"
        };
      }
    });

    this.register({

      code: "CORR-103",

      severity: "DEGRADED",

      target: "event_bus",

      description:
        "Re-subscribe runtime listeners",

      execute(context = {}) {

        context.runtimeWiring?.initialize?.();

        return {
          success: true,
          code: "CORR-103"
        };
      }
    });

    // -----------------------------
    // CRITICAL STATE
    // -----------------------------

    this.register({

      code: "CORR-201",

      severity: "CRITICAL",

      target: "runtime_wiring",

      description:
        "Restart runtime wiring",

      execute(context = {}) {

        context.runtimeWiring?.shutdown?.();
        context.runtimeWiring?.initialize?.();

        return {
          success: true,
          code: "CORR-201"
        };
      }
    });

    this.register({

      code: "CORR-202",

      severity: "CRITICAL",

      target: "event_bus",

      description:
        "Reinitialize EventBus",

      execute(context = {}) {

        context.eventBus?.reset?.();

        return {
          success: true,
          code: "CORR-202"
        };
      }
    });

    this.register({

      code: "CORR-203",

      severity: "CRITICAL",

      target: "health_engine",

      description:
        "Rebuild health pipeline",

      execute(context = {}) {

        context.healthEngine?.reset?.();

        return {
          success: true,
          code: "CORR-203"
        };
      }
    });

    // -----------------------------
    // EMERGENCY STATE
    // -----------------------------

    this.register({

      code: "CORR-301",

      severity: "EMERGENCY",

      target: "runtime",

      description:
        "Safe mode activation",

      execute(context = {}) {

        context.router?.navigate?.(
          "startup_error",
          {
            mode: "safe"
          }
        );

        return {
          success: true,
          code: "CORR-301"
        };
      }
    });

    this.register({

      code: "CORR-302",

      severity: "EMERGENCY",

      target: "runtime",

      description:
        "Rollback runtime state",

      execute(context = {}) {

        context.appState?.restore?.();

        return {
          success: true,
          code: "CORR-302"
        };
      }
    });

    this.register({

      code: "CORR-303",

      severity: "EMERGENCY",

      target: "runtime",

      description:
        "Controlled restart request",

      execute() {

        return {
          success: true,
          code: "CORR-303",
          restartRequired: true
        };
      }
    });
  }
  }
