/**
 * ============================================================
 * QuantumTrader-AI
 * STAGE 37 — EVENT HUB
 * Version: 1.0 Production
 * ============================================================
 *
 * PURPOSE
 * --------
 * Central event bus responsible for communication between
 * all QuantumTrader-AI modules.
 *
 * RESPONSIBILITIES
 * ----------------
 * • Event registration
 * • Event publishing
 * • One-time events
 * • Event removal
 * • Diagnostics
 * • Debug logging
 * • Lifecycle management
 *
 * DESIGN PRINCIPLE
 * ----------------
 * Modules communicate through EventHub instead of calling
 * each other directly.
 *
 * ============================================================
 *
 * SECTION INDEX
 *
 * 1. Constructor
 * 2. Configuration
 * 3. Event Registration
 * 4. Event Publishing
 * 5. One-Time Events
 * 6. Event Removal
 * 7. Diagnostics
 * 8. Utilities
 * 9. Lifecycle
 *
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

            throw new Error(
                "Listener must be a function."
            );

        }

        if (!this.listeners.has(eventName)) {

            this.listeners.set(eventName, []);

            this.statistics.registeredEvents++;

        }

        this.listeners
            .get(eventName)
            .push(listener);

        return this;

    }

    off(eventName, listener) {

        if (!this.listeners.has(eventName)) {

            return this;

        }

        const remaining =
            this.listeners
                .get(eventName)
                .filter(fn => fn !== listener);

        if (remaining.length === 0) {

            this.listeners.delete(eventName);

            this.statistics.registeredEvents--;

        } else {

            this.listeners.set(
                eventName,
                remaining
            );

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

        const listeners =
            this.listeners.get(eventName);

        this.statistics.emitted++;

        const event = {

            name: eventName,

            payload,

            timestamp: Date.now()

        };

        this.eventHistory.push(event);

        if (
            this.eventHistory.length >
            this.maxHistory
        ) {

            this.eventHistory.shift();

        }

        if (!listeners) {

            return false;

        }

        for (const listener of listeners) {

            try {

                listener(payload);

                this.statistics.delivered++;

            } catch (error) {

                this.log(
                    "Listener error:",
                    eventName,
                    error
                );

            }

        }

        return true;

    } 

// ============================================================
// SECTION 5 — ONE-TIME EVENTS
// ============================================================

once(eventName, listener) {

    if (typeof listener !== "function") {

        throw new Error(
            "Listener must be a function."
        );

    }

    const wrapper = (payload) => {

        try {

            listener(payload);

        } finally {

            this.off(eventName, wrapper);

        }

    };

    return this.on(eventName, wrapper);

}

    // ============================================================
    // SECTION 6 — EVENT REMOVAL
    // ============================================================

        const remaining =
            this.listeners
                .get(eventName)
                .filter(fn => fn !== listener);

        if (remaining.length === 0) {

            this.listeners.delete(eventName);

            this.statistics.registeredEvents = Math.max(
                0,
                this.statistics.registeredEvents - 1
            );

        } else {

            this.listeners.set(
                eventName,
                remaining
            );

        }

        return this;

    }

    removeAllListeners(eventName = null) {

        if (eventName === null) {

            this.listeners.clear();

            this.statistics.registeredEvents = 0;

            return this;

        }

        if (this.listeners.delete(eventName)) {

            this.statistics.registeredEvents = Math.max(
                0,
                this.statistics.registeredEvents - 1
            );

        }

        return this;

    }

    // ============================================================
    // SECTION 7 — DIAGNOSTICS
    // ============================================================

    getStatistics() {

        return {

            ...this.statistics

        };

    }

    getHistory() {

        return [...this.eventHistory];

    }

    getRegisteredEvents() {

        return [...this.listeners.keys()];

    }

    getListenerCount(eventName) {

        if (!this.listeners.has(eventName)) {

            return 0;

        }

        return this.listeners
            .get(eventName)
            .length;

    }

    getStatus() {

        return {

            uptime:

                Date.now() - this.startedAt,

            registeredEvents:

                this.statistics.registeredEvents,

            emitted:

                this.statistics.emitted,

            delivered:

                this.statistics.delivered,

            historySize:

                this.eventHistory.length,

            maxHistory:

                this.maxHistory,

            debug:

                this.debug

        };

    }

    // ============================================================
    // SECTION 8 — UTILITIES
    // ============================================================

    log(...args) {

        if (!this.debug) {

            return;

        }

        console.log(

            "[EventHub]",

            ...args

        );

    }

    getListenerCount(eventName) {

        return this.listeners.has(eventName)

            ? this.listeners.get(eventName).length

            : 0;

    }

    getRegisteredEvents() {

        return [

            ...this.listeners.keys()

        ];

    }

    clearEvent(eventName) {

        this.listeners.delete(eventName);

        return this;

    }

    clearAllEvents() {

        this.listeners.clear();

        this.statistics.registeredEvents = 0;

        return this;

    }

    // ============================================================
    // SECTION 9 — LIFECYCLE
    // ============================================================

    removeAllListeners(eventName = null) {

        if (eventName === null) {

            this.listeners.clear();

            this.statistics.registeredEvents = 0;

            return this;

        }

        if (this.listeners.has(eventName)) {

            this.listeners.delete(eventName);

            this.statistics.registeredEvents =
                Math.max(
                    0,
                    this.statistics.registeredEvents - 1
                );

        }

        return this;

    }

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
