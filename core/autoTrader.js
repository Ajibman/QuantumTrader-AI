// core/js/autoTrader.js

import signalEngine from "./signalEngine.js";
import riskEngine from "./riskEngine.js";
import decisionEngine from "./decisionEngine.js";

const autoTrader = {

  async runCycle() {

    const signals = await signalEngine.scan();

    const risk = riskEngine.evaluate(signals);

    const decision = decisionEngine.makeDecision(
      signals,
      risk
    );

    return decision;
  }

};

export default autoTrader;
