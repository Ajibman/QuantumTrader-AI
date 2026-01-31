 // core/js/cpilot/cpilot_controller.js
// CPilot — Run / Stop + Lock / Unlock (App-ready)

import { prepareCPilotSignal } from "./cpilot_signal_builder.js";
import { armCPilot, startCPilot, stopCPilot } from "./cpilot_run_controller.js";

const CPilotController = (() => {

  const ui = {
    startBtn: document.getElementById("cpilot-start"),
    stopBtn: document.getElementById("cpilot-stop"),
    tpInputs: document.querySelectorAll('input[name="tp-time"], select#tp-timing'),
    status: document.getElementById("signal-status")
  };

  function lockTiming(lock) {
    ui.tpInputs.forEach(el => {
      if (el) el.disabled = lock;
    });
  }

  function setIdleState() {
    if (ui.startBtn) ui.startBtn.disabled = false;
    if (ui.stopBtn) ui.stopBtn.disabled = true;
    lockTiming(false);
  }

  function setRunningState() {
    if (ui.startBtn) ui.startBtn.disabled = true;
    if (ui.stopBtn) ui.stopBtn.disabled = false;
    lockTiming(true);
  }

  function prepareAndArm() {
    const signal = prepareCPilotSignal();

    if (!signal) {
      throw new Error("CPilot signal could not be prepared");
    }

    armCPilot(signal);
    return signal;
  }

  function bind() {
    if (!ui.startBtn || !ui.stopBtn) {
      console.warn("[CPilot] Control buttons not found");
      return;
    }

    ui.startBtn.addEventListener("click", () => {
      try {
        prepareAndArm();
        startCPilot();
        setRunningState();
        if (ui.status) ui.status.textContent = "CPilot running (simulation)";
      } catch (err) {
        alert(err.message);
      }
    });

    ui.stopBtn.addEventListener("click", () => {
      stopCPilot();
      setIdleState();
      if (ui.status) ui.status.textContent = "CPilot stopped";
    });

    // initial truth
    setIdleState();
  }

  return Object.freeze({
    bind
  });

})();

export default CPilotController;
