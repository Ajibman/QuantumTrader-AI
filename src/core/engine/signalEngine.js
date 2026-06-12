import { buildMarketState } from "./marketStateEngine";
import { calculateRisk } from "./riskEngine";

/**
 * MAIN SIGNAL GENERATOR
 * This is the brain entry point
 */
export function generateSignal(marketData, aiModelOutput) {

  const market_state = buildMarketState(marketData);

  const risk = calculateRisk(marketData, aiModelOutput, market_state);

  const direction = aiModelOutput.direction || "WAIT";

  const signal = {
    signal_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),

    asset: marketData.asset,

    market_state,

    direction,

    entry_zone: aiModelOutput.entry_zone,
    stop_loss: aiModelOutput.stop_loss,
    take_profits: aiModelOutput.take_profits,

    confidence: aiModelOutput.confidence,

    risk,

    reasoning: aiModelOutput.reasoning || [],
    warnings: aiModelOutput.warnings || [],

    ai_mode: aiModelOutput.ai_mode || "BALANCED"
  };

  return signal;
}
