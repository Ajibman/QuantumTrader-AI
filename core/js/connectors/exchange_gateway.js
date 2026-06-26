/**
 * =====================================================
 * QuantumTrader-AI
 * STAGE 36B — EXCHANGE GATEWAY
 * Version: 2.0 Production
 * =====================================================
 *
 * Purpose:
 * Provides a unified execution gateway for all supported
 * exchanges and brokers.
 *
 * Responsibilities:
 * • Exchange registration
 * • Order validation
 * • Paper trading
 * • Live trading
 * • Order routing
 * • Governance integration
 * • Event broadcasting
 * * • Execution diagnostics
 *
 * NOTE:
 * This gateway NEVER generates trading signals.
 *
 * Trading decisions come from:
 *
 * MetaBrain
 * Strategy Engine
 * Autonomous Market OS
 *
 * =====================================================
 *
 * SECTION INDEX
 *
 * 1. Constructor
 * 2. Configuration
 * 3. Exchange Registration
 * 4. Governance Hook
 *
 * =====================================================
 */

export class ExchangeGateway {

    // =====================================================
    // SECTION 1 — CONSTRUCTOR
    // =====================================================

    constructor(config = {}) {

        this.mode = config.mode ?? "PAPER";

        this.debug = config.debug ?? false;

        this.exchanges = new Map();

        this.primaryExchange = null;

        this.eventHub = null;

        this.governanceGate = null;

        this.executionHistory = [];

        this.pendingOrders = new Map();

        this.completedOrders = new Map();

        this.failedOrders = new Map();

        this.startedAt = Date.now();

    }

    // =====================================================
    // SECTION 2 — CONFIGURATION
    // =====================================================

    setMode(mode) {

        this.mode = mode;

        return this;

    }

    getMode() {

        return this.mode;

    }

    enableDebug() {

        this.debug = true;

    }

    disableDebug() {

        this.debug = false;

    }

    attachEventHub(eventHub) {

        this.eventHub = eventHub;

        return this;

    }

    attachGovernanceGate(governanceGate) {

        this.governanceGate = governanceGate;

        return this;

    }

    // =====================================================
    // SECTION 3 — EXCHANGE REGISTRATION
    // =====================================================

    registerExchange(name, exchange) {

        if (!name || !exchange) {

            throw new Error(
                "Invalid exchange registration."
            );

        }

        this.exchanges.set(name, exchange);

        if (!this.primaryExchange) {

            this.primaryExchange = name;

        }

        return this;

    }

    unregisterExchange(name) {

        this.exchanges.delete(name);

    }

    getExchanges() {

        return [...this.exchanges.keys()];

    }

    hasExchange(name) {

        return this.exchanges.has(name);

    }

    setPrimaryExchange(name) {

        if (this.exchanges.has(name)) {

            this.primaryExchange = name;

        }

        return this;

    }

    // =====================================================
    // SECTION 4 — GOVERNANCE HOOK
    // =====================================================

