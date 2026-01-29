import TraderLabCPilotBind from './traderlab_cpilot_bind.js';
import CPilotSimulationBind from './cpilot_simulation_bind.js';

TraderLabCPilotBind.wire();

document
  .getElementById('cpilot-start')
  ?.addEventListener('click', () => {
    CPilotSimulationBind.start();
  });

document
  .getElementById('cpilot-stop')
  ?.addEventListener('click', () => {
    CPilotSimulationBind.stop();
  });

import { createFullSignal } from "../signal/full_signal.js";  
import { CPilotEngine } from "../cpilot/cpilot_engine.js";  
  
const signal = createFullSignal({  
  permission: { cpilotAllowed: true },  
  context: {},  
  timing: { value: 15, unit: "seconds", label: "15 Seconds" },  
  mode: "auto"  
});  
  
function saveSimulationSession(signal) {
  const session = {
    endedAt: new Date().toISOString(),
    timing: signal.timing.takeProfit,
    mode: signal.execution.mode,
    environment: signal.meta.environment
  };

  localStorage.setItem("lastSimulationSession", JSON.stringify(session));
}
