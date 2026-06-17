import { SwarmLayer } from "./stage14_swarm_layer.js";
import { EvolutionLayer } from "./stage15_evolution_layer.js";
import { RiskGovernor } from "./stage16_risk_governor.js";
import { ExecutionIntelligence } from "./stage17_execution_intelligence.js";
import { AwarenessLayer } from "./stage18a_awareness_layer.js";
import { CoordinationLayer } from "./stage18b_coordination_layer.js";
import { GovernanceLayer } from "./stage19_governance_layer.js";
import { ExecutionBridgeLayer } from "./stage20_execution_bridge_layer.js";

// ======================================================
// META BRAIN INTEGRATION MAPPER
// ======================================================

export function wireMetaBrain(metaBrain) {

  // =====================================================
  // STAGE 14 — SWARM
  // =====================================================

  metaBrain.swarm =
    new SwarmLayer();

  // =====================================================
  // STAGE 15 — EVOLUTION
  // =====================================================

  metaBrain.evolution =
    new EvolutionLayer();

  // =====================================================
  // STAGE 16 — RISK GOVERNOR
  // =====================================================

  metaBrain.riskGovernor =
    new RiskGovernor();

  // =====================================================
  // STAGE 17 — EXECUTION INTELLIGENCE
  // =====================================================

  metaBrain.executionIntelligence =
    new ExecutionIntelligence();

  // =====================================================
  // STAGE 18A — AWARENESS
  // =====================================================

  metaBrain.awareness =
    new AwarenessLayer();

  // =====================================================
  // STAGE 18B — COORDINATION
  // =====================================================

  metaBrain.coordination =
    new CoordinationLayer();

  // =====================================================
  // STAGE 19 — GOVERNANCE
  // =====================================================

  metaBrain.governance =
    new GovernanceLayer();

  // =====================================================
  // STAGE 20 — EXECUTION BRIDGE
  // =====================================================

  metaBrain.executionBridge =
    new ExecutionBridgeLayer({
      governance: metaBrain.governance,
      coordination: metaBrain.coordination,
      executionIntelligence: metaBrain.executionIntelligence
    });

  return metaBrain;
}
