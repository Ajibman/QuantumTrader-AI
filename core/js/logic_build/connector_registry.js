// QuantumTrader-AI — Live Connector Registry + Hot-Swap System
// Enables dynamic connector replacement without system downtime

export class ConnectorRegistry {

  constructor({ connectorLayer }) {

    this.connectorLayer = connectorLayer;

    // active connectors
    this.registry = new Map();

    // previous versions for rollback
    this.history = new Map();
  }

  // =====================================
  // REGISTER CONNECTOR (LIVE)
  // =====================================

  register(name, connector) {

    if (!connector) {
      throw new Error(`Invalid connector: ${name}`);
    }

    this.registry.set(name, connector);

    this.connectorLayer.registerConnector(name, connector);

    return {
      status: "registered",
      name
    };
  }

  // =====================================
  // HOT SWAP CONNECTOR (CORE FEATURE)
  // =====================================

  swap(name, newConnector) {

    if (!this.registry.has(name)) {
      throw new Error(`Connector ${name} not found`);
    }

    const oldConnector = this.registry.get(name);

    // store history for rollback
    if (!this.history.has(name)) {
      this.history.set(name, []);
    }

    this.history.get(name).push(oldConnector);

    // replace active connector
    this.registry.set(name, newConnector);

    // rebind into connector layer (live update)
    this.connectorLayer.registerConnector(name, newConnector);

    return {
      status: "swapped",
      name
    };
  }

  // =====================================
  // ROLLBACK CONNECTOR
  // =====================================

  rollback(name) {

    const history = this.history.get(name);

    if (!history || history.length === 0) {
      throw new Error(`No rollback history for ${name}`);
    }

    const previous = history.pop();

    this.registry.set(name, previous);

    this.connectorLayer.registerConnector(name, previous);

    return {
      status: "rolled_back",
      name
    };
  }

  // =====================================
  // GET ACTIVE CONNECTORS
  // =====================================

  list() {

    return Array.from(this.registry.keys());
  }

  // =====================================
  // SNAPSHOT (DEBUG)
  // =====================================

  snapshot() {

    return {
      active: this.list(),
      historySize: Array.from(this.history.values())
        .map(h => h.length)
    };
  }
}
