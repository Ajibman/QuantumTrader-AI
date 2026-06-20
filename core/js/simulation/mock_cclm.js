// core/js/simulation/mock_cclm.js
// QuantumTrader-AI Backbone Test Harness
// Mock CCLMⁿ

export class MockCCLM {
  constructor() {
    this.feedbackHistory = [];
  }

  evaluate(event = {}) {

    const priority =
      typeof event.requestedPriority === "number"
        ? event.requestedPriority
        : 0.5;

    return {
      id: `dir_${event.id || Date.now()}`,

      timestamp: Date.now(),

      contextSignature:
        `ctx_${event.id || "unknown"}`,

      action: {
        route: "eventHub",
        type: "emit"
      },

      priority,

      confidence: 0.8,

      constraints: {
        throttle: false,
        maxDelayMs: null,
        allowRetry: true
      },

      metadata: {
        reason: "mock_evaluation",
        strategyTag: "test_strategy"
      }
    };
  }

  receiveFeedback(feedback) {
    this.feedbackHistory.push({
      timestamp: Date.now(),
      feedback
    });

    return true;
  }

  getFeedbackHistory() {
    return [...this.feedbackHistory];
  }

  clearFeedbackHistory() {
    this.feedbackHistory = [];
  }
}
