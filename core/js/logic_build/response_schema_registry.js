// QuantumTrader-AI — Response Schema Registry
// Single Source of Truth for API Contracts

export class ResponseSchemaRegistry {

  static version = "v1";

  // =====================================
  // SUCCESS CODES
  // =====================================

  static SUCCESS = {

    RUN_COMPLETED:
      "RUN_COMPLETED",

    SNAPSHOT_RETRIEVED:
      "SNAPSHOT_RETRIEVED",

    HEALTH_RETRIEVED:
      "HEALTH_RETRIEVED",

    AUDIT_RETRIEVED:
      "AUDIT_RETRIEVED",

    SESSION_CREATED:
      "SESSION_CREATED",

    SESSION_RESTORED:
      "SESSION_RESTORED",

    SESSION_REFRESHED:
      "SESSION_REFRESHED"
  };

  // =====================================
  // ERROR CODES
  // =====================================

  static ERROR = {

    INVALID_SESSION:
      "INVALID_SESSION",

    SESSION_EXPIRED:
      "SESSION_EXPIRED",

    SESSION_MANAGER_UNAVAILABLE:
      "SESSION_MANAGER_UNAVAILABLE",

    RUN_FAILED:
      "RUN_FAILED",

    SNAPSHOT_FAILED:
      "SNAPSHOT_FAILED",

    HEALTH_FAILED:
      "HEALTH_FAILED",

    AUDIT_FAILED:
      "AUDIT_FAILED",

    CONTRACT_VALIDATION_FAILED:
      "CONTRACT_VALIDATION_FAILED",

    GATEWAY_UNAVAILABLE:
      "GATEWAY_UNAVAILABLE",

    INTERNAL_SYSTEM_ERROR:
      "INTERNAL_SYSTEM_ERROR"
  };

  // =====================================
  // SUCCESS RESPONSE
  // =====================================

  static success(code, data = null) {

    return {

      success: true,

      version:
        ResponseSchemaRegistry.version,

      code,

      timestamp:
        Date.now(),

      data
    };
  }

  // =====================================
  // ERROR RESPONSE
  // =====================================

  static error(
    code,
    message,
    retryable = false
  ) {

    return {

      success: false,

      version:
        ResponseSchemaRegistry.version,

      timestamp:
        Date.now(),

      error: {

        code,

        message,

        retryable
      }
    };
  }

  // =====================================
  // CONTRACT VALIDATION
  // =====================================

  static validate(response) {

    if (
      typeof response !==
      "object"
    ) {
      return false;
    }

    if (
      typeof response.success !==
      "boolean"
    ) {
      return false;
    }

    if (
      !response.version
    ) {
      return false;
    }

    if (
      !response.timestamp
    ) {
      return false;
    }

    return true;
  }
  }
