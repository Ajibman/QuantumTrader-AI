// ============================================================
// QuantumTrader-AI™
// Event Hub
// Central Runtime Event Bus
// ============================================================

class EventHub {
    constructor() {
        this.events = new Map();
        this.history = [];
        this.maxHistory = 250;
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

        this.events.get(eventName).delete(listener);
    }

    // --------------------------------------------------------
    // Emit Event
    // --------------------------------------------------------
    emit(eventName, payload = {}) {

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

}

export const eventHub = new EventHub();
