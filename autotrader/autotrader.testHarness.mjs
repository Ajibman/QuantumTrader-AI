/* =========================================================
   QuantumTrader-AI
   Full AutoTrader Test Harness — Tick-by-Tick + Per-Gate + Summary
   ========================================================= */

import { startOrchestrator, stopOrchestrator, toggleLiveMode } from "./autotrader.orchestrator.mjs";
import { evaluateStrategies } from "./autotrader.strategy.mjs";
import { evaluateDiscipline, getDisciplineStatus, getGateResults } from "./autotrader.discipline.mjs";
import { simulateTradeTick } from "./autotrader.traderlab.mjs";
import { executeBatchSignals } from "./autotrader.execution.mjs";

/* ---------------- CONFIG ---------------- */
const TEST_CONFIG = {
  tickIntervalMs: 5000, // 5 seconds between ticks
  totalTicks: 5,        // number of ticks to simulate
  liftbridgeScore: 18
};

let summary = [];

/* ---------------- MOCK MARKET GENERATOR ---------------- */
function generateMockTick() {
  return {
    price: parseFloat((Math.random() * 100 + 50).toFixed(2)), // price 50–150
    volume: Math.floor(Math.random() * 1000 + 100),           // 100–1100 volume
    timestamp: Date.now()
  };
}

/* ---------------- RUN TEST HARNESS ---------------- */
async function runTestHarness() {
  console.log("=== Starting AutoTrader Test Harness ===");

  // 1️⃣ Start orchestrator in SIMULATION mode
  toggleLiveMode(false);
  startOrchestrator();

  let tickCount = 0;

  const testInterval = setInterval(() => {
    tickCount++;
    const tick = generateMockTick();
    console.log(`\n--- Tick #${tickCount} ---`);
    console.log("Market Tick:", tick);

    // 2️⃣ Evaluate strategy signals
    const signals = evaluateStrategies({ tick });
    let tickSummary = { tick: tickCount, signals: [] };

    signals.forEach(signal => {
      // 3️⃣ Evaluate discipline per signal
      const disciplineResult = evaluateDiscipline({
        liftbridgeScore: TEST_CONFIG.liftbridgeScore,
        signal,
        balance: 5000,
        equity: 5000,
        exposure: 0,
        lastTradeTime: null
      });

      const gateResults = getGateResults(disciplineResult);

      // Store summary for final table
      tickSummary.signals.push({
        signal: signal.action,
        permitted: disciplineResult.permitted,
        gates: gateResults.map(g => ({ name: g.name, passed: g.passed }))
      });

      // Print per-signal, per-gate logs
      console.log(`Signal: ${signal.action}`);
      console.log("Permitted:", disciplineResult.permitted);
      console.log("Gates:");
      gateResults.forEach((g, idx) => {
        console.log(`  Gate ${idx + 1}: ${g.passed ? "PASS" : "FAIL"}${g.reason ? " → " + g.reason : ""}`);
      });
    });

    // 4️⃣ Discipline envelope status
    const disciplineStatus = getDisciplineStatus(TEST_CONFIG.liftbridgeScore);
    console.log("Discipline Envelope Status:", disciplineStatus);

    // 5️⃣ TraderLab simulation
    const traderLabResults = simulateTradeTick({
      liftbridgeScore: TEST_CONFIG.liftbridgeScore,
      marketTick: tick,
      balance: 5000,
      equity: 5000,
      exposure: 0,
      lastTradeTime: null
    });
    console.log("TraderLab Simulation Results:", traderLabResults);

    // 6️⃣ Execute signals via execution adapter (SIMULATION)
    const executionResults = executeBatchSignals(signals, {
      liftbridgeScore: TEST_CONFIG.liftbridgeScore,
      balance: 5000,
      equity: 5000,
      exposure: 0,
      lastTradeTime: null
    });
    console.log("Execution Adapter Results (SIMULATION):", executionResults);

    summary.push(tickSummary);

    // 7️⃣ Stop after configured number of ticks
    if (tickCount >= TEST_CONFIG.totalTicks) {
      clearInterval(testInterval);
      stopOrchestrator();
      console.log("\n=== Test Harness Complete ===\n");

      // 8️⃣ Print final summary table
      console.log("=== Final Summary Table ===");
      summary.forEach(tick => {
        console.log(`\nTick #${tick.tick}`);
        tick.signals.forEach(s => {
          console.log(`  Signal: ${s.signal}, Permitted: ${s.permitted}`);
          s.gates.forEach((g, idx) => console.log(`    Gate ${idx + 1}: ${g.passed ? "PASS" : "FAIL"} (${g.name})`));
        });
      });
    }
  }, TEST_CONFIG.tickIntervalMs);
}

/* ---------------- START TEST ---------------- */
runTestHarness();
