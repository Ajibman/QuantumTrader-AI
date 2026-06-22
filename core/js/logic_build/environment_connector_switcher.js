// QuantumTrader-AI — Environment-Aware Connector Switching
// Controls connector profiles per environment (dev/staging/prod)

export class EnvironmentConnectorSwitcher {

  constructor({
    registry,
    connectorLayer,
    environment = "development"
  }) {

    this.registry = registry;
    this.connectorLayer = connectorLayer;
    this.environment = environment;

    this.profiles = {
      development: new Map(),
      staging: new Map(),
      production: new Map()
    };
  }

  // =====================================
  // SET CURRENT ENVIRONMENT
  // =====================================

  setEnvironment(env) {

    if (!this.profiles[env]) {
      throw new Error(`Unknown environment: ${env}`);
    }

    this.environment = env;

    this._applyProfile();

    return {
      status: "environment_set",
      environment: env
    };
  }

  // =====================================
  // REGISTER CONNECTOR PER ENVIRONMENT
  // =====================================

  register(env, name, connector) {

    if (!this.profiles[env]) {
      throw new Error(`Invalid environment: ${env}`);
    }

    this.profiles[env].set(name, connector);

    return {
      status: "registered",
      env,
      name
    };
  }

  // =====================================
  // APPLY CURRENT ENVIRONMENT PROFILE
  // =====================================

  _applyProfile() {

    const profile = this.profiles[this.environment];

    if (!profile) return;

    for (const [name, connector] of profile.entries()) {

      // push into registry (hot-swappable system)
      this.registry.register(name, connector);
    }
  }

  // =====================================
  // AUTO SYNC ALL CONNECTORS
  // =====================================

  sync() {

    this._applyProfile();

    return {
      status: "synced",
      environment: this.environment,
      activeConnectors: Array.from(
        this.profiles[this.environment].keys()
      )
    };
  }

  // =====================================
  // SNAPSHOT
  // =====================================

  snapshot() {

    return {
      environment: this.environment,
      profiles: {
        development: Array.from(this.profiles.development.keys()),
        staging: Array.from(this.profiles.staging.keys()),
        production: Array.from(this.profiles.production.keys())
      }
    };
  }
}
