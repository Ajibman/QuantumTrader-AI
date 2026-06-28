 /**
 * ============================================================
 * QuantumTrader-AI
 * STAGE 37 — EVENT HUB
 * Version: 3.0 Production (Unified Clean Build)
 * ============================================================
 */

export class EventHub {

    // ============================================================
    // SECTION 1 — CONSTRUCTOR
    // ============================================================

    constructor(config = {}) {

        this.debug = config.debug ?? false;

        this.listeners = new Map();

        this.eventHistory = [];

        this.maxHistory = config.maxHistory ?? 500;

        this.statistics = {

            emitted: 0,

            delivered: 0,

            registeredEvents: 0

        };

        this.startedAt = Date.now();
    }

    // ============================================================
    // SECTION 2 — CONFIGURATION
    // ============================================================

    enableDebug() {
        this.debug = true;
        return this;
    }

    disableDebug() {
        this.debug = false;
        return this;
    }

    clearHistory() {
        this.eventHistory.length = 0;
        return this;
    }

    resetStatistics() {
        this.statistics = {
            emitted: 0,
            delivered: 0,
            registeredEvents: 0
        };
        return this;
    }

// ============================================================
// SECTION 3 — EVENT REGISTRATION
// ============================================================

on(eventName, listener) {
    if (typeof listener !== "function") {
        throw new Error("Listener must be a function.");
    }

    if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
        this.statistics.registeredEvents++;
    }

    this.listeners.get(eventName).push(listener);
    return this;
}

off(eventName, listener) {
    if (!this.listeners.has(eventName)) return this;

    const remaining = this.listeners
        .get(eventName)
        .filter(fn => fn !== listener);

    if (remaining.length === 0) {
        this.listeners.delete(eventName);
        this.statistics.registeredEvents--;
    } else {
        this.listeners.set(eventName, remaining);
    }

    return this;
}

listenersFor(eventName) {
    return this.listeners.get(eventName) ?? [];
}

hasEvent(eventName) {
    return this.listeners.has(eventName);
}

// ============================================================
// SECTION 4 — EVENT PUBLISHING
// ============================================================

    emit(eventName, payload = {}) {

        if (!this.listeners.has(eventName)) {
            return this;
        }

        const listeners = this.listeners.get(eventName);

        for (const listener of listeners) {

            try {

                const result = listener(payload);

                this.statistics.emitted++;

                // Support async listeners
                if (result instanceof Promise) {
                    result
                        .then(() => {
                            this.statistics.delivered++;
                        })
                        .catch((err) => {
                            this.logError(eventName, err);
                        });
                } else {
                    this.statistics.delivered++;
                }

            } catch (error) {

                this.logError(eventName, error);

            }
        }

        return this;
    } 
 
    // ============================================================
    // SECTION 5 — ONE-TIME EVENTS
    // ============================================================

    once(eventName, listener) {

        if (typeof listener !== "function") {
            throw new Error("Listener must be a function.");
        }

        const wrapper = (event) => {

            try {
                listener(event);
            } finally {
                try {
                    this.off(eventName, wrapper);
                } catch (e) {
                    if (this.debug) {
                        console.warn(
                            "[EventHub] Failed to remove once listener:",
                            e
                        );
                    }
                }
            }
        };

        return this.on(eventName, wrapper);
     
    // ============================================================
    // SECTION 6 — EVENT REMOVAL
    // ============================================================
   
    removeAllListeners(eventName) {

        if (!eventName) {
            this.listeners.clear();
            this.statistics.registeredEvents = 0;
            return this;
        }

        if (this.listeners.has(eventName)) {
            this.listeners.delete(eventName);
            this.statistics.registeredEvents--;
        }

        return this;
    }

    removeListener(eventName, listener) {

        if (!this.listeners.has(eventName)) {
            return this;
        }

        const updatedListeners = this.listeners
            .get(eventName)
            .filter(fn => fn !== listener);

        if (updatedListeners.length === 0) {
            this.listeners.delete(eventName);
            this.statistics.registeredEvents--;
        } else {
            this.listeners.set(eventName, updatedListeners);
        }

        return this;
    }

    clearAll() {

        this.listeners.clear();
        this.eventHistory.length = 0;

        this.statistics.registeredEvents = 0;
        this.statistics.emitted = 0;
        this.statistics.delivered = 0;

        return this;
    }
  
// ============================================================
// SECTION 7 — DIAGNOSTICS
// ============================================================

getEventHubStatus() {

    return {

        uptime: Date.now() - this.startedAt,

        totalListeners: this.listeners.size,

        registeredEvents: this.statistics.registeredEvents,

        emittedEvents: this.statistics.emitted,

        deliveredEvents: this.statistics.delivered,

        historySize: this.eventHistory.length,

        maxHistory: this.maxHistory,

        debug: this.debug

    };

}

getEventHistory(limit = 50) {

    return this.eventHistory.slice(-limit);

}

getListenersSnapshot() {

    const snapshot = {};

    for (const [event, listeners] of this.listeners) {

        snapshot[event] = listeners.length;

    }

    return snapshot;

}
            
    // ============================================================
    // SECTION 8 — UTILITIES
    // ============================================================

    log(...args) {

        if (!this.debug) return;

        console.log(
            "[EventHub]",
            ...args
        );

    }

    getListenerCount(eventName) {

        if (!eventName) {

            let total = 0;

            for (const listeners of this.listeners.values()) {
                total += listeners.length;
            }

            return total;
        }

        return (this.listeners.get(eventName) ?? []).length;

    }

    getEventNames() {

        return [...this.listeners.keys()];

    }

    flushListeners(eventName) {

        if (eventName) {

            this.listeners.delete(eventName);

            return this;
        }

        this.listeners.clear();

        return this;

    }

    getStatistics() {

        return {

            ...this.statistics,

            uptime: Date.now() - this.startedAt,

            activeEvents: this.listeners.size,

            totalListeners: this.getListenerCount()

        };

    }

// ============================================================
// SECTION 9 — LIFECYCLE
// ============================================================

    shutdown() {

        this.removeAllListeners();
        this.clearHistory();

        this.log("EventHub shutdown complete.");

        return this;
    }

    destroy() {

        this.shutdown();

        this.listeners = new Map();
        this.eventHistory = [];
        this.debug = false;

        return null;
    }
}
