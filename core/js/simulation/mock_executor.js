// core/js/simulation/mock_executor.js
// QuantumTrader-AI Backbone Test Harness
// Mock Executor

export class MockExecutor {
  constructor() {
    this.executions = [];
  }

  async execute(resolvedItem = {}) {

    const latency =
      Math.floor(Math.random() * 150) + 10;

    const outcome = {
      timestamp: Date.now(),

      success: true,

      latency,

      route:
        resolvedItem.route ||
        "eventHub",

      event:
        resolvedItem.event ||
        null,

      directive:
        resolvedItem.directive ||
        null
    };

    this.executions.push(outcome);

    return outcome;
  }

  getExecutions() {
    return [...this.executions];
  }

  clearExecutions() {
    this.executions = [];
  }
}
