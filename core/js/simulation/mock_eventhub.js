// core/js/simulation/mock_eventhub.js
// QuantumTrader-AI Backbone Test Harness
// Mock Event Hub

export class MockEventHub {
  constructor() {
    this.history = [];
  }

  resolve(resolvedEvents = []) {

    const sorted = [...resolvedEvents].sort(
      (a, b) => {

        const priorityDiff =
          (b.directive?.priority || 0) -
          (a.directive?.priority || 0);

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return (
          (b.directive?.confidence || 0) -
          (a.directive?.confidence || 0)
        );
      }
    );

    const routed = sorted.map(item => ({
      ...item,

      route:
        item.directive?.action?.route ||
        "eventHub"
    }));

    this.history.push({
      timestamp: Date.now(),
      count: routed.length
    });

    return routed;
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }
}
