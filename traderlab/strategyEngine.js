// TraderLab Strategy Engine (MVP)

const strategies = require("./strategySet");
const validator = require("./validator");

function evaluate(marketData) {
  let results = [];

  // Run each strategy
  strategies.forEach((strategy) => {
    const output = strategy.run(marketData);

    // Validate output
    const isValid = validator.check(output);

    if (isValid) {
      results.push(output);
    }
  });

  // Sort by score (best first)
  results.sort((a, b) => b.score - a.score);

  return {
    approved: results,
    best: results[0] || null
  };
}

module.exports = {
  evaluate
};
