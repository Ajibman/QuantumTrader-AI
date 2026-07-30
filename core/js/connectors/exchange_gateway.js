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

acceptTransportContract(
    transport
) {

    if (!transport) {

        throw new Error(
            "Transport contract is required."
        );

    }

    if (!transport.route) {

        throw new Error(
            "Transport route is missing."
        );

    }

    const execution =
    transport.route?.execution;

    if (!execution) {

        throw new Error(
            "Execution package is missing."
        );

    }

    return {

        symbol:
            execution.signal?.symbol,

        side:
            execution.signal?.side,

        quantity:
            execution.signal?.quantity,

        price:
            execution.signal?.price,

        metadata: {

            executionId:
                execution.executionId,

            transportId:
                transport.transportId,

            routeId:
                transport.route.routeId

        }

    };

}

async processTransportContract(
    transport
) {

    const order =
        this.acceptTransportContract(
            transport
        );

    return await this.submitOrder(
        order
    );

}

// ============================================================
// SECTION 6 — ORDER ROUTING
// ============================================================

/**
 * Submit an order for execution.
 *
 * IMPORTANT
 * ---------
 * ExchangeGateway is responsible for:
 *
 * • Order validation
 * • Governance approval
 * • Execution mode selection
 * • Paper execution
 * • Live execution
 *
 * ExchangeGateway does NOT:
 *
 * • Build execution confirmation contracts
 * • Publish execution:confirmed
 * • Build execution feedback contracts
 * • Publish execution:feedback
 *
 * Those responsibilities belong to the
 * Execution Confirmation Layer and
 * Execution Feedback Layer.
 *
 * @param {Object} order
 * @returns {Promise<Object>}
 */
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

        this.broadcastExecutionFailure(
            error,
            order
        );

        throw error;

    }

    this.executionStats.total++;

    /*
     * --------------------------------------------------------
     * PAPER EXECUTION
     * --------------------------------------------------------
     *
     * The Gateway returns the raw execution result.
     *
     * Confirmation is handled upstream by the
     * MetaSystemOrchestrator.
     */

    if (this.mode === "PAPER") {

        this.executionStats.paper++;

        return await this.executePaperOrder(
            order
        );

    }

    /*
     * --------------------------------------------------------
     * LIVE EXECUTION
     * --------------------------------------------------------
     */

    this.executionStats.live++;

    return await this.executeLiveOrder(
        order
    );

}


// ============================================================
// SECTION 7 — PAPER EXECUTION
// ============================================================

/**
 * Execute an order in PAPER mode.
 *
 * This function produces a raw execution result only.
 *
 * It does NOT publish execution:confirmed.
 *
 * The MetaSystemOrchestrator is responsible for passing
 * the returned result to the Execution Confirmation Layer.
 *
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async executePaperOrder(order) {

    const orderId =
        this.generateOrderId();

    const execution = {

        orderId,

        mode:
            "PAPER",

        exchange:
            "SIMULATOR",

        status:
            "FILLED",

        symbol:
            order.symbol,

        side:
            order.side.toUpperCase(),

        quantity:
            order.quantity,

        price:
            order.price ?? null,

        timestamp:
            Date.now()

    };

    /*
     * Store raw execution result.
     */

    this.completedOrders.set(
        orderId,
        execution
    );

    this.executionHistory.push(
        execution
    );

    this.executionStats.successful++;

    /*
     * IMPORTANT
     * ----------
     * No execution:confirmed event is emitted here.
     *
     * The execution result returns to the
     * MetaSystemOrchestrator, which will invoke:
     *
     * confirmExecution(execution)
     */

    return execution;

}


// ============================================================
// SECTION 8 — LIVE EXECUTION
// ============================================================

