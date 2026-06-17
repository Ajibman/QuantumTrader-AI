export class ExecutionBridgeLayer {

  constructor({
    governance,
    coordination,
    executionIntelligence
  }) {

    this.governance = governance;
    this.coordination = coordination;
    this.executionIntelligence = executionIntelligence;

    this.metrics = {
      routed: 0,
      blocked: 0,
      approved: 0
    };

    this.history = [];
  }

  // =====================================================
  // MAIN PIPELINE
  // =====================================================

  process({
    signal,
    decision,
    swarm,
    risk,
    evolution,
    awareness
  }) {

    this.metrics.routed++;

    // --------------------------------------------------
    // COORDINATION SNAPSHOT
    // --------------------------------------------------

    const coordination =
      this.coordination.coordinate({
        swarm,
        evolution,
        risk,
        awareness
      });

    // --------------------------------------------------
    // EXECUTION STRATEGY GENERATION
    // --------------------------------------------------

    const executionPlan =
      this.executionIntelligence.build({
        signal,
        decision,
        risk,
        swarm
      });

    // --------------------------------------------------
    // GOVERNANCE VALIDATION (FINAL AUTHORITY)
    // --------------------------------------------------

    const governance =
      this.governance.validate({
        signal,
        decision,
        risk,
        execution: executionPlan,
        coordination,
        awareness
      });

    // --------------------------------------------------
    // BLOCKING DECISION
    // --------------------------------------------------

    if (!governance.allowed) {

      this.metrics.blocked++;

      const blockedOutput = {
        approved: false,

        reason:
          governance.violations?.join(", ") ||
          "GOVERNANCE_BLOCK",

        governance,
        coordination,
        execution: null
      };

      this.history.push(blockedOutput);

      return blockedOutput;
    }

    // --------------------------------------------------
    // FINAL EXECUTION PACKAGE
    // --------------------------------------------------

    const executionPackage = {
      mode: executionPlan.mode,
      size: executionPlan.size,
      urgency: executionPlan.urgency,
      routing: executionPlan.routing,
      liquidityPreference: executionPlan.liquidityPreference
    };

    this.metrics.approved++;

    const output = {
      approved: true,

      governance,
      coordination,

      execution: executionPackage
    };

    this.history.push(output);

    return output;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    return {
      ...this.metrics,

      approvalRate:
        this.metrics.routed === 0
          ? 0
          : this.metrics.approved / this.metrics.routed,

      blockRate:
        this.metrics.routed === 0
          ? 0
          : this.metrics.blocked / this.metrics.routed
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {

    this.metrics = {
      routed: 0,
      blocked: 0,
      approved: 0
    };

    this.history = [];
  }
  }
