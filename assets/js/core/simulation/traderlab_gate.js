// assets/js/core/simulation/traderlab_gate.js
// TraderLab Simulation Gate — controls sandbox access and simulation flow

import FederationRegistry from '../federation/registry.js';

const TraderLabGate = (() => {
  function admit(agent) {
    if (!agent || !agent.id) return false;
    // Only agents in registry can access simulation
    const registeredAgent = FederationRegistry.get(agent.id);
    return !!registeredAgent;
  }

  function runSimulation(agent, scenario) {
    if (!admit(agent)) throw new Error("Agent not admitted to TraderLab");
    // Placeholder for simulation execution
    return {
      agentId: agent.id,
      scenario,
      status: "simulated"
    };
  }

  return Object.freeze({
    admit,
    runSimulation
  });
})();

export default TraderLabGate;
