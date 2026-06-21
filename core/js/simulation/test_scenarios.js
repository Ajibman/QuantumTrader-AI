// core/js/simulation/test_scenarios.js

import { BackboneTestHarness } from "./backbone_test_harness.js";
import { MockConnector } from "./mock_connector.js";
import { MockCCLM } from "./mock_cclm.js";
import { MockEventHub } from "./mock_eventhub.js";
import { MockExecutor } from "./mock_executor.js";
import { MockCPilot } from "./mock_cpilot.js";

function buildHarness() {
  return new BackboneTestHarness({
    connector: new MockConnector(),
    cclm: new MockCCLM(),
    eventHub: new MockEventHub(),
    executor: new MockExecutor(),
    cpilot: new MockCPilot()
  });
}

/**
 * Scenario 1
 * Priority Resolution
 */
export async function runPriorityTest() {

  const harness = buildHarness();

  const events = [
    { id: "A", requestedPriority: 0.2 },
    { id: "B", requestedPriority: 0.9 },
    { id: "C", requestedPriority: 0.5 }
  ];

  const result = await harness.run(events);

  return {
    scenario: "Priority Resolution",
    success: result.success,
    expectedOrder: ["B", "C", "A"],
    cycle: result.cycle
  };
}

/**
 * Scenario 2
 * Suppression Test
 */
export async function runSuppressionTest() {

  const harness = buildHarness();

  harness.cclm.evaluate = (event) => ({
    id: `dir_${event.id}`,
    timestamp: Date.now(),
    contextSignature: `ctx_${event.id}`,

    action: {
      route: "eventHub",
      type: event.id === "BLOCKED"
        ? "suppress"
        : "emit"
    },

    priority: 0.5,
    confidence: 0.8,

    constraints: {
      throttle: false,
      maxDelayMs: null,
      allowRetry: true
    },

    metadata: {
      reason: "suppression_test",
      strategyTag: "test"
    }
  });

  const result = await harness.run([
    { id: "ALLOWED" },
    { id: "BLOCKED" }
  ]);

  return {
    scenario: "Suppression Test",
    success: result.success,
    cycle: result.cycle
  };
}

/**
 * Scenario 3
 * Burst Load Test
 */
export async function runBurstLoadTest(
  count = 1000
) {

  const harness = buildHarness();

  const events = [];

  for (let i = 0; i < count; i++) {

    events.push({
      id: `EVT_${i}`,
      requestedPriority: Math.random()
    });
  }

  const started = Date.now();

  const result =
    await harness.run(events);

  const duration =
    Date.now() - started;

  return {
    scenario: "Burst Load Test",
    success: result.success,
    totalEvents: count,
    durationMs: duration,
    cycle: result.cycle
  };
}

/**
 * Scenario 4
 * Feedback Integrity Test
 */
export async function runFeedbackTest() {

  const harness = buildHarness();

  const result =
    await harness.run([
      {
        id: "FEEDBACK_A",
        requestedPriority: 0.8
      }
    ]);

  const feedback =
    result.cycle.feedback;

  return {
    scenario: "Feedback Integrity Test",
    success: result.success,
    feedbackCount: feedback.length,
    feedback
  };
}

/**
 * Run Everything
 */
export async function runAllTests() {

  const results = [];

  results.push(
    await runPriorityTest()
  );

  results.push(
    await runSuppressionTest()
  );

  results.push(
    await runBurstLoadTest()
  );

  results.push(
    await runFeedbackTest()
  );

  return {
    timestamp: Date.now(),
    suite: "QuantumTrader-AI Backbone Validation",
    results
  };
}
