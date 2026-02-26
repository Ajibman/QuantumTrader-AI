/* =========================================================
   QuantumTrader-AI
   AutoTrader TraderLab Simulation — SERIAL 4 of 6
   Purpose: Simulate trades using signals + discipline
   ========================================================= */

import { evaluateStrategies } from "./autotrader.strategy.mjs";
import { evaluateDiscipline } from "./autotrader.discipline.mjs";

/* ---------- SIMULATION CONTEXT ---------- */
export function simulateTradeTick(context) {
  const { liftbridgeScore, marketTick, balance, equity, exposure, lastTradeTime } = context;

  // 1️⃣ Evaluate strategy signals
  const signals = evaluateStrategies({ tick: marketTick });

  // 2️⃣ Simulate each signal against discipline
  const results = signals.map(signal => {
    const disciplineResult = evaluateDiscipline({
      liftbridgeScore,
      signal,
      balance,
      equity,
      exposure,
      lastTradeTime
    });

    return {
      simulated: true,
      action: signal.action,
      approved: disciplineResult.permitted,
      disciplineDepth: disciplineResult.disciplineDepth,
      reason: disciplineResult.reason,
      timestamp: Date.now()
    };
  });

  return results;
}

/* ---------- SAMPLE USAGE ---------- */
/*
const context = {
  liftbridgeScore: 18,
  marketTick: { price: 102.5, timestamp: Date.now(), volume: 1000 },
  balance: 5000,
  equity: 5000,
  exposure: 0,
  lastTradeTime: null
};

const simulationResults = simulateTradeTick(context);
console.log(simulationResults);
*/
