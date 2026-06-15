import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export class SystemWatchdog {

  constructor(systemBoot) {
    this.system = systemBoot;

    this.state = {
      active: false,
      lastCheck: Date.now(),
      failureCount: 0,
      restartTriggered: false
    };

    this.intervalId = null;
  }

  start(intervalMs = 5000) {

    if (this.state.active) return;

    this.state.active = true;

    this.intervalId = setInterval(() => {

      this._checkSystem();

    }, intervalMs);

    console.log("[WATCHDOG] Activated");
  }

recover() {

  console.log("[BOOT] Attempting system recovery...");

  this.state.mode = "RECOVERING";

  // re-run stress validation
  const testResult = this.stressTest.run([], []);

  if (testResult.averageDrift < 0.25) {
    this.state.healthCheckPassed = true;
    this.state.mode = "RUNNING";

    console.log("[BOOT] Recovery successful");
  } else {
    this.state.mode = "FAIL_SAFE";

    console.log("[BOOT] Recovery failed - system locked");
  }

  return this.state;
}
  
  // --------------------------------------------------
  // CORE HEALTH CHECK LOOP
  // --------------------------------------------------

  _checkSystem() {

    const health = metaBrain.getHealthReport();
    const drift = health.sync.driftScore;

    this.state.lastCheck = Date.now();

    // --------------------------
    // FAILURE CONDITIONS
    // --------------------------

    if (drift > 0.35) {
      this.state.failureCount++;
    } else {
      this.state.failureCount = 0;
    }

    // --------------------------
    // ESCALATION LOGIC
    // --------------------------

    if (this.state.failureCount >= 3) {
      this._triggerRecovery();
    }
  }

  // --------------------------------------------------
  // RECOVERY ACTION
  // --------------------------------------------------

  _triggerRecovery() {

    if (this.state.restartTriggered) return;

    console.log("[WATCHDOG] SYSTEM INSTABILITY DETECTED");

    this.state.restartTriggered = true;

    this.system.state.mode = "FAIL_SAFE";

    // optional: re-run boot health check
    console.log("[WATCHDOG] Switching system to FAIL_SAFE mode");
  }

  stop() {
    clearInterval(this.intervalId);
    this.state.active = false;
  }

  getState() {
    return this.state;
  }
}
