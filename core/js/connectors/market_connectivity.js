// ============================================================
// QuantumTrader-AI™
// Market Connectivity Layer
// Event-Driven Market Bridge
// ============================================================

import { eventHub } from "../event_hub.js";

class MarketConnectivityLayer {

    constructor() {

        this.connected = false;
        this.provider = null;
        this.lastHeartbeat = null;

    }

    // --------------------------------------------------------
    // Register Market Provider
    // --------------------------------------------------------

    connect(provider) {

        if (!provider) {
            throw new Error("Market provider is required.");
        }

        this.provider = provider;
        this.connected = true;

        eventHub.emit("market:connected", {
            provider: provider.name || "Unknown"
        });

    }

    // --------------------------------------------------------
    // Disconnect
    // --------------------------------------------------------

    disconnect() {

        const providerName =
            this.provider?.name || "Unknown";

        this.provider = null;
        this.connected = false;

        eventHub.emit("market:disconnected", {
            provider: providerName
        });

    }

    // --------------------------------------------------------
    // Incoming Market Tick
    // --------------------------------------------------------

    publishTick(tick) {

        this.lastHeartbeat = Date.now();

        eventHub.emit("market:tick", tick);

    }

    // --------------------------------------------------------
    // Candle Updates
    // --------------------------------------------------------

    publishCandle(candle) {

        eventHub.emit("market:candle", candle);

    }

    // --------------------------------------------------------
    // Order Book
    // --------------------------------------------------------

    publishOrderBook(orderBook) {

        eventHub.emit("market:orderbook", orderBook);

    }

    // --------------------------------------------------------
    // Market Status
    // --------------------------------------------------------

    publishStatus(status) {

        eventHub.emit("market:status", status);

    }

    // --------------------------------------------------------
    // Errors
    // --------------------------------------------------------

    publishError(error) {

        eventHub.emit("market:error", error);

    }

    // --------------------------------------------------------
    // Heartbeat
    // --------------------------------------------------------

    heartbeat() {

        this.lastHeartbeat = Date.now();

        eventHub.emit("market:heartbeat", {
            timestamp: this.lastHeartbeat
        });

    }

    // --------------------------------------------------------
    // Diagnostics
    // --------------------------------------------------------

    isConnected() {

        return this.connected;

    }

    getProvider() {

        return this.provider;

    }

    getHeartbeat() {

        return this.lastHeartbeat;

    }

}

export const marketConnectivityLayer =
    new MarketConnectivityLayer();
