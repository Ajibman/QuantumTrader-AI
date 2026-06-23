// QuantumTrader-AI
// mobile/boot/runtime_verification.js
// Runtime Verification & Startup Validation Layer

export class RuntimeVerification {

  constructor({

    router = null,
    appState = null,
    sessionManager = null,
    eventBus = null,
    healthEngine = null,
    auditEngine = null

  } = {}) {

    this.router = router;
    this.appState = appState;
    this.sessionManager = sessionManager;
    this.eventBus = eventBus;
    this.healthEngine = healthEngine;
    this.auditEngine = auditEngine;
  }

  // =====================================
  // VERIFY ENTIRE RUNTIME
  // =====================================

  verify() {

    const results = [];

    results.push(
      this._verifyModule(
        "router",
        this.router
      )
    );

    results.push(
      this._verifyModule(
        "appState",
        this.appState
      )
    );

    results.push(
      this._verifyModule(
        "sessionManager",
        this.sessionManager
      )
    );

    results.push(
      this._verifyModule(
        "eventBus",
        this.eventBus
      )
    );

    results.push(
      this._verifyModule(
        "healthEngine",
        this.healthEngine
      )
    );

    results.push(
      this._verifyModule(
        "auditEngine",
        this.auditEngine
      )
    );

    const failedModules =
      results
        .filter(r => !r.ok)
        .map(r => r.module);

    const passed =
      results.length -
      failedModules.length;

    const startupScore =
      Math.round(
        (passed / results.length) * 100
      );

    const report = {

      success:
        failedModules.length === 0,

      startupScore,

      passedModules:
        results
          .filter(r => r.ok)
          .map(r => r.module),

      failedModules,

      timestamp:
        Date.now()
    };

    this._audit(report);

    return report;
  }

  // =====================================
  // VERIFY MODULE
  // =====================================

  _verifyModule(
    name,
    instance
  ) {

    return {

      module: name,

      ok:
        instance !== null &&
        instance !== undefined
    };
  }

  // =====================================
  // AUDIT RESULT
  // =====================================

  _audit(report) {

    if (
      !this.auditEngine ||
      typeof this.auditEngine.record !==
      "function"
    ) {

      return;
    }

    this.auditEngine.record({

      type:
        report.success
          ? "INFO"
          : "WARNING",

      source:
        "runtime_verification",

      message:
        report.success
          ? "Runtime verification passed"
          : "Runtime verification detected missing modules",

      payload: report
    });
  }
}
