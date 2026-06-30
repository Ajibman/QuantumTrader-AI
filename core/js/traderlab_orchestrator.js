 // TraderLab Orchestrator — System Coordinator Layer

import { getBestStrategy } from "./strategy_memory.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "../cpilot/cpilot_memory.js";
import eventHub from "../brain/meta_brain/engines/event_hub.js";
import {
  buildSessionConfig
} from "./meta_brain.js";

let activeSession = null;
let sessions = [];

// ======================================================
// RUNTIME REGISTRATION
// ======================================================

eventHub.registerModule("traderlab_orchestrator", {
  role: "runtime_orchestrator",
  runtime: "production"
});

// ======================================================
// RUNTIME EVENT SUBSCRIPTIONS
// ======================================================

eventHub.subscribe("trade:signal", () => {

  try {

    buildSessionConfig();

  } catch (error) {

    console.error(
      "[TraderLab] Meta-Brain refresh failed",
      error
    );

  }

});

/**
 * CREATE SESSION
 */
export function createSession({
  name = "session",
  mode = "simulation",
  interval = 5000,
  config = {}
}) {

  const sessionId = `${name}_${Date.now()}`;

  const session = {
    id: sessionId,
    name,
    mode,
    interval,
    config,
    status: "created",
    createdAt: Date.now()
  };

  sessions.push(session);

  activeSession = session;

  return sessionId;
}

/**
 * START SESSION
 */
export function startSession(sessionId, { getMarketData }) {

  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  session.status = "running";

  // ======================================================
  // SESSION STARTED
  // ======================================================

  eventHub.emit({

    type: "session:started",

    source: "traderlab_orchestrator",

    target: "runtime",

    priority: "normal",

    payload: {
      sessionId: session.id,
      mode: session.mode
    }

  });

  const marketDataProvider = getMarketData || (() => ({}));

  const loop = setInterval(() => {

    const marketData = marketDataProvider();

    const best = getBestStrategy(marketData);
    const cpilotMemory = getMemorySnapshot();
    const strategyMemory = getStrategyMemory();

    /**
     * ORCHESTRATION DECISION
     */
    const orchestration = {
      sessionId: session.id,
      strategy: best.bestStrategy,
      context: best.context,
      cpilotSnapshot: cpilotMemory,
      strategySnapshot: strategyMemory,
      marketData,
      timestamp: Date.now()
    };

    // ======================================================
    // RUNTIME CYCLE EVENT
    // ======================================================

    eventHub.emit({

      type: "traderlab:cycle",

      source: "traderlab_orchestrator",

      target: "runtime",

      priority: "normal",

      payload: orchestration

    });

    /**
     * EVENT HOOK (future Meta-Brain entry point)
     */
    if (typeof session.onCycle === "function") {
      session.onCycle(orchestration);
    }

  }, session.interval);

  session.loop = loop;

  return session;
}

/**
 * STOP SESSION
 */
export function stopSession(sessionId) {

  const session = sessions.find(s => s.id === sessionId);

  if (!session) return;

  clearInterval(session.loop);

  session.status = "stopped";

  // ======================================================
  // SESSION STOPPED
  // ======================================================

  eventHub.emit({

    type: "session:stopped",

    source: "traderlab_orchestrator",

    target: "runtime",

    priority: "normal",

    payload: {
      sessionId: session.id
    }

  });

  session.loop = null;
}

/**
 * GET ACTIVE SESSION
 */
export function getActiveSession() {
  return activeSession;
}

/**
 * LIST ALL SESSIONS
 */
export function listSessions() {
  return sessions;
}
