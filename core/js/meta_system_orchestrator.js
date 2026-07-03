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
 * • Exchange Gateway
 * • Live Execution Governance Gate
 * • Event Hub
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

    successfulCycles: 0

};

        this.state = {

            cycle: 0,

            lastSignal: null,

            lastDecision: null,

            systemMode: "ACTIVE"

        };

    }

    // =====================================================
    // SECTION 2 — MAIN ORCHESTRATION LOOP
    // =====================================================

    async run(signal, portfolio = {}) {

        this.state.cycle++;

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
            this.metaBrain?.evaluate?(signal);

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
        // 10. EXCHANGE EXECUTION
        // ---------------------------------------------

        let executionResult = null;

        if (

            this.mode === "LIVE" &&

            this.exchangeGateway

        ) {

            executionResult =
                await this.exchangeGateway.submitOrder({

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

                });

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

                    cycle: this.state.cycle,

                    approved,

                    mode: this.mode,

                    timestamp: Date.now()

                }

            );

        }

        return {

            cycle: this.state.cycle,

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

            systemMode: this.state.systemMode,

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
