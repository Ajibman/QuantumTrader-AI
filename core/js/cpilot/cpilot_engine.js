 // core/js/cpilot/cpilot_engine.js
// STEP I — Meta-Brain Integrated Intelligence Layer

import { simulationFeed } from "../simulation/simulation_feed.js";
import { getBestStrategy } from "../strategy_memory.js";
import { getContextStrength } from "./cpilot_memory.js";
import { getMetaInfluence, recordMetaStrategyOutcome } from "../traderlab/meta_brain.js";
import eventHub from "../../brain/meta_brain/engines/event_hub.js";

/**
 * CPilot Engine
 *
 * Responsibilities:
 * - Own simulation lifecycle
 * - Analyze market context
 * - Evaluate strategy suitability
 * - Apply Meta-Brain influence
 * - Publish enriched intelligence ticks
 *
 * Does NOT:
 * - Execute trades
 * - Override TradingFloor authority
 */
const CPilotEngine = {

  state: {
    running: false,
    timing: { unit: "seconds", value: 15 },
    lastTick: null,
    subscribers: [],
    eventHubRegistered: false
  },

  /* =============================
     LIFECYCLE CONTROLS
  ============================= */

  startSimulation(timing) {

    if (this.state.running) return;

    if (timing) {
      this.state.timing = timing;
    }

    // Register CPilot with Event Hub once
    if (!this.state.eventHubRegistered) {

      eventHub.registerModule(
        "cpilot",
        {
          engine: "cpilot_engine"
        }
      );

      this.state.eventHubRegistered = true;
    }

    simulationFeed.start(
      this.state.timing,
      (tick) => {

        this.state.lastTick = tick;

        const enriched =
          this.analyzeTick(tick);

        this.dispatchTick(enriched);

        // Publish intelligence stream
        eventHub.emit({
          type: "cpilot:intelligence",
          source: "cpilot",
          target: "meta_brain",
          priority: "normal",
          payload: enriched
        });

        // =============================
        // META-BRAIN FEEDBACK LOOP
        // =============================
        recordMetaStrategyOutcome({
          strategyName:
            enriched?.intelligence?.strategy?.name ||
            "default",

          pnl:
            enriched?.intelligence?.pnl || 0,

          context:
            enriched?.intelligence?.context || "unknown"
        });

      }
    );

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

  /* =============================
     INTELLIGENCE LAYER
  ============================= */

  analyzeTick(tick) {

    const marketData = {
      price: tick.price,
      volume: tick.volume,
      volatility: this.estimateVolatility(tick)
    };

    const context =
      getContextStrength(marketData);

    const strategy =
      getBestStrategy(marketData);

    const influence =
      getMetaInfluence();

    /**
     * Meta-Brain adjusted signal
     */
    const combinedSignal =
      (
        (strategy?.bestStrategy?.score || 1) *
        (context?.weight || 1)
      ) / influence.cpilotSensitivity;

    /**
     * CPilot recommendation
     */
    const hold =
      marketData.volatility < 0.20 ||
      marketData.volatility > 0.85 ||
      combinedSignal < 0.90;

    const suggestion =
      hold ? "HOLD" : "ALLOW";

    /**
     * Confidence adapts to Meta-Brain
     */
    const confidence = hold
      ? 0.4 / influence.cpilotSensitivity
      : 0.7 * (2 - influence.cpilotSensitivity);

    // Publish signal to Meta-Brain
    eventHub.emit({
      type: "trade:signal",
      source: "cpilot",
      target: "meta_brain",
      priority: hold ? "normal" : "high",
      payload: {
        suggestion,
        confidence,
        context: context.context,
        contextWeight: context.weight,
        strategy:
          strategy?.bestStrategy || null,
        combinedSignal,
        volatility: marketData.volatility
      }
    });

    return {

      ...tick,

      intelligence: {

        suggestion,
        decision: suggestion,
        hold,
        confidence,

        context: context.context,
        contextWeight: context.weight,

        strategy:
          strategy?.bestStrategy || null,

        combinedSignal,

        volatility: marketData.volatility,

        metaInfluence: {
          riskBias: influence.riskBias,
          explorationRate: influence.explorationRate,
          cpilotSensitivity: influence.cpilotSensitivity
        }
      }
    };
  },

  /**
   * Lightweight volatility estimator
   */
  estimateVolatility(tick) {

    return Math.min(
      1,
      Math.abs((tick.price % 10) / 10)
    );
  },

  /* =============================
     OBSERVERS
  ============================= */

  subscribe(fn) {

    if (typeof fn === "function") {
      this.state.subscribers.push(fn);
    }
  },

  unsubscribe(fn) {

    this.state.subscribers =
      this.state.subscribers.filter(
        sub => sub !== fn
      );
  },

  dispatchTick(tick) {

    this.state.subscribers.forEach(
      fn => fn(tick)
    );
  }

};

/**
 * ==========================================
 * APPLICATION BOOTSTRAP
 * ==========================================
 * Initializes the CPilot engine for the
 * application startup lifecycle.
 */
export async function initializeCPilot() {

  if (CPilotEngine.state.running) {
    return CPilotEngine;
  }

  CPilotEngine.startSimulation();

  return CPilotEngine;
}

export default CPilotEngine;
