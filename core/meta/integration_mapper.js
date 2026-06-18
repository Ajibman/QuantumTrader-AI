// =====================================================
// INTEGRATION MAPPER
// META BRAIN → MARKET ACCESS GATEWAY
// =====================================================

export class IntegrationMapper {

  constructor({
    assetResolver,
    venueRegistry,
    routingEngine,
    liquidityScanner,
    executionAdapter
  }) {

    this.assetResolver = assetResolver;
    this.venueRegistry = venueRegistry;
    this.routingEngine = routingEngine;
    this.liquidityScanner = liquidityScanner;
    this.executionAdapter = executionAdapter;

    this.metrics = {
      processed: 0,
      blocked: 0,
      executed: 0
    };
  }

  // =====================================================
  // MAIN PIPELINE
  // =====================================================

  process({
    signal,
    decision,
    order = {}
  }) {

    this.metrics.processed++;

    // -----------------------------------------------------
    // STEP 1: ROUTING
    // -----------------------------------------------------

    const route =
      this.routingEngine.route({
        symbol: signal.symbol,
        urgency: order.urgency,
        risk: order.risk
      });

    if (!route.success) {

      this.metrics.blocked++;

      return {
        success: false,
        stage: "ROUTING",
        reason: route.reason
      };
    }

    // -----------------------------------------------------
    // STEP 2: LIQUIDITY CHECK
    // -----------------------------------------------------

    const liquidity =
      this.liquidityScanner.scan({
        asset: route.asset,
        route,
        order
      });

    if (!liquidity.approved) {

      this.metrics.blocked++;

      return {
        success: false,
        stage: "LIQUIDITY",
        reason: liquidity.reason,
        liquidity
      };
    }

    // -----------------------------------------------------
    // STEP 3: EXECUTION ADAPTATION
    // -----------------------------------------------------

    const execution =
      this.executionAdapter.adapt({
        signal,
        decision,
        route,
        liquidity,
        order
      });

    if (!execution.success) {

      this.metrics.blocked++;

      return {
        success: false,
        stage: "EXECUTION",
        reason: execution.reason,
        execution
      };
    }

    // -----------------------------------------------------
    // SUCCESS PATH
    // -----------------------------------------------------

    this.metrics.executed++;

    return {
      success: true,

      signal,
      decision,

      route,
      liquidity,

      execution
    };
  }

  // =====================================================
  // HEALTH / METRICS
  // =====================================================

  getMetrics() {

    const total =
      this.metrics.processed;

    return {
      ...this.metrics,

      successRate:
        total === 0
          ? 0
          : this.metrics.executed / total
    };
  }

  resetMetrics() {

    this.metrics = {
      processed: 0,
      blocked: 0,
      executed: 0
    };
  }
}
