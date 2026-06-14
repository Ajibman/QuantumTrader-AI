 export function runFullSimulation(getContext = () => ({})) {
  simulationState.running = true;

  const results = [];

  while (simulationState.pointer < simulationState.dataset.length) {
    results.push(runSimulationStep(getContext));
  }

  simulationState.running = false;

  console.log("[Simulation] completed:", results.length);

  return results;
 }
