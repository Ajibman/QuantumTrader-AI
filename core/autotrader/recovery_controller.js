import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export class RecoveryController {

  constructor() {
    this.state = {
      cooldownActive: false,
      recoveryScore: 0,
      lastCheck: Date.now()
    };
  }

  evaluateRecovery() {
    const health = metaBrain.getHealthReport();

    const drift = health.sync.driftScore;
    const sim = health.sync.simulationWinRate;
    const live = health.sync.liveWinRate;

    const stabilityGap = Math.abs(sim - live);

    // Recovery score = system stability indicator
    this.state.recoveryScore =
      (1 - drift) * 0.6 +
      (1 - stabilityGap) * 0.4;

    this.state.lastCheck = Date.now();

    // --------------------------
    // RECOVERY LOGIC
    // --------------------------

    if (this.state.recoveryScore > 0.75) {
      this.state.cooldownActive = false;
      return "RECOVERED";
    }

    if (this.state.recoveryScore > 0.55) {
      this.state.cooldownActive = true;
      return "STABILIZING";
    }

    this.state.cooldownActive = true;
    return "LOCKED";
  }

  getState() {
    return this.state;
  }
}
