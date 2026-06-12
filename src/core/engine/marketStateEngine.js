export function buildMarketState(marketData) {

  const volatility = marketData.volatilityIndex;
  const trendStrength = marketData.trendStrength;
  const volume = marketData.volume;

  if (volatility > 0.8) return "VOLATILE";

  if (trendStrength > 0.7 && volume > 0.6) return "TRENDING";

  if (trendStrength < 0.3) return "RANGING";

  return "UNCERTAIN";
}
