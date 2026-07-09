 // core/js/main.js

/**
 * ==========================================
 * QuantumTrader AI™
 * Application Bootstrap
 * ==========================================
 *
 * Responsibilities:
 * - Initialize UI gates
 * - Bind UI events
 * - Bootstrap application modules
 * - Coordinate startup sequence
 *
 * This is the single application entry point.
 */

import { applyTraderLabGate } from "./traderlab_ui_gate.js";
import { applyCPilotGate } from "./cpilot/cpilot_ui_gate.js";
import { applyTradingFloorGate } from "./tradingfloor_ui_gate.js";

import { startTraderLab } from "./traderlab/traderlab_run_controller.js";
import { startCPilot } from "./cpilot/cpilot_run_controller.js";
import { startTradingFloor } from "./tradingfloor/tradingfloor_run_controller.js";

/* ==========================================
   UI GATE INITIALIZATION
========================================== */

function initializeGates() {

  applyTraderLabGate();
  applyCPilotGate();
  applyTradingFloorGate();

}

/* ==========================================
   BUTTON BINDINGS
========================================== */

function bindButtons() {

  // TraderLab

  document
    .getElementById("enter-traderlab")
    ?.addEventListener("click", () => {

      try {
        startTraderLab();
      } catch (e) {
        alert("TraderLab Error: " + e.message);
      }

    });

  document
    .getElementById("reset-traderlab")
    ?.addEventListener("click", () => {

      location.reload();

    });

  // CPilot

  document
    .getElementById("enter-cpilot")
    ?.addEventListener("click", () => {

      try {
        startCPilot();
      } catch (e) {
        alert("CPilot Error: " + e.message);
      }

    });

  document
    .getElementById("reset-cpilot")
    ?.addEventListener("click", () => {

      location.reload();

    });

  // Trading Floor

  document
    .getElementById("enter-tradingfloor")
    ?.addEventListener("click", () => {

      try {
        startTradingFloor();
      } catch (e) {
        alert("Trading Floor Error: " + e.message);
      }

    });

  document
    .getElementById("reset-tradingfloor")
    ?.addEventListener("click", () => {

      location.reload();

    });

}

/* ==========================================
   APPLICATION BOOTSTRAP
========================================== */

function bootstrap() {

  initializeGates();

  bindButtons();

  console.info(
    "QuantumTrader AI™ bootstrap complete."
  );

}

bootstrap();
