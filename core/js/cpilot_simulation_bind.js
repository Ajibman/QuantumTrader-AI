 // cpilot_simulation_bind.js

import { CPilotEngine } from "../cpilot/cpilot_engine.js";

const CPilotSimulationBind = {
  activeSignal: null,

  start(signal) {
    if (!signal) {
      console.warn("CPilotSimulationBind.start: No signal provided");
      return;
    }

    if (!signal.permission?.cpilotAllowed) {
      console.warn("CPilot not permitted for this signal");
      return;
    }

    this.activeSignal = signal;

    CPilotEngine.start({
      signal,
      mode: signal.mode,
      timing: signal.timing,
      context: signal.context
    });
  },

  stop() {
    if (!this.activeSignal) {
      console.warn("CPilotSimulationBind.stop: No active signal");
      return;
    }

    CPilotEngine.stop();
    this.activeSignal = null;
  }
};

export default CPilotSimulationBind;

// core/cpilot/cpilot_simulation_bind.js

import { CPilotEngine } from "./cpilot_engine.js";
import { simulationFeed } from "../simulation/simulation_feed.js";

let activeSignal = null;

const CPilotSimulationBind = {
  start(signal) {
    if (!signal?.permission?.cpilotAllowed) {
      console.warn("CPilot not permitted by signal");
      return;
    }

    activeSignal = signal;

    CPilotEngine.loadSignal(signal);
    CPilotEngine.start();

    simulationFeed.start(signal.timing, tick => {
      CPilotEngine.onMarketTick(tick);
    });
  },

  stop() {
    simulationFeed.stop();
    CPilotEngine.stop();
    activeSignal = null;
  }
};

export default CPilotSimulationBind;