/**
 * Execute an order in LIVE mode.
 *
 * This function produces a raw execution result only.
 *
 * It does NOT:
 *
 * • Publish execution:confirmed
 * • Build confirmation contracts
 * • Publish execution:feedback
 *
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async executeLiveOrder(order) {

    const exchange =
        this.getPrimaryExchange();

    if (!exchange) {

        const error = new Error(
            "No primary exchange configured."
        );

        this.executionStats.failed++;

        this.broadcastExecutionFailure(
            error,
            order
        );

        throw error;

    }

    if (
        typeof exchange.executeOrder !==
        "function"
    ) {

        const error = new Error(
            "Exchange does not implement executeOrder()."
        );

        this.executionStats.failed++;

        this.broadcastExecutionFailure(
            error,
            order
        );

        throw error;

    }

    try {

        const execution =
            await exchange.executeOrder(
                order
            );

        /*
         * Normalize the execution result.
         */

        const normalizedExecution = {

            ...execution,

            orderId:
                execution?.orderId ??
                this.generateOrderId(),

            mode:
                "LIVE",

            symbol:
                execution?.symbol ??
                order.symbol,

            side:
                execution?.side ??
                order.side.toUpperCase(),

            quantity:
                execution?.quantity ??
                order.quantity,

            price:
                execution?.price ??
                order.price ??
                null,

            timestamp:
                execution?.timestamp ??
                Date.now()

        };

        const orderId =
            normalizedExecution.orderId;

        /*
         * Store raw execution result.
         */

        this.completedOrders.set(
            orderId,
            normalizedExecution
        );

        this.executionHistory.push(
            normalizedExecution
        );

        this.executionStats.successful++;

        /*
         * IMPORTANT
         * ----------
         * The old code called:
         *
         * this.broadcastExecution(execution)
         *
         * That method does not exist and has therefore been
         * removed.
         *
         * The Gateway now returns the raw execution result.
         *
         * MetaSystemOrchestrator will pass it to:
         *
         * confirmExecution(normalizedExecution)
         */

        return normalizedExecution;

    } catch (error) {

        const orderId =
            this.generateOrderId();

        this.failedOrders.set(
            orderId,
            {

                orderId,

                order,

                error:
                    error?.message ??
                    String(error),

                timestamp:
                    Date.now()

            }
        );

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

        this.completedOrders.get(
            orderId
        ) ??

        this.pendingOrders.get(
            orderId
        ) ??

        this.failedOrders.get(
            orderId
        ) ??

        null

    );

}

getExecutionHistory() {

    return [
        ...this.executionHistory
    ];

}

clearExecutionHistory() {

    this.executionHistory.length = 0;

}
    🌹=======🌹
    
 /**
 * ====================================================
 * QuantumTrader-AI
 * STAGE 30 — FULL SYSTEM ORCHESTRATION LAYER
 * Version: 2.0 Production
 * =====================================================
 *
 * Purpose:
 * Unify ALL major intelligence and execution layers into
 * a single autonomous orchestration loop.
 *
 * This is the "brain of the brain".
 *
 * Coordinates:
 * • MetaBrain
 * • Portfolio Intelligence
 * • Capital Allocation Engine
 * • Risk Governor
 * • Strategy Coordinator
 * • Logistics Intelligence
 * • Correlation Engine
 * • Execution Optimizer
 * • Market Connectivity Layer
 * • Order Router
 * • Exchange Gateway
 * • Live Execution Governance Gate
 * • Event Hub
 *
 * Execution Flow:
 *
 * MetaSystemOrchestrator
 *        ↓
 * Execution Optimizer
 *        ↓
 * Order Router
 *        ↓
 * Transport Contract
 *        ↓
 * Exchange Gateway
 *        ↓
 * Raw Execution Result
 *
 * =====================================================
 */

export class MetaSystemOrchestrator {

    // =====================================================
    // SECTION 1 — CONSTRUCTOR
    // =====================================================

