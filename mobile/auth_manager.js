 // mobile/ui/auth_manager.js

import { emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * AUTH MANAGER — APP LEVEL SECURITY CORE
 *
 * Responsibilities:
 * - Authentication lifecycle management
 * - Session control
 * - Route protection
 * - Security event broadcasting
 * - Token lifecycle abstraction layer
 */

export class AuthManager {

  constructor(config = {}) {

    this.token = null;
    this.user = null;

    this.loginTime = null;
    this.lastActivity = null;

    this.sessionTimeout =
      config.sessionTimeout || 1000 * 60 * 60; // 1 hour default

    this.refreshBuffer =
      config.refreshBuffer || 1000 * 60 * 5; // 5 min buffer

    this.authenticated = false;

    this.initialized = true;

  }

  // =========================
  // AUTH LIFE CYCLE
  // =========================

  login(token, user) {

    this.token = token;
    this.user = user;

    this.loginTime = Date.now();
    this.lastActivity = Date.now();

    this.authenticated = true;

    emit("AUTH_LOGIN", {
      user,
      loginTime: this.loginTime
    });

    emit("AUTH_STATE_CHANGED", {
      status: "LOGGED_IN",
      user
    });

    return {
      status: "AUTH_SUCCESS",
      user
    };

  }

  logout(reason = "USER_LOGOUT") {

    const user = this.user;

    this.token = null;
    this.user = null;

    this.loginTime = null;
    this.lastActivity = null;

    this.authenticated = false;

    emit("AUTH_LOGOUT", {
      user,
      reason
    });

    emit("AUTH_STATE_CHANGED", {
      status: "LOGGED_OUT"
    });

    return {
      status: "LOGGED_OUT"
    };

  }

  // =========================
  // SESSION CONTROL
  // =========================

  isAuthenticated() {

    return this.authenticated && !!this.token;

  }

  updateActivity() {

    if (!this.authenticated) return;

    this.lastActivity = Date.now();

    emit("AUTH_ACTIVITY", {
      user: this.user,
      timestamp: this.lastActivity
    });

  }

  isSessionExpired() {

    if (!this.lastActivity) return true;

    return (
      Date.now() - this.lastActivity >
      this.sessionTimeout
    );

  }

  willExpireSoon() {

    if (!this.lastActivity) return false;

    const timeLeft =
      this.sessionTimeout -
      (Date.now() - this.lastActivity);

    return timeLeft < this.refreshBuffer;

  }

  // =========================
  // SECURITY CORE
  // =========================

  validateSession() {

    if (!this.isAuthenticated()) {

      this.logout("INVALID_SESSION");

      return false;

    }

    if (this.isSessionExpired()) {

      this.logout("SESSION_EXPIRED");

      emit("AUTH_SESSION_EXPIRED", {
        user: this.user
      });

      return false;

    }

    return true;

  }

  // =========================
  // ACCESS CONTROL
  // =========================

  canAccess(viewName) {

    const protectedViews = [
      "execution_panel",
      "trading_dashboard",
      "portfolio",
      "wallet"
    ];

    if (protectedViews.includes(viewName)) {
      return this.isAuthenticated();
    }

    return true;

  }

  // =========================
  // SESSION INFO
  // =========================

  getSessionInfo() {

    return {
      user: this.user,
      tokenExists: !!this.token,
      loginTime: this.loginTime,
      lastActivity: this.lastActivity,
      authenticated: this.isAuthenticated(),
      sessionExpired: this.isSessionExpired(),
      expiresSoon: this.willExpireSoon()
    };

  }

}
