// core/js/simulation/mock_cpilot.js
// QuantumTrader-AI Backbone Test Harness
// Mock cpilot Observer

export class MockCPilot {
  constructor() {
    this.observations = [];
    this.feedbackLog = [];
  }

  observe(outcome = {}) {

    const score = this.calculateScore(outcome);

    const feedback = {
      timestamp: Date.now(),

      eventId:
        outcome?.event?.id || null,

      route:
        outcome?.route || "unknown",

      success:
        outcome?.success ?? false,

      latency:
        outcome?.latency ?? 0,

      score,

      recommendation:
        score >= 0.75
          ? "reinforce"
          : score <= 0.40
            ? "decrease"
            : "neutral"
    };

    this.observations.push({
      outcome,
      feedback
    });

    this.feedbackLog.push(feedback);

    return feedback;
  }

  calculateScore(outcome = {}) {

    const successScore =
      outcome.success ? 0.7 : 0;

    const latencyScore =
      Math.max(
        0,
        0.3 - ((outcome.latency || 0) / 1000)
      );

    return Number(
      (successScore + latencyScore)
        .toFixed(3)
    );
  }

  getObservations() {
    return [...this.observations];
  }

  getFeedbackLog() {
    return [...this.feedbackLog];
  }

  clear() {
    this.observations = [];
    this.feedbackLog = [];
  }
}
