export function runEngineCycle({ marketData, state }) {
  if (!marketData) {
    return {
      action: "HOLD",
      reason: "No market data provided"
    };
  }

  const price = marketData.price;
  const previous = state?.lastPrice || price;

  let action = "HOLD";

  // Simple directional logic (placeholder strategy)
  if (price > previous * 1.002) {
    action = "BUY";
  } else if (price < previous * 0.998) {
    action = "SELL";
  }

  return {
    action,
    price,
    timestamp: new Date().toISOString(),
    confidence: 0.5, // placeholder for now
    debug: {
      previousPrice: previous
    }
  };
}



