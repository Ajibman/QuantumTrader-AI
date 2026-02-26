 // core/js/cpilot/cpilot_simulation_bind.js

import { CPilotEngine } from "./cpilot_engine.js";
import { simulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;

const CPilotSimulationBind = {
  /**
   * Start CPilot with a Full Signal Object.
   */
  start(signal) {
    if (!signal?.permission?.cpilotAllowed) {
      console.warn("[CPilotSimulationBind] CPilot not permitted by signal");
      return;
    }

    activeSignal = signal;

    // Load signal into engine
    CPilotEngine.loadSignal(signal);

    // Start engine
    CPilotEngine.start();

    // Start simulation feed for real-time tick handling
    simulationFeed.start(signal.timing, tick => {
      CPilotEngine.onTick(tick);
    });

    console.log("[CPilotSimulationBind] Started with signal:", signal);
  },

  /**
   * Stop CPilot execution safely.
   */
  stop() {
    if (!activeSignal) {
      console.warn("[CPilotSimulationBind] No active signal to stop");
      return;
    }

    simulationFeed.stop();
    CPilotEngine.stop();
    activeSignal = null;

    console.log("[CPilotSimulationBind] Stopped");
  }
};

export default CPilotSimulationBind;
