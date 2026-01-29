 // traderlab_controller.js

import TraderLabCPilotBind from "./traderlab_cpilot_bind.js";
import CPilotSimulationBind from "./cpilot_simulation_bind.js";
import { createFullSignal } from "../signal/full_signal.js";

/* --------------------------------------------------
   Bootstrapping
-------------------------------------------------- */

TraderLabCPilotBind.wire();

/* --------------------------------------------------
   Full Signal (Simulation Scope)
-------------------------------------------------- */

const signal = createFullSignal({
  permission: { cpilotAllowed: true },
  context: {},
  timing: {
    value: 15,
    unit: "seconds",
    label: "15 Seconds"
  },
  mode: "auto"
});

/* --------------------------------------------------
   UI → Simulation Wiring
-------------------------------------------------- */

document
  .getElementById("cpilot-start")
  ?.addEventListener("click", () => {
    CPilotSimulationBind.start(signal);
  });

document
  .getElementById("cpilot-stop")
  ?.addEventListener("click", () => {
    CPilotSimulationBind.stop();
    saveSimulationSession(signal);
  });

/* --------------------------------------------------
   Session Persistence
-------------------------------------------------- */

function saveSimulationSession(signal) {
  const session = {
    endedAt: new Date().toISOString(),
    timing: signal.timing,
    mode: signal.mode,
    environment: signal.meta?.environment || "simulation"
  };

  localStorage.setItem(
    "lastSimulationSession",
    JSON.stringify(session)
  );
}
