// System Integration Audit Layer — Architecture Integrity Guard

import { getTradingFloorStatus } from "./traderlab_run_controller.js";
import { getMetaBrainStatus } from "./meta_brain.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "../cpilot/cpilot_memory.js";
import { listSessions } from "./traderlab_orchestrator.js";

/**
 * FULL SYSTEM HEALTH CHECK
 */
export function runSystemAudit() {

  const audit = {
    timestamp: Date.now(),

    tradingFloor: safe(() => getTradingFloorStatus()),
    metaBrain: safe(() => getMetaBrainStatus()),
    strategyMemory: safe(() => getStrategyMemory()),
    cpilotMemory: safe(() => getMemorySnapshot()),
    sessions: safe(() => listSessions()),

    health: {
      status: "unknown",
      warnings: [],
      score: 100
    }
  };

  /**
   * BASIC HEALTH RULES
   */

  if (!audit.tradingFloor?.running && audit.sessions?.length > 0) {
    audit.health.warnings.push("Sessions exist but TradingFloor is not running");
    audit.health.score -= 10;
  }

  if (audit.cpilotMemory?.totalCycles === 0) {
    audit.health.warnings.push("No CPilot cycle data detected");
    audit.health.score -= 20;
  }

  if (audit.strategyMemory?.totalRecords === 0) {
    audit.health.warnings.push("No strategy learning records detected");
    audit.health.score -= 20;
  }

  if (audit.metaBrain?.historyLength === 0) {
    audit.health.warnings.push("Meta-Brain has no evolution history");
    audit.health.score -= 10;
  }

  /**
   * FINAL STATUS
   */
  if (audit.health.score >= 80) {
    audit.health.status = "healthy";
  } else if (audit.health.score >= 50) {
    audit.health.status = "degraded";
  } else {
    audit.health.status = "critical";
  }

  return audit;
}

/**
 * SAFE EXECUTOR
 */
function safe(fn) {
  try {
    return fn();
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
}

/**
 * QUICK DEBUG PRINT
 */
export function printSystemAudit() {
  const report = runSystemAudit();
  console.log("SYSTEM AUDIT:", JSON.stringify(report, null, 2));
  return report;
}
