// QuantumTrader-AI — System API Contract Layer (v1)
// Production Boundary Layer
//
// Responsibilities:
// - API versioning
// - Response normalization
// - Error standardization
// - Session continuity enforcement
// - Gateway wrapping

export class SystemApiContractLayer {

  constructor({
    gateway,
    sessionManager
  }) {

    this.gateway = gateway;
    this.sessionManager = sessionManager;

    this.version = "v1";
  }

  // =====================================
  // RUN EVENT
  // =====================================

  async run(sessionToken, event) {

    try {

      const session =
        this._validateSession(
          sessionToken
        );

      if (!session.success) {
        return session;
      }

      const result =
        await this.gateway.run(event);

      return this._success(
        "RUN_COMPLETED",
        result
      );

    } catch (error) {

      return this._error(
        "RUN_FAILED",
        error,
        true
      );
    }
  }

  // =====================================
  // SNAPSHOT
  // =====================================

  snapshot(sessionToken) {

    try {

      const session =
        this._validateSession(
          sessionToken
        );

      if (!session.success) {
        return session;
      }

      const snapshot =
        this.gateway.snapshot();

      return this._success(
        "SNAPSHOT_RETRIEVED",
        snapshot
      );

    } catch (error) {

      return this._error(
        "SNAPSHOT_FAILED",
        error,
        false
      );
    }
  }

  // =====================================
  // HEALTH
  // =====================================

  health(sessionToken) {

    try {

      const session =
        this._validateSession(
          sessionToken
        );

      if (!session.success) {
        return session;
      }

      const health =
        this.gateway.health();

      return this._success(
        "HEALTH_RETRIEVED",
        health
      );

    } catch (error) {

      return this._error(
        "HEALTH_FAILED",
        error,
        false
      );
    }
  }

  // =====================================
  // AUDIT
  // =====================================

  audit(sessionToken) {

    try {

      const session =
        this._validateSession(
          sessionToken
        );

      if (!session.success) {
        return session;
      }

      const audit =
        this.gateway.audit();

      return this._success(
        "AUDIT_RETRIEVED",
        audit
      );

    } catch (error) {

      return this._error(
        "AUDIT_FAILED",
        error,
        false
      );
    }
  }

  // =====================================
  // SESSION VALIDATION
  // =====================================

  _validateSession(
    sessionToken
  ) {

    if (
      !this.sessionManager ||
      typeof this.sessionManager
        .validate !== "function"
    ) {

      return this._contractError(
        "SESSION_MANAGER_UNAVAILABLE"
      );
    }

    const valid =
      this.sessionManager.validate(
        sessionToken
      );

    if (!valid) {

      return this._contractError(
        "INVALID_SESSION"
      );
    }

    return {
      success: true
    };
  }

  // =====================================
  // STANDARD SUCCESS RESPONSE
  // =====================================

  _success(code, data) {

    return {
      success: true,

      version: this.version,

      code,

      timestamp:
        Date.now(),

      data
    };
  }

  // =====================================
  // STANDARD ERROR RESPONSE
  // =====================================

  _error(
    code,
    error,
    retryable = false
  ) {

    return {
      success: false,

      version: this.version,

      timestamp:
        Date.now(),

      error: {
        code,

        message:
          error?.message ||
          "Unknown error",

        retryable
      }
    };
  }

  // =====================================
  // CONTRACT ERRORS
  // =====================================

  _contractError(code) {

    return {
      success: false,

      version: this.version,

      timestamp:
        Date.now(),

      error: {
        code,

        message:
          "Contract validation failed",

        retryable: false
      }
    };
  }
        }
