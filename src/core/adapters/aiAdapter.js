export function normalizeAIOutput(rawOutput) {

  return {
    direction: rawOutput.direction || "WAIT",

    entry_zone: rawOutput.entry_zone || { low: 0, high: 0 },

    stop_loss: rawOutput.stop_loss || { value: 0, reason: "" },

    take_profits: rawOutput.take_profits || [],

    confidence: rawOutput.confidence || 0,

    reasoning: rawOutput.reasoning || [],

    warnings: rawOutput.warnings || [],

    ai_mode: rawOutput.ai_mode || "BALANCED"
  };
}
