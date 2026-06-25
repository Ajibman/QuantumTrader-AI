 // core/brain/meta_brain/engines/event_hub.js

class EventHub {
  constructor() {
    this.modules = new Map();
    this.subscribers = new Map();

    this.eventHistory = [];
    this.deadLetterQueue = [];

    this.metrics = {
      emitted: 0,
      delivered: 0,
      failed: 0
    };
  }

  /* =================================
     MODULE REGISTRY
  ================================= */

  registerModule(name, metadata = {}) {

    this.modules.set(name, {
      name,
      metadata,
      registeredAt: Date.now()
    });

    return true;
  }

  unregisterModule(name) {

    return this.modules.delete(name);
  }

  getModules() {

    return Array.from(
      this.modules.values()
    );
  }

  /* =================================
     SUBSCRIPTIONS
  ================================= */

  subscribe(eventType, handler) {

    if (
      typeof handler !== "function"
    ) {
      return false;
    }

    if (
      !this.subscribers.has(eventType)
    ) {
      this.subscribers.set(
        eventType,
        []
      );
    }

    this.subscribers
      .get(eventType)
      .push(handler);

    return true;
  }

  unsubscribe(eventType, handler) {

    if (
      !this.subscribers.has(eventType)
    ) {
      return false;
    }

    const handlers =
      this.subscribers.get(eventType);

    this.subscribers.set(
      eventType,
      handlers.filter(
        h => h !== handler
      )
    );

    return true;
  }

  /* =================================
     EVENT DELIVERY
  ================================= */

  emit(event = {}) {

    if (
      !event ||
      typeof event !== "object"
    ) {
      return false;
    }

    if (!event.type) {

      this.deadLetterQueue.push({
        event,
        reason: "Missing event.type",
        timestamp: Date.now()
      });

      this.metrics.failed++;

      return false;
    }

    this.metrics.emitted++;

    const eventRecord = {
      ...event,
      timestamp:
        event.timestamp || Date.now()
    };

    this.eventHistory.push(
      eventRecord
    );

    const listeners =
      this.subscribers.get(
        event.type
      ) || [];

    if (!listeners.length) {

      this.deadLetterQueue.push({
        event: eventRecord,
        reason: "No subscribers",
        timestamp: Date.now()
      });

      return true;
    }

    listeners.forEach(handler => {

      try {

        handler(eventRecord);

        this.metrics.delivered++;

      } catch (error) {

        this.metrics.failed++;

        this.deadLetterQueue.push({
          event: eventRecord,
          reason:
            error?.message ||
            "Handler error",
          timestamp: Date.now()
        });

        console.error(
          "[EventHub]",
          error
        );
      }

    });

    return true;
  }

  /* =================================
     HISTORY
  ================================= */

  getEventHistory() {

    return [...this.eventHistory];
  }

  clearHistory() {

    this.eventHistory = [];
  }

  /* =================================
     DEAD LETTER QUEUE
  ================================= */

  getDeadLetters() {

    return [...this.deadLetterQueue];
  }

  clearDeadLetters() {

    this.deadLetterQueue = [];
  }

  /* =================================
     METRICS
  ================================= */

  getMetrics() {

    return {
      ...this.metrics
    };
  }

  resetMetrics() {

    this.metrics = {
      emitted: 0,
      delivered: 0,
      failed: 0
    };
  }

  /* =================================
     HEALTH
  ================================= */

  getHealth() {

    return {

      registeredModules:
        this.modules.size,

      eventTypes:
        this.subscribers.size,

      historySize:
        this.eventHistory.length,

      deadLetters:
        this.deadLetterQueue.length,

      metrics:
        this.getMetrics()
    };
  }
}

const eventHub =
  new EventHub();

export default eventHub;
