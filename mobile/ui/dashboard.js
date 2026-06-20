 // mobile/ui/dashboard.js

import { on, emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * System Dashboard
 *
 * Responsibilities:
 * - System health monitoring
 * - Engine status monitoring
 * - Application readiness visibility
 * - Signal statistics
 * - Trading activity overview
 */

const dashboardState = {

  applicationReady: false,

  cpilotOnline: false,

  metaBrainOnline: false,

  autoTraderActive: false,

  traderLabActive: false,

  activeSignals: 0,

  completedExecutions: 0,

  lastUpdate: null

};

/**
 * Initialize Dashboard
 */
export function initializeDashboard() {

  registerSystemEvents();

  console.log("[Dashboard] Initialized");

}

/**
 * Register Event Listeners
 */
function registerSystemEvents() {

  on("APP_READY", () => {

    dashboardState.applicationReady = true;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("CPILOT_STARTED", () => {

    dashboardState.cpilotOnline = true;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("META_BRAIN_READY", () => {

    dashboardState.metaBrainOnline = true;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("AUTOTRADER_STARTED", () => {

    dashboardState.autoTraderActive = true;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("TRADERLAB_STARTED", () => {

    dashboardState.traderLabActive = true;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("SIGNAL_CREATED", () => {

    dashboardState.activeSignals++;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

  on("ORDER_FILLED", () => {

    dashboardState.completedExecutions++;

    dashboardState.lastUpdate = Date.now();

    renderDashboard();

  });

}

/**
 * Dashboard Renderer
 */
function renderDashboard() {

  emit("DASHBOARD_UPDATED", {
    ...dashboardState
  });

  console.log("[Dashboard]", dashboardState);

}

/**
 * Dashboard State Accessor
 */
export function getDashboardState() {

  return {
    ...dashboardState
  };

}

/**
 * Dashboard Reset
 */
export function resetDashboard() {

  dashboardState.applicationReady = false;
  dashboardState.cpilotOnline = false;
  dashboardState.metaBrainOnline = false;
  dashboardState.autoTraderActive = false;
  dashboardState.traderLabActive = false;
  dashboardState.activeSignals = 0;
  dashboardState.completedExecutions = 0;
  dashboardState.lastUpdate = null;

  renderDashboard();

}
