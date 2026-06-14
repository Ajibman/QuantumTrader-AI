// core/autotrader/autoTrader.js

import { metaBrain } from "../brain/meta_brain.js";
import { runExecution } from "../executionSim.js"; // or your live execution layer

let intervalId = null;

const state = {
  running: false,
  cycleCount: 0,
  lastSignal: null,
  lastDecision: null
};
