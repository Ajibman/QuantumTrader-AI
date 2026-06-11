// paperAdapter.js

function execute(intent, marketData) {

  return {
    mode: "paper",
    strategy: intent.strategy,
    signal: intent.signal,
    status: "PAPER_ORDER_CREATED"
  };
}

module.exports = {
  execute
};
