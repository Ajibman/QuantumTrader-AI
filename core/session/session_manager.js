// QuantumTrader-AI
// core/session/session_manager.js
// Production Session Manager (Secure Persistence + Validation Layer)

const SESSION_KEY = "qta_session_token";

export class SessionManager {

  constructor({
    apiLayer = null
  } = {}) {

    this.apiLayer = apiLayer;

    this.session = null;
  }

  // =====================================
  // CREATE SESSION
  // =====================================

  createSession(token, user = null) {

    if (!token) return false;

    const session = {

      token,

      user: user || null,

      createdAt:
        Date.now(),

      lastValidated:
        Date.now(),

      isValid:
        true
    };

    this.session = session;

    localStorage.setItem(
      SESSION_KEY,
      token
    );

    return true;
  }

  // =====================================
  // LOAD SESSION
  // =====================================

  loadSession() {

    const token =
      localStorage.getItem(
        SESSION_KEY
      );

    if (!token) return null;

    this.session = {

      token,

      user: null,

      createdAt: null,

      lastValidated: null,

      isValid: false
    };

    return this.session;
  }

  // =====================================
  // VALIDATE SESSION
  // =====================================

  async validate(token = null) {

    const sessionToken =
      token ||
      this.session?.token ||
      localStorage.getItem(
        SESSION_KEY
      );

    if (!sessionToken) {

      return false;
    }

    try {

      // If API layer supports validation endpoint
      if (this.apiLayer?.validateSession) {

        const response =
          await this.apiLayer.validateSession(
            sessionToken
          );

        const valid =
          response?.success &&
          response?.data?.valid === true;

        this._updateValidationState(
          valid
        );

        return valid;
      }

      // Fallback: local validation only
      return this._basicValidation(
        sessionToken
      );

    } catch (error) {

      console.error(
        "Session validation failed",
        error
      );

      return false;
    }
  }

  // =====================================
  // DESTROY SESSION
  // =====================================

  destroy(token = null) {

    const sessionToken =
      token ||
      this.session?.token;

    this.session = null;

    localStorage.removeItem(
      SESSION_KEY
    );

    return true;
  }

  // =====================================
  // GET SESSION
  // =====================================

  getSession() {

    return this.session;
  }

  // =====================================
  // INTERNAL VALIDATION UPDATE
  // =====================================

  _updateValidationState(valid) {

    if (!this.session) return;

    this.session.isValid = valid;

    this.session.lastValidated =
      Date.now();
  }

  // =====================================
  // BASIC FALLBACK VALIDATION
  // =====================================

  _basicValidation(token) {

    // Minimal structural validation only
    if (typeof token !== "string") {

      return false;
    }

    return token.length > 10;
  }
  }
