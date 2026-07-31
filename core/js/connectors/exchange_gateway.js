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
// The Orchestrator does NOT construct the
// Transport Contract.
//
// Execution responsibility remains:
//
// Execution Optimizer
//        ↓
// Order Router
//        ↓
// Transport Contract
//        ↓
// Exchange Gateway
//
// The Order Router is the single authoritative
// boundary responsible for constructing,
// validating, and routing the Transport Contract.
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

    // -----------------------------------------
    // Execution Intent
    // -----------------------------------------
    //
    // The Orchestrator supplies execution intent
    // only. It does NOT manufacture transport IDs,
    // route IDs, execution IDs, or the Transport
    // Contract itself.
    //
    // The established Order Router remains the
    // authoritative transport-contract boundary.
    // -----------------------------------------

    const executionIntent = {

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

        },

        strategy,

        decision,

        allocation,

        risk,

        governance,

        execution,

        mode:
            this.mode

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
                executionIntent
            );

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
             
