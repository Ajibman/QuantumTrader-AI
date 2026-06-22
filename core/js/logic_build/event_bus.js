// QuantumTrader-AI — Live Reactive Event Bus
// Pub/Sub + routing layer (NO decision logic)

export class EventBus {

  constructor() {

    this.subscribers = new Map();
    this.history = [];
  }

  // =====================================
  // SUBSCRIBE TO EVENTS
  // =====================================

  on(eventType, handler) {

    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType).push(handler);
  }

  // =====================================
  // EMIT EVENT
  // =====================================

  emit(event) {

    const { type } = event;

    this.history.push({
      timestamp: Date.now(),
      event
    });

    const handlers =
      this.subscribers.get(type) || [];

    const results = [];

    for (const handler of handlers) {

      try {

        const result = handler(event);
        results.push(result);

      } catch (err) {

        results.push({
          error: err.message,
          event
        });
      }
    }

    return results;
  }

  // =====================================
  // STREAM BATCH EVENTS
  // =====================================

  stream(events = []) {

    const output = [];

    for (const event of events) {
      output.push(this.emit(event));
    }

    return output;
  }

  // =====================================
  // CLEAR BUS HISTORY
  // =====================================

  clear() {

    this.subscribers.clear();
    this.history = [];
  }

  // =====================================
  // SNAPSHOT (DEBUG / AUDIT)
  // =====================================

  snapshot() {

    return {

      subscriberCount: this.subscribers.size,
      totalEvents: this.history.length,
      history: this.history.slice(-50)
    };
  }
}
