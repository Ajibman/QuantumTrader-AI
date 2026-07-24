// ============================================================
// QuantumTrader-AI™
// Event Hub
// Central Runtime Event Bus
// Version 1 - Shipping Manager Hardened
// ============================================================

class EventHub {

    constructor() {

        this.events = new Map();
        this.history = [];
        this.maxHistory = 250;

        // Registered runtime modules
        this.modules = new Map();

    }

    // --------------------------------------------------------
    // Subscribe
    // --------------------------------------------------------
    on(eventName, listener) {

        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }

        this.events.get(eventName).add(listener);

        return () => this.off(eventName, listener);

    }

    // --------------------------------------------------------
    // Subscribe Once
    // --------------------------------------------------------
    once(eventName, listener) {

        const wrapper = (payload) => {

            listener(payload);

            this.off(eventName, wrapper);

        };

        this.on(eventName, wrapper);

    }

    // --------------------------------------------------------
    // Remove Listener
    // --------------------------------------------------------
    off(eventName, listener) {

        if (!this.events.has(eventName)) return;

        const listeners = this.events.get(eventName);

        listeners.delete(listener);

        if (listeners.size === 0) {
            this.events.delete(eventName);
        }

    }

    // --------------------------------------------------------
    // Register Module
    // --------------------------------------------------------
    registerModule(name, metadata = {}) {

        this.modules.set(name, {
            ...metadata,
            registeredAt: Date.now()
        });

    }

    // --------------------------------------------------------
    // Emit Event
    // Supports:
    // emit("event", payload)
    // emit({ type, payload })
    // --------------------------------------------------------
    emit(eventName, payload = {}) {

        if (
            typeof eventName === "object" &&
            eventName !== null
        ) {

            payload = eventName.payload || {};
            eventName = eventName.type;

        }

        if (!eventName) return;

        const event = {
            name: eventName,
            payload,
            timestamp: Date.now()
        };

        this.history.push(event);

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        const listeners = this.events.get(eventName);

        if (!listeners) return;

        listeners.forEach(fn => {

            try {

                fn(payload);

            } catch (err) {

                console.error(
                    "[EventHub]",
                    eventName,
                    err
                );

            }

        });

    }

    // --------------------------------------------------------
    // Clear Event
    // --------------------------------------------------------
    clear(eventName) {

        this.events.delete(eventName);

    }

    // --------------------------------------------------------
    // Reset Hub
    // --------------------------------------------------------
    reset() {

        this.events.clear();
        this.history = [];
        this.modules.clear();

    }

    // --------------------------------------------------------
    // Diagnostics
    // --------------------------------------------------------
    getHistory() {

        return [...this.history];

    }

    getListenerCount(eventName) {

        return this.events.has(eventName)
            ? this.events.get(eventName).size
            : 0;

    }

    getRegisteredModules() {

        return [...this.modules.entries()];

    }

}

const eventHub = new EventHub();

export default eventHub;
export { eventHub };
