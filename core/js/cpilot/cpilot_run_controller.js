 // core/js/cpilot/cpilot_run_controller.js

import CPilotSimulationBind from "./cpilot_simulation_bind.js";

/**
 * Active Full Signal Object.
 * Must be set via explicit arming.
 */
let activeSignal = null;

const CPilotRunController = {
  /**
   * Explicitly arm CPilot with a Full Signal Object.
   * @param {object} signal - Full Signal Object
   */
  arm(signal) {
    if (!signal) {
      throw new Error("[CPilotRunController] No CPilot signal provided");
    }
    activeSignal = signal;
    console.log("[CPilotRunController] CPilot armed:", signal);
  },

  /**
   * Start CPilot execution.
   * Will only run if previously armed.
   */
  start() {
    if (!activeSignal) {
      throw new Error("[CPilotRunController] CPilot not armed with a signal");
    }

    CPilotSimulationBind.start(activeSignal);
    this._setRunningState(true);

    console.log("[CPilotRunController] CPilot started");
  },

  /**
   * Stop CPilot execution safely.
   */
  stop() {
    CPilotSimulationBind.stop();
    activeSignal = null;
    this._setRunningState(false);

    console.log("[CPilotRunController] CPilot stopped");
  },

  /**
   * Reflect running state in UI buttons.
   */
  _setRunningState(isRunning) {
    const startBtn = document.getElementById("cpilot-start");
    const stopBtn = document.getElementById("cpilot-stop");

    if (startBtn) startBtn.disabled = isRunning;
    if (stopBtn) stopBtn.disabled = !isRunning;
  }
};

export default CPilotRunController;