    constructor({

        metaBrain,

        portfolioEngine,

        capitalEngine,

        riskGovernor,

        strategyCoordinator,

        logisticsEngine,

        correlationEngine,

        executionOptimizer,

        orderRouter = null,

        eventHub = null,

        marketConnectivity = null,

        exchangeGateway = null,

        governanceGate = null,

        mode = "PAPER",

        debug = false

    } = {}) {

        this.metaBrain = metaBrain;

        this.portfolioEngine = portfolioEngine;

        this.capitalEngine = capitalEngine;

        this.riskGovernor = riskGovernor;

        this.strategyCoordinator = strategyCoordinator;

        this.logisticsEngine = logisticsEngine;

        this.correlationEngine = correlationEngine;

        this.executionOptimizer = executionOptimizer;

        this.orderRouter = orderRouter;

        this.eventHub = eventHub;

        this.marketConnectivity = marketConnectivity;

        this.exchangeGateway = exchangeGateway;

        this.governanceGate = governanceGate;

        this.mode = mode;

        this.debug = debug;

        this.startedAt = Date.now();

        this.metrics = {

            completedCycles: 0,

            blockedCycles: 0,

            successfulCycles: 0,

            failedCycles: 0

        };

        this.state = {

            cycle: 0,

            lastSignal: null,

            lastDecision: null,

            lastCycleAt: null,

            systemMode: "ACTIVE"

        };

    }

    // =====================================================
    // SECTION 2 — MAIN ORCHESTRATION LOOP
    // =====================================================

