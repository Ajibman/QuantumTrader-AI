// QuantumTrader-AI
// core/events/event_bus.js
// Production Event Bus (Controlled Reactive Layer)

export class EventBus {

  constructor() {

    this.events = new Map();

    this.history = [];

    this.maxHistory = 200;
  }

  // =====================================
  // SUBSCRIBE
  // =====================================

  on(eventName, callback) {

    if (!this.events.has(eventName)) {

      this.events.set(eventName, new Set());
    }

    this.events.get(eventName).add(callback);

    return () => {

      this.off(eventName, callback);
    };
  }

  // =====================================
  // UNSUBSCRIBE
  // =====================================

  off(eventName, callback) {

    if (!this.events.has(eventName)) return;

    this.events.get(eventName).delete(callback);
  }

  // =====================================
  // EMIT EVENT
  // =====================================

  emit(eventName, payload = {}) {

    const event = {

      name: eventName,

      payload,

      timestamp:
        Date.now()
    };

    this._record(event);

    const listeners =
      this.events.get(eventName);

    if (!listeners) return;

    for (const callback of listeners) {

      try {

        callback(payload);

      } catch (error) {

        console.error(
          `EventBus error in ${eventName}`,
          error
        );
      }
    }
  }

  // =====================================
  // GET HISTORY (SAFE OBSERVABILITY)
  // =====================================

  getHistory() {

    return [...this.history];
  }

  // =====================================
  // INTERNAL RECORDING
  // =====================================

  _record(event) {

    this.history.push(event);

    if (this.history.length > this.maxHistory) {

      this.history.shift();
    }
  }
}
