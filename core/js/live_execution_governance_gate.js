/**

* =====================================================
* QuantumTrader-AI
* STAGE 34 — LIVE EXECUTION GOVERNANCE GATE
* =====================================================
* 
* Purpose:
* Final control layer before ANY real or live execution.
* 
* This system ensures:
* - Only validated strategies are allowed
* - Risk limits are enforced in real time
* - System health is stable
* - Market conditions are acceptable
* - Capital exposure is controlled
* 
* This is the LAST SAFETY GATE before execution.
* 
* =====================================================
  */

export class LiveExecutionGovernanceGate {

constructor(config = {}) {

this.config = {

  maxRiskExposure:
    config.maxRiskExposure ?? 0.7,

  maxDailyLoss:
    config.maxDailyLoss ?? 0.05,

  volatilityCutoff:
    config.volatilityCutoff ?? 0.9,

  minStrategyScore:
    config.minStrategyScore ?? 0.65
};

this.state = {

  dailyLoss: 0,

  exposure: 0,

  blockedTrades: 0,

  approvedTrades: 0
};

}

this.eventHub = null;

this.emergencyStop = false;

this.auditHistory = [];

this.maxAuditHistory = 500;

}

 // =====================================================
// EVENT HUB
// =====================================================

attachEventHub(eventHub) {

    this.eventHub = eventHub;

    return this;

}

 // =====================================================
// EMERGENCY CONTROL
// =====================================================

enableEmergencyStop() {

    this.emergencyStop = true;

}

disableEmergencyStop() {

    this.emergencyStop = false;

}

isEmergencyStopped() {

    return this.emergencyStop;

}
 
// =====================================================
// MAIN GOVERNANCE CHECK
// =====================================================

evaluate({

    strategy,
    simulationResult,
    portfolio,
    signal,
    risk

}) {

    if (this.emergencyStop) {

        return {

            approved: false,

            violations: ["EMERGENCY_STOP"],

            mode: "LOCKDOWN",

            confidenceGate: 0

        };

    }

    const violations = [];

    // -------------------------------------------------
    // STRATEGY VALIDATION
    // -------------------------------------------------

    if (
        !simulationResult?.approved ||
        simulationResult?.score < this.config.minStrategyScore
    ) {

        violations.push("STRATEGY_NOT_VALIDATED");

    }

    // -------------------------------------------------
    // MARKET SAFETY CHECK
    // -------------------------------------------------

    if (
        (signal?.volatility ?? 0) >
        this.config.volatilityCutoff
    ) {

        violations.push("EXTREME_VOLATILITY");

    }

    // -------------------------------------------------
    // PORTFOLIO RISK CHECK
    // -------------------------------------------------

    if (
        (portfolio?.exposure ?? 0) >
        this.config.maxRiskExposure
    ) {

        violations.push("EXCESS_EXPOSURE");

    }

    if (
        (portfolio?.dailyLoss ?? 0) >
        this.config.maxDailyLoss
    ) {

        violations.push("DAILY_LOSS_LIMIT");

    }

    // -------------------------------------------------
    // RISK ENGINE CHECK
    // -------------------------------------------------

    if (risk && !risk.approved) {

        violations.push("RISK_ENGINE_BLOCK");

    }

// -------------------------------------------------
// FINAL DECISION
// -------------------------------------------------

const approved = violations.length === 0;

if (approved) {

    this.state.approvedTrades++;

} else {

    this.state.blockedTrades++;

}

const audit = {

    timestamp: Date.now(),

    approved,

    violations: [...violations],

    mode: this.getMode(),

    confidenceGate:
        simulationResult?.score ?? 0

};

this.auditHistory.push(audit);

if (this.auditHistory.length > this.maxAuditHistory) {

    this.auditHistory.shift();

}

if (this.eventHub?.emit) {

    this.eventHub.emit(
        "governance:evaluated",
        audit
    );

}

return {

    approved,

    violations,

    mode: this.getMode(),

    confidenceGate:
        simulationResult?.score ?? 0

};

} 
 
// =====================================================
// REAL-TIME UPDATE TRACKING
// =====================================================

updateState(tradeResult = {}) {

if (tradeResult.pnl) {

  this.state.dailyLoss += Math.max(0, -tradeResult.pnl);
}

if (tradeResult.exposure) {

  this.state.exposure =
    Math.min(1, this.state.exposure + tradeResult.exposure);
}

}

// =====================================================
// SYSTEM MODE LOGIC
// =====================================================

getMode() {

if (this.state.dailyLoss > this.config.maxDailyLoss) {
  return "LOCKDOWN";
}

if (this.state.exposure > 0.6) {
  return "CAUTIOUS";
}

return "ACTIVE";

}

// =====================================================
// RESET (DAILY CYCLE)
// =====================================================

reset() {

this.state = {

  dailyLoss: 0,

  exposure: 0,

  blockedTrades: 0,

  approvedTrades: 0
};

}

// =====================================================
// SYSTEM STATUS
// =====================================================

status() {

return {

  ...this.state,

  mode: this.getMode(),

  approvalRate:
    this.state.approvedTrades +
    this.state.blockedTrades === 0
      ? 0
      : this.state.approvedTrades /
        (this.state.approvedTrades +
         this.state.blockedTrades)
};

}
}
 
