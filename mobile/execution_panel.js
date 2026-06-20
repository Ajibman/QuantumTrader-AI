// mobile/ui/execution_panel.js

import { on, emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * Execution Panel
 *
 * Responsibilities:
 * - Display execution opportunities
 * - Monitor order lifecycle
 * - Present CPilot recommendations
 * - Track execution outcomes
 * - Support manual and automatic modes
 */

const executionState = {

  latestDecision: null,

  pendingOrders: [],

  activeOrders: [],

  completedOrders: [],

  rejectedOrders: [],

  executionMode: "MANUAL",

  executionStatus: "IDLE",

  lastUpdate: null

};

/**
 * Initialize Execution Panel
 */
export function initializeExecutionPanel() {

  registerExecutionEvents();

  console.log("[ExecutionPanel] Initialized");

}

/**
 * Register Event Listeners
 */
function registerExecutionEvents() {

  /**
   * CPilot Trade Decision
   */
  on("CPILOT_DECISION", decision => {

    executionState.latestDecision = decision;

    executionState.executionStatus =
      "OPPORTUNITY_AVAILABLE";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * Meta Brain Override
   */
  on("META_BRAIN_OVERRIDE", decision => {

    executionState.latestDecision = decision;

    executionState.executionStatus =
      "OVERRIDE_APPLIED";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * Order Created
   */
  on("ORDER_CREATED", order => {

    executionState.pendingOrders.push(order);

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * Order Submitted
   */
  on("ORDER_SUBMITTED", order => {

    moveOrder(
      order.id,
      executionState.pendingOrders,
      executionState.activeOrders
    );

    executionState.executionStatus =
      "ORDER_ACTIVE";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * Order Filled
   */
  on("ORDER_FILLED", order => {

    moveOrder(
      order.id,
      executionState.activeOrders,
      executionState.completedOrders
    );

    executionState.executionStatus =
      "ORDER_FILLED";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * Order Rejected
   */
  on("ORDER_REJECTED", order => {

    moveOrder(
      order.id,
      executionState.activeOrders,
      executionState.rejectedOrders
    );

    executionState.executionStatus =
      "ORDER_REJECTED";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

  /**
   * AutoTrader Started
   */
  on("AUTOTRADER_STARTED", () => {

    executionState.executionMode =
      "AUTOMATIC";

    executionState.lastUpdate = Date.now();

    renderExecutionPanel();

  });

}

/**
 * Move Orders Between Collections
 */
function moveOrder(
  orderId,
  sourceCollection,
  destinationCollection
) {

  const index =
    sourceCollection.findIndex(
      order => order.id === orderId
    );

  if (index === -1) return;

  const [order] =
    sourceCollection.splice(index, 1);

  destinationCollection.push(order);

}

/**
 * Render Execution Panel
 */
function renderExecutionPanel() {

  emit("EXECUTION_PANEL_UPDATED", {
    ...executionState
  });

  console.log(
    "[ExecutionPanel]",
    executionState
  );

}

/**
 * Manual Order Request
 */
export function requestExecution(orderRequest) {

  emit("EXECUTION_REQUESTED", {
    ...orderRequest,
    source: "execution_panel"
  });

}

/**
 * Change Execution Mode
 */
export function setExecutionMode(mode = "MANUAL") {

  executionState.executionMode = mode;

  executionState.lastUpdate = Date.now();

  renderExecutionPanel();

}

/**
 * State Accessor
 */
export function getExecutionState() {

  return {
    ...executionState
  };

}

/**
 * Reset Execution Panel
 */
export function resetExecutionPanel() {

  executionState.latestDecision = null;

  executionState.pendingOrders = [];

  executionState.activeOrders = [];

  executionState.completedOrders = [];

  executionState.rejectedOrders = [];

  executionState.executionMode = "MANUAL";

  executionState.executionStatus = "IDLE";

  executionState.lastUpdate = null;

  renderExecutionPanel();

}
