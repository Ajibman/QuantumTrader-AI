// Event Bus — Central System Backbone

const listeners = new Map();

/**
 * SUBSCRIBE TO EVENT
 */
export function on(event, handler) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }

  listeners.get(event).add(handler);

  return () => listeners.get(event).delete(handler);
}

/**
 * EMIT EVENT
 */
export function emit(event, payload = {}) {
  if (!listeners.has(event)) return;

  for (const handler of listeners.get(event)) {
    try {
      handler(payload);
    } catch (err) {
      console.error(`[EventBus Error] ${event}`, err);
    }
  }
}

/**
 * CLEAR EVENT
 */
export function clear(event) {
  if (listeners.has(event)) {
    listeners.delete(event);
  }
}

/**
 * DEBUG: LIST EVENTS
 */
export function listEvents() {
  return Array.from(listeners.keys());
}
