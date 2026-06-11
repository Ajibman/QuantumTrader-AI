// execution/executionRouter.js

const simulationAdapter =
  require("./adapters/simulationAdapter");

const paperAdapter =
  require("./adapters/paperAdapter");

const marketAdapter =
  require("./adapters/marketAdapter");

function route(intent, marketData, mode) {

  switch(mode) {

    case "simulation":
      return simulationAdapter.execute(
        intent,
        marketData
      );

    case "paper":
      return paperAdapter.execute(
        intent,
        marketData
      );

    case "market":
      return marketAdapter.execute(
        intent,
        marketData
      );

    default:
      throw new Error(
        `Unsupported mode: ${mode}`
      );
  }
}

module.exports = {
  route
};
