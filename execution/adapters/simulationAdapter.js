// simulationAdapter.js

function execute(intent, marketData) {

  let outcome = "HOLD";
  let profit = 0;

  if (intent.signal === "BUY") {
    profit = Math.random() * 10;
    outcome = "BUY_EXECUTED";
  }

  if (intent.signal === "SELL") {
    profit = Math.random() * 10;
    outcome = "SELL_EXECUTED";
  }

  return {
    mode: "simulation",
    outcome,
    profit,
    strategy: intent.strategy
  };
}

module.exports = {
  execute
};