    async run(signal, portfolio = {}) {

        this.state.cycle++;

        // ---------------------------------------------
        // Runtime Validation
        // ---------------------------------------------

        if (!signal || typeof signal !== "object") {

            throw new Error(
                "MetaSystemOrchestrator requires a valid signal object."
            );

        }

        if (portfolio === null || typeof portfolio !== "object") {

            throw new Error(
                "MetaSystemOrchestrator requires a valid portfolio object."
            );

        }

        if (this.state.systemMode === "LOCKDOWN") {

            return {

                status: "SYSTEM_LOCKDOWN",

                approved: false

            };

        }

        // ---------------------------------------------
        // ORCHESTRATION CYCLE START
        // ---------------------------------------------

        if (this.eventHub?.emit) {

            this.eventHub.emit(

                "orchestrator:cycle:start",

                {

                    cycle: this.state.cycle,

                    mode: this.mode,

                    timestamp: Date.now()

                }

            );

        }

        // ---------------------------------------------
        // MARKET CONNECTIVITY
        // ---------------------------------------------

        const connectivity =
            this.marketConnectivity?.getStatus?.() ?? null;

        // ---------------------------------------------
        // 1. META INTELLIGENCE DECISION
        // ---------------------------------------------

        const decision =
            this.metaBrain?.evaluate?.(signal);

        this.state.lastDecision = decision;

        // ---------------------------------------------
        // 2. PORTFOLIO ANALYSIS
        // ---------------------------------------------

        const portfolioState =
            this.portfolioEngine?.analyze?.(portfolio) ?? {

                exposure: 0,

                health: 100

            };

        // ---------------------------------------------
        // 3. CAPITAL ALLOCATION
        // ---------------------------------------------

        const allocation =
            this.capitalEngine.allocate({

                capital:
                    portfolio.cash ?? 0,

                confidence:
                    decision.confidence,

                riskLevel:
                    signal.riskLevel,

                portfolio,

                existingExposure:
                    portfolioState.exposure

            });

        // ---------------------------------------------
        // 4. RISK GOVERNANCE CHECK
        // ---------------------------------------------

        const risk =
            this.riskGovernor.evaluate({

                portfolio,

                allocation: {

                    equity:
                        allocation.allocationPercent

                },

                drawdown:
                    portfolioState.drawdown ?? 0

            });

        if (!risk.approved) {

            this.metrics.blockedCycles++;

            return {

                status: "BLOCKED_BY_RISK",

                risk,

                decision,

                allocation,

                execution: null

            };

        }

        // ---------------------------------------------
        // 5. STRATEGY ROUTING
        // ---------------------------------------------

        const strategy =
            this.strategyCoordinator.route({

                signal,

                decision,

                portfolio

            });

        // ---------------------------------------------
        // 6. GLOBAL LOGISTICS
        // ---------------------------------------------

        const logistics =
            this.logisticsEngine?.snapshot?.() ?? null;

        // ---------------------------------------------
        // 7. CORRELATION ANALYSIS
        // ---------------------------------------------

        const correlation =
            this.correlationEngine?.snapshot?.() ?? null;

        // ---------------------------------------------
        // 8. EXECUTION OPTIMIZATION
        // ---------------------------------------------

        const execution =
            this.executionOptimizer.optimize({

                signal,

                decision,

                allocation,

                market:
                    signal.marketData ?? {},

                routing:
                    strategy

            });

        // ---------------------------------------------
        // 9. LIVE EXECUTION GOVERNANCE
        // ---------------------------------------------

        const governance =
            this.governanceGate?.evaluate?.({

                strategy,

                simulationResult: decision,

                portfolio,

                signal,

                risk

            }) ?? {

                approved: true,

                violations: []

            };

        if (!governance.approved) {

            this.metrics.blockedCycles++;

            return {

                status: "BLOCKED_BY_GOVERNANCE",

                governance,

                decision,

                allocation,

                execution: null

            };

        }

        // ---------------------------------------------
        // 10. ORDER ROUTING
        // ---------------------------------------------
        //
        // The Orchestrator does NOT submit directly to
        // ExchangeGateway.
        //
        // The Order Router is the controlled bridge.
        //
        // Execution Optimizer
        //        ↓
        // Order Router
        //        ↓
        // Transport Contract
        //        ↓
        // Exchange Gateway
        //
        // ---------------------------------------------

        let executionResult = null;

        if (this.mode === "LIVE") {

            if (!this.orderRouter) {

                this.metrics.failedCycles++;

                return {

                    status:
                        "ORDER_ROUTER_UNAVAILABLE",

                    approved: false,

                    decision,

                    allocation,

                    risk,

                    governance,

                    execution,

                    executionResult: null

                };

            }

            const transportContract = {

                transportId:
                    `transport-${this.state.cycle}-${Date.now()}`,

                route: {

                    routeId:
                        `route-${this.state.cycle}-${Date.now()}`,

                    execution: {

                        executionId:
                            `execution-${this.state.cycle}-${Date.now()}`,

                        signal: {

                            symbol:
                                strategy.symbol,

                            side:
                                decision.action,

                            quantity:

                                allocation.quantity ??
                                allocation.positionSize ??
                                allocation.units ??
                                0,

                            price:

                                signal.price ??
                                signal.marketData?.price

                        }

                    }

                }

            };

            if (
                typeof this.orderRouter
                    .routeTransportContract !==
                "function"
            ) {

                this.metrics.failedCycles++;

                return {

                    status:
                        "ORDER_ROUTER_INTERFACE_UNAVAILABLE",

                    approved: false,

                    decision,

                    allocation,

                    risk,

                    governance,

                    execution,

                    executionResult: null

                };

            }

            executionResult =
                await this.orderRouter
                    .routeTransportContract(
                        transportContract
                    );

        }

        // ---------------------------------------------
        // 11. FINAL APPROVAL
        // ---------------------------------------------

        const approved =

            execution.approved &&

            risk.approved &&

            governance.approved &&

            strategy.assetRoute !== null;

        this.state.lastSignal = signal;

        this.metrics.completedCycles++;

        this.state.lastCycleAt = Date.now();

        if (approved) {

            this.metrics.successfulCycles++;

        }

        // ---------------------------------------------
        // ORCHESTRATION COMPLETE EVENT
        // ---------------------------------------------

        if (this.eventHub?.emit) {

            this.eventHub.emit(

                "orchestrator:cycle:complete",

                {

                    cycle:
                        this.state.cycle,

                    approved,

                    mode:
                        this.mode,

                    timestamp:
                        Date.now(),

                    execution,

                    executionResult,

                    governance,

                    risk,

                    strategy,

                    summary: {

                        action:
                            decision.action,

                        confidence:
                            decision.confidence,

                        assetRoute:
                            strategy.assetRoute,

                        executionMode:
                            execution.mode

                    }

                }

            );

        }

        return {

            cycle:
                this.state.cycle,

            decision,

            allocation,

            risk,

            governance,

            strategy,

            logistics,

            correlation,

            connectivity,

            execution,

            executionResult,

            approved,

            systemMode:
                this.state.systemMode,

            timestamp:
                Date.now(),

            summary: {

                action:
                    decision.action,

                assetRoute:
                    strategy.assetRoute,

                executionMode:
                    execution.mode,

                confidence:
                    decision.confidence

            }

        };

    }

