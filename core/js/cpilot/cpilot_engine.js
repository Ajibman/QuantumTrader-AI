 // core/js/cpilot/cpilot_engine.js
// STEP H — App-ready integration of SimulationFeed + Intelligence Layer

import { simulationFeed } from "../simulation/simulation_feed.js";
import { getBestStrategy } from "../strategy_memory.js";
import { getContextStrength } from "./cpilot_memory.js";

/**
 * CPilot Engine
 * Owns simulation lifecycle + intelligence evaluation
 */
const CPilotEngine = {
  state: {
    running: false,
    timing: { unit: "seconds", value: 15 },
    lastTick: null,
    subscribers: []
  },

  /* ============================= LIFECYCLE CONTROLS ============================= */

  startSimulation(timing) {
    if (this.state.running) return;

    if (timing) {
      this.state.timing = timing;
    }

    simulationFeed.start(this.state.timing, (tick) => {
      this.state.lastTick = tick;

      // enrich tick with intelligence layer
      const enriched = this.analyzeTick(tick);

      this.dispatchTick(enriched);
    });

    this.state.running = true;
  },

  stopSimulation() {
    simulationFeed.stop();
    this.state.running = false;
  },

  resetSimulation() {
    this.stopSimulation();
    this.state.lastTick = null;
  },

  /* ============================= INTELLIGENCE LAYER ============================= */

  analyzeTick(tick) {
    const marketData = {
      price: tick.price,
      volume: tick.volume,
      volatility: this.estimateVolatility(tick)
    };

    const context = getContextStrength(marketData);
    const strategy = getBestStrategy(marketData);

    const combinedSignal =
      (strategy?.bestStrategy?.score || 1) *
      (context?.weight || 1);

    const hold =
      marketData.volatility < 0.2 ||
      marketData.volatility > 0.85 ||
      combinedSignal < 0.9;

    return {
      ...tick,
      intelligence: {
        hold,
        decision: hold ? "HOLD" : "ALLOW",
        context: context.context,
        contextWeight: context.weight,
        strategy: strategy.bestStrategy,
        combinedSignal,
        confidence: hold ? 0.4 : 0.7
      }
    };
  },

  estimateVolatility(tick) {
    // lightweight synthetic volatility estimate
    return Math.min(1, Math.abs((tick.price % 10) / 10));
  },

  /* ============================= OBSERVERS ============================= */

  subscribe(fn) {
    if (typeof fn === "function") {
      this.state.subscribers.push(fn);
    }
  },

  dispatchTick(tick) {
    this.state.subscribers.forEach(fn => fn(tick));
  }
};

export default CPilotEngine;
