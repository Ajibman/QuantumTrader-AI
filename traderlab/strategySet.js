// TraderLab Strategy Set (MVP)

function momentumStrategy(data) {
  let signal = data.price > data.prevPrice ? "BUY" : "HOLD";

  return {
    name: "Momentum",
    signal,
    score: Math.random() * 100
  };
}

function meanReversionStrategy(data) {
  let signal = data.price < data.average ? "BUY" : "SELL";

  return {
    name: "Mean Reversion",
    signal,
    score: Math.random() * 100
  };
}

function breakoutStrategy(data) {
  let signal = data.price > data.resistance ? "BUY" : "HOLD";

  return {
    name: "Breakout",
    signal,
    score: Math.random() * 100
  };
}

module.exports = [
  { run: momentumStrategy },
  { run: meanReversionStrategy },
  { run: breakoutStrategy }
];
