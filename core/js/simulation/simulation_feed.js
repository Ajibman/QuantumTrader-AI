// ======================================================
// QuantumTrader-AI
// PRODUCTION SIMULATION ENGINE
// SECTION 1 — STATE + PUBLIC API
// ======================================================

/**
 * Simulation Engine
 *
 * Responsibilities
 * ----------------
 * • Stream market ticks to CPilot
 * • Execute full dataset simulations
 * • Support TraderLab backtesting
 * • Provide runtime lifecycle control
 * * Remaining implementation is completed
 * in Sections 2–4.
 */

const simulationState = {

  running: false,

  paused: false,

  timer: null,

  pointer: 0,

  timing: {
    unit: "seconds",
    value: 15
  },

  dataset: [],

  subscribers: [],

  statistics: {

    ticksProcessed: 0,

    startedAt: null,

    stoppedAt: null
  }

};

/**
 * ======================================================
 * PUBLIC SIMULATION API
 * ======================================================
 */

export const simulationFeed = {

  /**
   * Starts streaming simulation.
   * (Implementation added in Section 2)
   */
  start(timing, callback) {
    // Section 2
  },

  /**
   * Stops streaming simulation.
   * (Implementation added in Section 2)
   */
  stop() {
    // Section 2
  },

  /**
   * Reset simulation state.
   * (Implementation added in Section 2)
   */
  reset() {
    // Section 2
  },

  /**
   * Returns current engine state.
   */
  getState() {

    return simulationState;

  }

};

// ======================================================
// SECTION 2 — SIMULATION LIFECYCLE
// ======================================================

/**
 * Register simulation dataset.
 */
export function setSimulationDataset(dataset = []) {

  simulationState.dataset =
    Array.isArray(dataset) ? dataset : [];

  simulationState.pointer = 0;
}

/**
 * Subscribe to simulation ticks.
 */
export function subscribeSimulation(callback) {

  if (typeof callback !== "function") {
    return;
  }

  simulationState.subscribers.push(callback);
}

/**
 * Remove subscriber.
 */
export function unsubscribeSimulation(callback) {

  simulationState.subscribers =
    simulationState.subscribers.filter(
      fn => fn !== callback
    );
}

/**
 * Internal publisher.
 */
function publishTick(tick) {

  simulationState.subscribers.forEach(fn => {

    try {
      fn(tick);
    } catch (error) {
      console.error(
        "[Simulation] Subscriber Error",
        error
      );
    }

  });

}

/**
 * ======================================================
 * IMPLEMENT PUBLIC API
 * ======================================================
 */

simulationFeed.start = function (
  timing = simulationState.timing,
  callback = null
) {

  if (simulationState.running) {
    return;
  }

  simulationState.running = true;
  simulationState.paused = false;

  simulationState.statistics.startedAt =
    Date.now();

  simulationState.timing = timing;

  if (typeof callback === "function") {
    subscribeSimulation(callback);
  }

  simulationState.timer = setInterval(() => {

    if (simulationState.paused) {
      return;
    }

    if (
      simulationState.pointer >=
      simulationState.dataset.length
    ) {

      simulationFeed.stop();
      return;
    }

    const tick =
      runSimulationStep();

    if (tick) {

      simulationState.statistics.ticksProcessed++;

      publishTick(tick);
    }

  }, timing.value * 1000);

};

simulationFeed.stop = function () {

  if (simulationState.timer) {

    clearInterval(simulationState.timer);

    simulationState.timer = null;
  }

  simulationState.running = false;

  simulationState.paused = false;

  simulationState.statistics.stoppedAt =
    Date.now();

};

simulationFeed.reset = function () {

  simulationFeed.stop();

  simulationState.pointer = 0;

  simulationState.statistics.ticksProcessed = 0;

};

// ======================================================
// SECTION 3 — TICK PROCESSING ENGINE
// ======================================================

/**
 * Generates one simulation tick.
 *
 * Returns:
 *  - tick object
 *  - null when dataset is exhausted
 */
export function runSimulationStep(getContext = () => ({})) {

  if (
    simulationState.pointer >=
    simulationState.dataset.length
  ) {
    return null;
  }

  const rawTick =
    simulationState.dataset[
      simulationState.pointer++
    ];

  const context =
    getContext(rawTick) || {};

  const tick = {

    timestamp:
      rawTick.timestamp ?? Date.now(),

    symbol:
      rawTick.symbol ?? "SIM",

    assetClass:
      rawTick.assetClass ?? "EQUITY",

    price:
      Number(rawTick.price ?? 0),

    volume:
      Number(rawTick.volume ?? 0),

    bid:
      Number(rawTick.bid ?? rawTick.price ?? 0),

    ask:
      Number(rawTick.ask ?? rawTick.price ?? 0),

    spread:
      Number(
        rawTick.spread ??
        Math.abs(
          (rawTick.ask ?? rawTick.price ?? 0) -
          (rawTick.bid ?? rawTick.price ?? 0)
        )
      ),

    marketData:
      rawTick.marketData ?? {},

    simulation: {

      index:
        simulationState.pointer - 1,

      remaining:
        simulationState.dataset.length -
        simulationState.pointer,

      total:
        simulationState.dataset.length

    },

    context

  };

  return tick;

}

// ======================================================
// SECTION 4 — FULL SIMULATION + UTILITIES
// ======================================================

/**
 * Executes the complete simulation dataset.
 * Primarily used for TraderLab backtesting.
 */
export function runFullSimulation(
  getContext = () => ({})
) {

  simulationState.running = true;

  simulationState.statistics.startedAt =
    Date.now();

  const results = [];

  while (
    simulationState.pointer <
    simulationState.dataset.length
  ) {

    const tick =
      runSimulationStep(getContext);

    if (!tick) {
      break;
    }

    simulationState.statistics.ticksProcessed++;

    publishTick(tick);

    results.push(tick);

  }

  simulationState.running = false;

  simulationState.statistics.stoppedAt =
    Date.now();

  console.log(
    "[Simulation] Completed:",
    results.length,
    "ticks"
  );

  return results;

}

/**
 * ======================================================
 * DATASET UTILITIES
 * ======================================================
 */

/**
 * Loads a new simulation dataset.
 */
export function loadSimulationDataset(
  dataset = []
) {

  simulationState.dataset =
    Array.isArray(dataset)
      ? dataset
      : [];

  simulationState.pointer = 0;

  simulationState.statistics.ticksProcessed = 0;

  return simulationState.dataset.length;

}

/**
 * Append additional market data.
 */
export function appendSimulationDataset(
  dataset = []
) {

  if (!Array.isArray(dataset)) {
    return simulationState.dataset.length;
  }

  simulationState.dataset.push(...dataset);

  return simulationState.dataset.length;

}

/**
 * Simulation statistics.
 */
export function getSimulationStatistics() {

  return {

    running:
      simulationState.running,

    paused:
      simulationState.paused,

    datasetSize:
      simulationState.dataset.length,

    pointer:
      simulationState.pointer,

    ticksProcessed:
      simulationState.statistics.ticksProcessed,

    startedAt:
      simulationState.statistics.startedAt,

    stoppedAt:
      simulationState.statistics.stoppedAt

  };

}
