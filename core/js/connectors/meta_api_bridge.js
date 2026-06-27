/**
 * ============================================================
 * QuantumTrader-AI
 * STAGE 36C — META API BRIDGE
 * Version: 3.0 Production
 * ============================================================
 *
 * PURPOSE
 * --------
 * Provides a unified interface between QuantumTrader-AI's
 * intelligence systems and the external market infrastructure.
 *
 * RESPONSIBILITIES
 * ----------------
 * • Connect MetaBrain to market services
 * • Connect MetaBrain to ExchangeGateway
 * • Forward market data requests
 * • Forward execution requests
 * • Route events
 * • Runtime diagnostics
 * • Health monitoring
 *
 * IMPORTANT
 * ---------
 * Meta API Bridge does NOT make trading decisions.
 *
 * Trading decisions originate from:
 *
 * • MetaBrain
 * • Autonomous Strategy Generator
 * • Autonomous Market OS
 *
 * ============================================================
 *
 * SECTION INDEX
 *
 * 1. Constructor
 * 2. Configuration
 * 3. Connector Registration
 * 4. Market Data Bridge
 * 5. Execution Bridge
 * 6. Event Routing
 * 7. Diagnostics
 * 8. Utilities
 *
 * ============================================================
 */

export class MetaApiBridge {

    // ============================================================
    // SECTION 1 — CONSTRUCTOR
    // ============================================================

    constructor(config = {}) {

        this.debug = config.debug ?? false;

        this.marketLayer = null;

        this.exchangeGateway = null;

        this.eventHub = null;

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

    attachEventHub(eventHub) {

        this.eventHub = eventHub;

        return this;

    }

    // ============================================================
    // SECTION 3 — CONNECTOR REGISTRATION
    // ============================================================

    attachMarketLayer(marketLayer) {

        this.marketLayer = marketLayer;

        return this;

    }

    attachExchangeGateway(exchangeGateway) {

        this.exchangeGateway = exchangeGateway;

        return this;

    }

    getMarketLayer() {

        return this.marketLayer;

    }

    getExchangeGateway() {

        return this.exchangeGateway;

    }

    isReady() {

        return (
            this.marketLayer !== null &&
            this.exchangeGateway !== null
        );

    }

    // ============================================================
    // SECTION 4 — MARKET DATA BRIDGE
    // ============================================================

    async getMarketData(symbol, options = {}) {

        if (!this.marketLayer) {

            throw new Error(
                "MarketConnectivityLayer is not attached."
            );

        }

        return await this.marketLayer.getMarketData(
            symbol,
            options
        );

    }

    async getLastMarketTick() {

        if (!this.marketLayer) {

            return null;

        }

        return this.marketLayer.getLastTick();

    }

    // ============================================================
    // SECTION 5 — EXECUTION BRIDGE
    // ============================================================

    async submitOrder(order) {

        if (!this.exchangeGateway) {

            throw new Error(
                "ExchangeGateway is not attached."
            );

        }

        return await this.exchangeGateway.submitOrder(
            order
        );

    }

    async getExecutionHistory() {

        if (!this.exchangeGateway) {

            return [];

        }

        return this.exchangeGateway.getExecutionHistory();

    }

    async getGatewayStatus() {

        if (!this.exchangeGateway) {

            return null;

        }

        return this.exchangeGateway.getGatewayStatus();

    }

    // ============================================================
    // SECTION 6 — EVENT ROUTING
    // ============================================================

    emit(eventName, payload = {}) {

        if (!this.eventHub) {

            return;

        }

        if (typeof this.eventHub.emit === "function") {

            this.eventHub.emit(eventName, payload);

        }

    }

    // ============================================================
    // SECTION 7 — DIAGNOSTICS
    // ============================================================

    getBridgeStatus() {

        return {

            ready: this.isReady(),

            uptime: Date.now() - this.startedAt,

            marketLayerAttached:
                this.marketLayer !== null,

            exchangeGatewayAttached:
                this.exchangeGateway !== null,

            eventHubAttached:
                this.eventHub !== null,

            debug: this.debug

        };

    }

    // ============================================================
    // SECTION 8 — UTILITIES
    // ============================================================

    log(...args) {

        if (!this.debug) return;

        console.log(
            "[MetaApiBridge]",
            ...args
        );

    }

    destroy() {

        this.marketLayer = null;

        this.exchangeGateway = null;

        this.eventHub = null;

    }

}
