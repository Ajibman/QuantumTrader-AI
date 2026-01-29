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
