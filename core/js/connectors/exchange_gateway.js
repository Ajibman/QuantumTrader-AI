    /**
 * ============================================================
 * QuantumTrader-AI
 * STAGE 36B — EXCHANGE GATEWAY
 * Version: 3.0 Production
 * ============================================================
 *
 * PURPOSE
 * --------
 * Central execution gateway responsible for routing all
 * approved trade orders to supported exchanges and brokers.
 *
 * RESPONSIBILITIES
 * ----------------
 * • Exchange registration
 * • Paper execution
 * • Live execution
 * • Order routing
 * • Order lifecycle management
 * • Governance integration
 * • Event broadcasting
 * • Diagnostics
 * • Execution statistics
 *
 * IMPORTANT
 * ---------
 * This component NEVER generates trading decisions.
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
 * 3. Exchange Registry
 * 4. Governance
 * 5. Validation
 * 6. Order Routing
 * 7. Paper Execution
 * 8. Live Execution
 * 9. Order Management
 * 10. Event Broadcasting
 * 11. Diagnostics
 * 12. Utilities
 *
 * ============================================================
 */

export class ExchangeGateway {

    // ============================================================
    // SECTION 1 — CONSTRUCTOR
    // ============================================================

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

        this.executionStats = {

            total: 0,

            successful: 0,

            failed: 0,

            paper: 0,

            live: 0

        };

        this.startedAt = Date.now();

    }

    // ============================================================
    // SECTION 2 — CONFIGURATION
    // ============================================================

    setMode(mode) {

        this.mode = mode;

        return this;

    }

    getMode() {

        return this.mode;

    }

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

    attachGovernanceGate(governanceGate) {

        this.governanceGate = governanceGate;

        return this;

    }

    setPrimaryExchange(name) {

        if (this.exchanges.has(name)) {

            this.primaryExchange = name;

        }

        return this;

    }

    // ============================================================
    // SECTION 3 — EXCHANGE REGISTRY
    // ============================================================

    registerExchange(name, exchange) {

        if (!name || !exchange) {

            throw new Error("Invalid exchange registration.");

        }

        this.exchanges.set(name, exchange);

        if (!this.primaryExchange) {

            this.primaryExchange = name;

        }

        return this;

    }

    unregisterExchange(name) {

        this.exchanges.delete(name);

        if (this.primaryExchange === name) {

            this.primaryExchange = null;

        }

        return this;

    }

    hasExchange(name) {

        return this.exchanges.has(name);

    }

    getExchange(name) {

        return this.exchanges.get(name) ?? null;

    }

    getExchangeNames() {

        return [...this.exchanges.keys()];

    }

    getPrimaryExchange() {

        if (!this.primaryExchange) {

            return null;

        }

        return this.exchanges.get(this.primaryExchange);

    }

    // ============================================================
    // SECTION 4 — GOVERNANCE
    // ============================================================

    async requestExecutionApproval(order) {

        if (!this.governanceGate) {

            return {
                approved: true,
                reason: "Governance gate not attached."
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

        return await this.governanceGate.approveExecution(order);

    }

        // ============================================================
    // SECTION 5 — ORDER VALIDATION
    // ============================================================

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

        const side = order.side.toUpperCase();

        if (!["BUY", "SELL"].includes(side)) {
            throw new Error("Invalid order side.");
        }

        if (
            typeof order.quantity !== "number" ||
            order.quantity <= 0
        ) {
            throw new Error(
                "Order quantity must be greater than zero."
            );
        }

        return true;

    }

    generateOrderId() {

        return [
            "QT",
            Date.now(),
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()
        ].join("-");

    }

    // ============================================================
    // SECTION 6 — ORDER ROUTING
    // ============================================================

    async submitOrder(order) {

        this.validateOrder(order);

        const approval =
            await this.requestExecutionApproval(order);

        if (!approval.approved) {

            const error = new Error(
                approval.reason ??
                "Execution rejected by governance."
            );

            this.executionStats.total++;
            this.executionStats.failed++;

            this.broadcastExecutionFailure(error, order);

            throw error;

        }

        this.executionStats.total++;

        if (this.mode === "PAPER") {

            this.executionStats.paper++;

            return await this.executePaperOrder(order);

        }

        this.executionStats.live++;

        return await this.executeLiveOrder(order);
        submitOrder()

     }

    // ============================================================
    // SECTION 7 — PAPER EXECUTION
    // ============================================================
             
    async executePaperOrder(order) {

        const orderId = this.generateOrderId();

        const execution = {

            orderId,

            mode: "PAPER",

            exchange: "SIMULATOR",

            status: "FILLED",

            symbol: order.symbol,

            side: order.side.toUpperCase(),

            quantity: order.quantity,

            price: order.price ?? null,

            timestamp: Date.now()

        };

        this.completedOrders.set(orderId, execution);

        this.executionHistory.push(execution);

        this.executionStats.successful++;

        this.broadcastExecution(execution);

        return execution;

    }

    // ============================================================
    // SECTION 8 — LIVE EXECUTION
    // ============================================================

    async executeLiveOrder(order) {

        const exchange = this.getPrimaryExchange();

        if (!exchange) {

            throw new Error(
                "No primary exchange configured."
            );

        }

        if (typeof exchange.executeOrder !== "function") {

            throw new Error(
                "Exchange does not implement executeOrder()."
            );

        }

        try {

            const execution =
                await exchange.executeOrder(order);

            const orderId =
                execution.orderId ??
                this.generateOrderId();

            execution.orderId = orderId;

            execution.mode = "LIVE";

            execution.timestamp ??= Date.now();

            this.completedOrders.set(
                orderId,
                execution
            );

            this.executionHistory.push(execution);

            this.executionStats.successful++;

            this.broadcastExecution(execution);

            return execution;

        } catch (error) {

            const orderId = this.generateOrderId();

            this.failedOrders.set(orderId, {

                orderId,

                order,

                error: error.message,

                timestamp: Date.now()

            });

            this.executionStats.failed++;

            this.broadcastExecutionFailure(
                error,
                order
            );

            throw error;

        }

    }

// ============================================================
    // SECTION 9 — ORDER MANAGEMENT
    // ============================================================

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

    }

    // ============================================================
    // SECTION 10 — EVENT BROADCASTING
    // ============================================================

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
                    error: error.message ?? String(error),
                    timestamp: Date.now()
                }
            );

        }

    }

    // ============================================================
    // SECTION 11 — DIAGNOSTICS
    // ============================================================

    getGatewayStatus() {

        return {

            mode: this.mode,

            uptime: Date.now() - this.startedAt,

            exchangeCount: this.exchanges.size,

            primaryExchange: this.primaryExchange,

            pendingOrders: this.pendingOrders.size,

            completedOrders: this.completedOrders.size,

            failedOrders: this.failedOrders.size,

            executionHistory: this.executionHistory.length,

            statistics: {

                ...this.executionStats

            },

            debug: this.debug

        };

    }

    // ============================================================
    // SECTION 12 — UTILITIES
    // ============================================================

    log(...args) {

        if (!this.debug) return;

        console.log(
            "[ExchangeGateway]",
            ...args
        );

    }

    resetStatistics() {

        this.executionStats = {

            total: 0,

            successful: 0,

            failed: 0,

            paper: 0,

            live: 0

        };

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

        this.resetStatistics();

    }

}