    // =====================================================
    // SECTION 3 — SYSTEM HEALTH & DIAGNOSTICS
    // =====================================================

    getSystemStatus() {

        return {

            mode:
                this.mode,

            systemMode:
                this.state.systemMode,

            uptime:
                Date.now() - this.startedAt,

            cycle:
                this.state.cycle,

            lastSignal:
                this.state.lastSignal,

            lastDecision:
                this.state.lastDecision,

            lastCycleAt:
                this.state.lastCycleAt,

            metrics: {

                ...this.metrics

            },

            connectivity:

                this.marketConnectivity?.getStatus?.()

                ?? null,

            orderRouter:

                this.orderRouter?.getOrderRouterStatus?.()

                ?? null,

            exchangeGateway:

                this.exchangeGateway?.getGatewayStatus?.()

                ?? null,

            governance:

                this.governanceGate?.status?.()

                ?? null,

            debug:

                this.debug

        };

    }

    isHealthy() {

        const routerHealthy =

            this.orderRouter

                ? this.orderRouter
                    .getOrderRouterStatus?.() !== null
                : true;

        const gatewayHealthy =

            this.exchangeGateway

                ? this.exchangeGateway
                    .getGatewayStatus?.() !== null
                : true;

        const governanceHealthy =

            this.governanceGate

                ? this.governanceGate
                    .status?.() !== null
                : true;

        return (

            routerHealthy &&

            gatewayHealthy &&

            governanceHealthy &&

            this.state.systemMode !== "LOCKDOWN"

        );

    }

    log(...args) {

        if (!this.debug) return;

        console.log(

            "[MetaSystemOrchestrator]",

            ...args

        );

    }

    // =====================================================
    // SECTION 4 — LIFECYCLE MANAGEMENT
    // =====================================================

    setMode(mode = "PAPER") {

        this.mode = mode;

        return this;

    }

    enableDebug() {

        this.debug = true;

        return this;

    }

    disableDebug() {

        this.debug = false;

        return this;

    }

    reset() {

        this.metrics = {

            completedCycles: 0,

            blockedCycles: 0,

            successfulCycles: 0,

            failedCycles: 0

        };

        this.state = {

            cycle: 0,

            lastSignal: null,

            lastDecision: null,

            lastCycleAt: null,

            systemMode: "ACTIVE"

        };

        this.startedAt = Date.now();

        return this;

    }

    destroy() {

        this.reset();

        this.metaBrain = null;

        this.portfolioEngine = null;

        this.capitalEngine = null;

        this.riskGovernor = null;

        this.strategyCoordinator = null;

        this.logisticsEngine = null;

        this.correlationEngine = null;

        this.executionOptimizer = null;

        this.orderRouter = null;

        this.marketConnectivity = null;

        this.exchangeGateway = null;

        this.governanceGate = null;

        this.eventHub = null;

        return this;

    }

}
             
