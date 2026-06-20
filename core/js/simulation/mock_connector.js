// core/js/simulation/mock_connector.js
// QuantumTrader-AI Backbone Test Harness
// Mock Connector

export class MockConnector {
  constructor(name = "mock_connector") {
    this.name = name;
    this.events = [];
  }

  emit(event) {
    this.events.push(event);

    return {
      success: true,
      connector: this.name,
      event
    };
  }

  createEvent({
    id,
    priority = 0.5,
    payload = {}
  } = {}) {

    const event = {
      id:
        id ||
        `evt_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      timestamp: Date.now(),

      requestedPriority: priority,

      payload
    };

    return event;
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }
}
