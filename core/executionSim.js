// Execution Simulation Engine (MVP)

function run(selectedStrategy, marketData) {
  if (!selectedStrategy || selectedStrategy.name === "NONE") {
    return {
      status: "NO_TRADE",
      signal: "HOLD",
      profit: 0,
      reason: "No valid strategy selected"
    };
  }

  const price = marketData.price;

  // Simple deterministic simulation logic (MVP only)

  let profit = 0;
  let signal = selectedStrategy.signal;

  if (signal === "BUY") {
    // simulate upward movement expectation
    profit = Math.random() * 10; // placeholder movement
  }

  if (signal === "SELL") {
    // simulate downward movement expectation
    profit = Math.random() * 10;
  }

  if (signal === "HOLD") {
    profit = 0;
  }

  // attach basic evaluation outcome
  const outcome =
    profit > 5 ? "WIN" :
    profit > 0 ? "SMALL_WIN" :
    profit === 0 ? "NO_ACTION" :
    "LOSS";

  return {
    status: "EXECUTED_SIMULATION",
    strategy: selectedStrategy.name,
    signal,
    entryPrice: price,
    profit,
    outcome
  };
}

module.exports = {
  run
};
