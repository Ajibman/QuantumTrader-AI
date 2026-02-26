// assets/js/core/simulation/scenario_bus.js
// Scenario Bus — manages all simulation scenarios and dispatches them to TraderLab

import TraderLabGate from './traderlab_gate.js';

const ScenarioBus = (() => {
  const scenarios = new Map();

  function addScenario(id, data) {
    if (!id || !data) return false;
    scenarios.set(id, Object.freeze(data));
    return true;
  }

  function dispatch(agent, scenarioId) {
    const scenario = scenarios.get(scenarioId);
    if (!scenario) throw new Error("Scenario not found");
    return TraderLabGate.runSimulation(agent, scenario);
  }

  function listScenarios() {
    return Array.from(scenarios.entries());
  }

  return Object.freeze({
    addScenario,
    dispatch,
    listScenarios
  });
})();

export default ScenarioBus;
