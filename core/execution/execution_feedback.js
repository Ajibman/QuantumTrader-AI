// core/execution/execution_feedback.js

import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export function recordTradeOutcome(trade) {

  const success = trade.pnl > 0;

  metaBrain.recordLiveOutcome(success);

  return {
    success,
    pnl: trade.pnl,
    recordedAt: Date.now()
  };
}
