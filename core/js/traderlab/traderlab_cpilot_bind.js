// core/js/traderlab/traderlab_cpilot_bind.js

import CPilotRunController from "../cpilot/cpilot_run_controller.js";
import { buildCPilotSignal } from "../cpilot/cpilot_entry.js";

/**
 * Binds TraderLab completion to CPilot activation.
 * Ensures CPilot only starts if qualification passed.
 */
const TraderLabCPilotBind = {
  /**
   * Wire the binding to UI buttons.
   */
  wire() {
    const enterBtn = document.querySelector(".card.primary button:first-of-type"); // TraderLab Enter
    const startCPilotBtn = document.getElementById("cpilot-start");
    const stopCPilotBtn  = document.getElementById("cpilot-stop");

    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        // Check qualification
        const signal = buildCPilotSignal();
        if (!signal) {
          alert("TraderLab qualification not passed. CPilot locked.");
          return;
        }

        // Arm CPilot with prepared signal
        CPilotRunController.arm(signal);

        // Enable CPilot start button
        if (startCPilotBtn) startCPilotBtn.disabled = false;

        alert("CPilot unlocked! You can start the automated simulation.");
        console.log("[TraderLabCPilotBind] CPilot unlocked for user");
      });
    }

    // Optional: wire stop button (safety)
    if (stopCPilotBtn) {
      stopCPilotBtn.addEventListener("click", () => {
        CPilotRunController.stop();
        console.log("[TraderLabCPilotBind] CPilot stopped via stop button");
      });
    }

    console.log("[TraderLabCPilotBind] Wiring complete");
  }
};

export default TraderLabCPilotBind;
