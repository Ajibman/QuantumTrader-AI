// QuantumTrader-AI — Connector Binding Layer → EventBus Bridge
// Connects external inputs to reactive system (NO execution logic)

export class ConnectorBindingLayer {

  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.bindings = new Map();
  }

  // =====================================
  // REGISTER CONNECTOR SOURCE
  // =====================================

  registerConnector(name, connector) {

    if (!connector) {
      throw new Error(`Connector ${name} is invalid`);
    }

    this.bindings.set(name, connector);
  }

  // =====================================
  // ACTIVATE ALL CONNECTORS
  // =====================================

  activateAll() {

    for (const [name, connector] of this.bindings) {

      if (typeof connector.onData === "function") {

        connector.onData((data) => {

          this._dispatch(name, data);
        });

      } else if (typeof connector.subscribe === "function") {

        connector.subscribe((data) => {

          this._dispatch(name, data);
        });

      } else {
        console.warn(`Connector ${name} has no valid listener`);
      }
    }
  }

  // =====================================
  // INTERNAL DISPATCH → EVENT BUS
  // =====================================

  _dispatch(source, data) {

    const event = this._normalizeEvent(source, data);

    this.eventBus.emit(event);
  }

  // =====================================
  // NORMALIZE CONNECTOR DATA INTO EVENT
  // =====================================

  _normalizeEvent(source, data) {

    return {
      type: data?.type || "connector_event",
      source,
      timestamp: Date.now(),
      payload: data
    };
  }

  // =====================================
  // SNAPSHOT (DEBUGGING)
  // =====================================

  snapshot() {

    return {
      totalConnectors: this.bindings.size,
      connectors: Array.from(this.bindings.keys())
    };
  }
}
