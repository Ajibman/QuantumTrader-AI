// QuantumTrader-AI — System Access Security Layer
// Auth + permissions + controlled gateway governance

export class SystemAccessSecurityLayer {

  constructor({ gateway }) {

    this.gateway = gateway;

    // simple role model (can be extended later)
    this.roles = new Map();

    this.activeSessions = new Map();
  }

  // =====================================
  // ROLE DEFINITION
  // =====================================

  defineRole(roleName, permissions = []) {

    this.roles.set(roleName, {
      permissions: new Set(permissions)
    });

    return {
      status: "role_defined",
      role: roleName
    };
  }

  // =====================================
  // SESSION CREATION (USER / APP INSTANCE)
  // =====================================

  createSession(userId, role) {

    if (!this.roles.has(role)) {
      return this._error("Invalid role");
    }

    const sessionToken =
      `${userId}-${Date.now()}`;

    this.activeSessions.set(sessionToken, {
      userId,
      role,
      createdAt: Date.now()
    });

    return {
      sessionToken,
      role
    };
  }

  // =====================================
  // AUTHORIZE ACTION
  // =====================================

  authorize(sessionToken, action) {

    const session =
      this.activeSessions.get(sessionToken);

    if (!session) {
      return this._deny("Invalid session");
    }

    const role =
      this.roles.get(session.role);

    if (!role) {
      return this._deny("Role not found");
    }

    if (!role.permissions.has(action)) {
      return this._deny("Permission denied");
    }

    return this._allow(session);
  }

  // =====================================
  // SECURE GATEWAY WRAPPER
  // =====================================

  async secureRun(sessionToken, event) {

    const auth =
      this.authorize(sessionToken, "run");

    if (!auth.allowed) return auth;

    return await this.gateway.run(event);
  }

  snapshot(sessionToken) {

    const auth =
      this.authorize(sessionToken, "snapshot");

    if (!auth.allowed) return auth;

    return this.gateway.snapshot();
  }

  health(sessionToken) {

    const auth =
      this.authorize(sessionToken, "health");

    if (!auth.allowed) return auth;

    return this.gateway.health();
  }

  audit(sessionToken) {

    const auth =
      this.authorize(sessionToken, "audit");

    if (!auth.allowed) return auth;

    return this.gateway.audit();
  }

  heal(sessionToken) {

    const auth =
      this.authorize(sessionToken, "heal");

    if (!auth.allowed) return auth;

    return this.gateway.heal();
  }

  stress(sessionToken, config) {

    const auth =
      this.authorize(sessionToken, "stress");

    if (!auth.allowed) return auth;

    return this.gateway.stress(config);
  }

  // =====================================
  // INTERNAL RESPONSES
  // =====================================

  _allow(session) {

    return {
      allowed: true,
      userId: session.userId,
      role: session.role
    };
  }

  _deny(reason) {

    return {
      allowed: false,
      reason
    };
  }

  _error(message) {

    return {
      allowed: false,
      error: message,
      layer: "SystemAccessSecurityLayer"
    };
  }
}
