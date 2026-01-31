 // core/js/cpilot/cpilot_engine.js // STEP H — App‑ready integration of SimulationFeed // NOTE: This file OWNS simulation lifecycle. No external patches.

import { simulationFeed } from "../simulation/simulation_feed.js";

const CPilotEngine = { state: { running: false, timing: { unit: "seconds", value: 15 }, lastTick: null, subscribers: [] },

/* ============================= LIFECYCLE CONTROLS ============================= */

startSimulation(timing) { if (this.state.running) return;

if (timing) this.state.timing = timing;

simulationFeed.start(this.state.timing, (tick) => {
  this.state.lastTick = tick;
  this.dispatchTick(tick);
});

this.state.running = true;

},

stopSimulation() { simulationFeed.stop(); this.state.running = false; },

resetSimulation() { this.stopSimulation(); this.state.lastTick = null; },

/* ============================= OBSERVERS (UI / MONITORS) ============================= */

subscribe(fn) { if (typeof fn === "function") { this.state.subscribers.push(fn); } },

dispatchTick(tick) { this.state.subscribers.forEach(fn => fn(tick)); } };

export default CPilotEngine;
