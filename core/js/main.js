// ============================================================
// QuantumTrader-AI™
// Application Bootstrap
// main.js
// ============================================================

import eventHub from "../brain/meta_brain/engines/event_hub.js";

// Core runtime
import { initializeCPilot } from "./cpilot/cpilot_engine.js";

// UI Gates
import { applyTraderLabGate } from "./traderlab_ui_gate.js";
import { applyCPilotGate } from "./cpilot_ui_gate.js";
import { applyTradingFloorGate } from "./tradingfloor_ui_gate.js";

// Run Controllers
import { startTraderLab } from "./traderlab/traderlab_run_controller.js";
import { startCPilot } from "./cpilot/cpilot_run_controller.js";
import { startTradingFloor } from "./tradingfloor/tradingfloor_run_controller.js";

/**
 * ============================================================
 * Runtime Bootstrap
 * ============================================================
 */

async function bootstrap() {

    console.info("[QuantumTrader-AI] Bootstrapping...");

    // Register application
    eventHub.registerModule("application", {
        runtime: "production",
        engine: "main"
    });

    // Initialize intelligence engines
    await initializeCPilot();

    // Apply UI gates
    applyTraderLabGate();
    applyCPilotGate();
    applyTradingFloorGate();

    // Bind UI buttons
    bindUI();

    console.info("[QuantumTrader-AI] Ready.");
}

/**
 * ============================================================
 * UI Binding
 * ============================================================
 */

function bindUI() {

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

bootstrap();
