// core/js/cpilot/cpilot_run_controller.js

import CPilotSimulationBind from "./cpilot_simulation_bind.js";

let activeSignal = null;

export function armCPilot(signal) {
  if (!signal) {
    throw new Error("No CPilot signal prepared");
  }

  activeSignal = signal;
}

export function startCPilot() {
  if (!activeSignal) {
    throw new Error("CPilot not armed with a signal");
  }

  CPilotSimulationBind.start(activeSignal);
  setRunningState(true);
}

export function stopCPilot() {
  CPilotSimulationBind.stop();
  setRunningState(false);
}

function setRunningState(isRunning) {
  const startBtn = document.getElementById("cpilot-start");
  const stopBtn = document.getElementById("cpilot-stop");

  startBtn.disabled = isRunning;
  stopBtn.disabled = !isRunning;
}
