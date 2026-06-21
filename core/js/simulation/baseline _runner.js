// core/js/simulation/baseline_runner.js
// QuantumTrader-AI — Baseline System Fingerprint Runner

export class BaselineRunner {
  constructor(pipelineEngine) {
    this.pipeline = pipelineEngine;
    this.results = [];
  }

  async runScenario(name, events) {

    const report = {
      name,
      total: events.length,

      executed: 0,
      suppressed: 0,
      failed: 0,

      latency: [],
      stepCompletion: {
        step1: 0,
        step2: 0,
        step3: 0,
        step4: 0,
        step5: 0,
        step6: 0,
        step7: 0
      }
    };

    const startTime = Date.now();

    for (const event of events) {

      const t0 = performance.now();

      try {

        const result =
          await this.pipeline.run(event);

        const t1 = performance.now();

        report.latency.push(t1 - t0);

        // -------------------------
        // CLASSIFY RESULT
        // -------------------------
        if (result?.status === "suppressed_by_cclm") {
          report.suppressed++;
        } else if (result?.success) {
          report.executed++;
        } else {
          report.failed++;
        }

        // -------------------------
        // STEP COMPLETENESS CHECK
        // -------------------------
        const steps = result?.steps;

        if (steps) {
          if (steps.event) report.stepCompletion.step1++;
          if (steps.directive) report.stepCompletion.step2++;
          if (steps.enriched) report.stepCompletion.step3++;
          if (steps.routed) report.stepCompletion.step4++;
          if (steps.outcome) report.stepCompletion.step5++;
          if (steps.feedback) report.stepCompletion.step6++;
          if (steps.ack !== undefined) report.stepCompletion.step7++;
        }

      } catch (err) {
        report.failed++;
      }
    }

    const endTime = Date.now();

    // -------------------------
    // FINAL METRICS
    // -------------------------
    report.totalTime = endTime - startTime;

    report.avgLatency =
      report.latency.length
        ? report.latency.reduce((a, b) => a + b, 0) /
          report.latency.length
        : 0;

    report.successRate =
      report.executed / report.total;

    report.suppressionRate =
      report.suppressed / report.total;

    report.failureRate =
      report.failed / report.total;

    this.results.push(report);

    return report;
  }

  async runBaselineSuite(scenarios) {

    const suiteReport = {
      timestamp: Date.now(),
      scenarios: [],
      summary: {
        totalScenarios: scenarios.length,
        avgSuccessRate: 0,
        avgLatency: 0,
        avgSuppressionRate: 0
      }
    };

    let totalSuccess = 0;
    let totalLatency = 0;
    let totalSuppression = 0;

    for (const scenario of scenarios) {

      const result =
        await this.runScenario(
          scenario.name,
          scenario.events
        );

      suiteReport.scenarios.push(result);

      totalSuccess += result.successRate;
      totalLatency += result.avgLatency;
      totalSuppression += result.suppressionRate;
    }

    suiteReport.summary.avgSuccessRate =
      totalSuccess / scenarios.length;

    suiteReport.summary.avgLatency =
      totalLatency / scenarios.length;

    suiteReport.summary.avgSuppressionRate =
      totalSuppression / scenarios.length;

    return suiteReport;
  }

  getResults() {
    return this.results;
  }

  clear() {
    this.results = [];
  }
}
