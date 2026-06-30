 // mobile/ui/event_system.js

/**
 * QuantumTrader-AI
 * Global Event System
 *
 * Responsibilities:
 * - Application-wide communication
 * - Decoupled module interaction
 * - Event subscription management
 * - Event lifecycle control
 */

import eventHub from "../../core/brain/meta_brain/engines/event_hub.js";

const listeners = new Map();

/**
 * Subscribe to an event
 */
export function on(eventName, callback) {

  if (!listeners.has(eventName)) {
    listeners.set(eventName, []);
  }

  listeners.get(eventName).push(callback);

  return () => off(eventName, callback);
}

/**
 * Unsubscribe from an event
 */
export function off(eventName, callback) {

  if (!listeners.has(eventName)) return;

  const updatedListeners =
    listeners
      .get(eventName)
      .filter(listener => listener !== callback);

  listeners.set(eventName, updatedListeners);
}

export function emit(eventName, payload = {}) {

  if (!listeners.has(eventName)) return;

  const eventListeners = listeners.get(eventName);

  eventListeners.forEach(listener => {

    try {
      listener(payload);
    } catch (error) {

      console.error(
        `[EventSystem] Error in ${eventName}`,
        error
      );

    }

  });

  // ======================================================
  // Forward UI events into the Core Runtime Event Hub
  // ======================================================

  try {

    eventHub.emit({

      type: eventName,

      source: "mobile_ui",

      target: "runtime",

      priority: "normal",

      payload

    });

  } catch (error) {

    console.warn(
      "[EventSystem] EventHub bridge failed",
      error
    );

  }

}

/**
 * Remove all listeners for an event
 */
export function clearEvent(eventName) {

  listeners.delete(eventName);

}

/**
 * Reset entire event system
 */
export function resetEvents() {

  listeners.clear();

}

/**
 * Debug utility
 */
export function getRegisteredEvents() {

  return Array.from(listeners.keys());

}
