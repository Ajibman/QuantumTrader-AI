// core/js/cpilot/cpilot_ui_bind.js

import TraderLabCPilotBind from "../traderlab/traderlab_cpilot_bind.js";
import CPilotRunController from "./cpilot_run_controller.js";

/**
 * Wire CPilot UI buttons to the Run Controller
 * Ensures start/stop operations go through the proper boundaries
 */
const CPilotUIBind = {
  wire() {
    const startBtn = document.getElementById("cpilot-start");
    const stopBtn  = document.getElementById("cpilot-stop");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        try {
          CPilotRunController.start();
        } catch (err) {
          console.error("[CPilotUIBind] Start failed:", err.message);
          alert(err.message);
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        CPilotRunController.stop();
      });
    }

    // Wire TraderLab → CPilot binding
    TraderLabCPilotBind.wire();

    console.log("[CPilotUIBind] UI wiring complete");
  }
};

export default CPilotUIBind;