    async requestExecutionApproval(order) {

        if (!this.governanceGate) {

            return {

                approved: true,

                reason: "No governance gate attached."

            };

        }

        if (
            typeof this.governanceGate.approveExecution !==
            "function"
        ) {

            return {

                approved: true,

                reason: "Governance approval unavailable."

            };

        }

        return await this.governanceGate
            .approveExecution(order);

            export class ExchangeGateway {

    ...

    async requestExecutionApproval(order) {

        ...

        return await this.governanceGate
            .approveExecution(order);

    }

    }

    // =====================================================
    // SECTION 5 — ORDER VALIDATION
    // =====================================================

      validateOrder(order) {

        if (!order) {

            throw new Error("Order is required.");

        }

        if (!order.symbol) {

            throw new Error("Order symbol is required.");

        }

        if (!order.side) {

            throw new Error("Order side is required.");

        }

        if (!["BUY", "SELL"].includes(order.side.toUpperCase())) {

            throw new Error("Invalid order side.");

        }

        if (typeof order.quantity !== "number" || order.quantity <= 0) {

            throw new Error("Order quantity must be greater than zero.");

        }

        return true;

    }

    generateOrderId() {

        return [
            "QT",
            Date.now(),
            Math.random().toString(36).substring(2, 8).toUpperCase()
        ].join("-");

  }
  
  // ================================================================
  // SECTION 6 - ORDER ROUTING
  // ================================================================

  async submitOrder(order) {

        this.validateOrder(order);

        const approval =
            await this.requestExecutionApproval(order);

        if (!approval.approved) {

            throw new Error(
                approval.reason ?? "Execution rejected."
            );

        }

        if (this.mode === "PAPER") {

            return await this.executePaperOrder(order);

        }

        return await this.executeLiveOrder(order);

  }

  // =====================================================
    // SECTION 7 — PAPER TRADING ENGINE
    // =====================================================

    async executePaperOrder(order) {

        const orderId = this.generateOrderId();

        const execution = {

            orderId,

            mode: "PAPER",

            exchange: "SIMULATOR",

            status: "FILLED",

            symbol: order.symbol,

            side: order.side,

            quantity: order.quantity,

            price: order.price ?? null,

            timestamp: Date.now()

        };

        this.completedOrders.set(orderId, execution);

        this.executionHistory.push(execution);

        this.broadcastExecution(execution);

        return execution;

    }

    // =====================================================
    // SECTION 8 — LIVE TRADING ENGINE
    // =====================================================

    async executeLiveOrder(order) {

        if (!this.primaryExchange) {

            throw new Error(
                "No exchange has been registered."
            );

        }

        const exchange =
            this.exchanges.get(this.primaryExchange);

        if (!exchange) {

            throw new Error(
                "Primary exchange unavailable."
            );

        }

        if (typeof exchange.executeOrder !== "function") {

            throw new Error(
                "Exchange does not support executeOrder()."
            );

        }

        const execution =
            await exchange.executeOrder(order);

        this.executionHistory.push(execution);

        if (execution.orderId) {

            this.completedOrders.set(
                execution.orderId,
                execution
            );

        }

        this.broadcastExecution(execution);

        return execution;

    }

    // =====================================================
    // SECTION 9 — ORDER MANAGEMENT
    // =====================================================

    getOrder(orderId) {

        return (
            this.completedOrders.get(orderId) ??
            this.pendingOrders.get(orderId) ??
            this.failedOrders.get(orderId) ??
            null
        );

    }

    getExecutionHistory() {

        return [...this.executionHistory];

    }

    clearExecutionHistory() {

        this.executionHistory.length = 0;

    // =====================================================
    // SECTION 10 — EVENT BROADCASTING
    // =====================================================

    broadcastExecution(execution) {

        if (!this.eventHub) return;

        if (typeof this.eventHub.emit === "function") {

            this.eventHub.emit(
                "execution:completed",
                execution
            );

        }

    }

    broadcastExecutionFailure(error, order = null) {

        if (!this.eventHub) return;

        if (typeof this.eventHub.emit === "function") {

            this.eventHub.emit(
                "execution:failed",
                {
                    order,
                    error,
                    timestamp: Date.now()
                }
            );

        }

    }

    // =====================================================
    // SECTION 11 — DIAGNOSTICS
    // =====================================================

    getGatewayStatus() {

        return {

            mode: this.mode,

            uptime:
                Date.now() - this.startedAt,

            exchangeCount:
                this.exchanges.size,

            primaryExchange:
                this.primaryExchange,

            pendingOrders:
                this.pendingOrders.size,

            completedOrders:
                this.completedOrders.size,

            failedOrders:
                this.failedOrders.size,

            executionHistory:
                this.executionHistory.length,

            debug:
                this.debug

        };

    }

    // =====================================================
    // SECTION 12 — DEBUG UTILITIES
    // =====================================================

    log(...args) {

        if (!this.debug) return;

        console.log(
            "[ExchangeGateway]",
            ...args
        );

    }

    destroy() {

        this.exchanges.clear();

        this.pendingOrders.clear();

        this.completedOrders.clear();

        this.failedOrders.clear();

        this.executionHistory.length = 0;

        this.eventHub = null;

        this.governanceGate = null;

        this.primaryExchange = null;

    }

            }
  
