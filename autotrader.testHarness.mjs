/* =========================================================
   QuantumTrader-AI
   Minimal Test Harness — Full Orchestrator Simulation
   ========================================================= */

import { startOrchestrator, stopOrchestrator, toggleLiveMode } from "./autotrader.orchestrator.mjs";

// ---------------- CONFIG ----------------
const TEST_CONFIG = {
  tickIntervalMs: 5000, // 5 sec between ticks for test
  totalTicks: 5         // number of ticks to simulate
};

// ---------------- MOCK MARKET GENERATOR ----------------
function generateMockTick() {
  return {
    price: parseFloat((Math.random() * 100 + 50).toFixed(2)), // price 50–150
    volume: Math.floor(Math.random() * 1000 + 100),           // 100–1100 volume
    timestamp: Date.now()
  };
}

// ---------------- RUN TEST HARNESS ----------------
async function runTestHarness() {
  console.log("=== Starting AutoTrader Test Harness (SIMULATION) ===");
  
  // 1️⃣ Start orchestrator in SIMULATION mode
  toggleLiveMode(false);
  startOrchestrator();

  let tickCount = 0;

  const testInterval = setInterval(() => {
    tickCount++;
    const tick = generateMockTick();
    console.log(`\n--- Tick #${tickCount} ---`);
    console.log("Market Tick:", tick);

    // 2️⃣ Orchestrator automatically runs signals, discipline, TraderLab, execution
    // In simulation mode, all executed signals are printed by orchestrator internally

    if (tickCount >= TEST_CONFIG.totalTicks) {
      clearInterval(testInterval);
      stopOrchestrator();
      console.log("\n=== Test Harness Complete ===");
    }
  }, TEST_CONFIG.tickIntervalMs);
}

// ---------------- START TEST ----------------
runTestHarness();
