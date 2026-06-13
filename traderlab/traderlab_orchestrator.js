// core/js/traderlab_orchestrator.js

/**
 * TraderLab Orchestrator
 * ----------------------
 * This is the SYSTEM CONTROL CENTER.
 *
 * It manages:
 * - experiments
 * - sessions
 * - strategy configurations
 * - isolated runs
 *
 * It does NOT execute trades.
 * It coordinates the lab environment.
 */

import { startTraderLab, stopTraderLab, triggerSingleCycle } from "./traderlab_access.js";
import { resetMemory } from "../cpilot/cpilot_memory.js";
import { resetStrategyMemory } from "./strategy_memory.js";

const orchestratorState = {
  activeSession: null,
  sessions: {}
};

/**
 * 🧪 CREATE NEW EXPERIMENT SESSION
 */
export function createSession({
  name = "default-session",
  mode = "simulation",
  interval = 5000,
  config = {}
}) {
  const sessionId = `${name}-${Date.now()}`;

  orchestratorState.sessions[sessionId] = {
    id: sessionId,
    name,
    mode,
    interval,
    config,
    status: "created",
    results: [],
    startedAt: null,
    endedAt: null
  };

  return sessionId;
}

/**
 * ▶️ START SESSION
 */
export function startSession(sessionId, { getMarketData }) {
  const session = orchestratorState.sessions[sessionId];
  if (!session) throw new Error("Session not found");

  orchestratorState.activeSession = sessionId;
  session.status = "running";
  session.startedAt = Date.now();

  startTraderLab({
    getMarketData,
    interval: session.interval,
    mode: session.mode
  });

  return session;
}

/**
 * ⏹ STOP SESSION
 */
export function stopSession() {
  const sessionId = orchestratorState.activeSession;
  if (!sessionId) return;

  const session = orchestratorState.sessions[sessionId];

  stopTraderLab();

  session.status = "stopped";
  session.endedAt = Date.now();

  orchestratorState.activeSession = null;

  return session;
}

/**
 * 🧪 RUN SINGLE EXPERIMENT CYCLE
 */
export async function runExperimentCycle(sessionId, getMarketData) {
  const session = orchestratorState.sessions[sessionId];
  if (!session) throw new Error("Session not found");

  const result = await triggerSingleCycle(getMarketData, session.mode);

  session.results.push(result);

  return result;
}

/**
 * 🔁 RESET ENTIRE LAB (CLEAN STATE)
 */
export function resetLab() {
  stopSession();

  resetMemory();
  resetStrategyMemory();

  orchestratorState.activeSession = null;
  orchestratorState.sessions = {};
}

/**
 * 📊 GET SESSION REPORT
 */
export function getSessionReport(sessionId) {
  const session = orchestratorState.sessions[sessionId];
  if (!session) return null;

  const executed = session.results.filter(r => r.status !== "skipped");

  const totalPnL = executed.reduce((sum, r) => {
    return sum + (r?.cycleResult?.result?.pnl || 0);
  }, 0);

  const wins = executed.filter(r => r?.cycleResult?.result?.pnl > 0).length;
  const losses = executed.filter(r => r?.cycleResult?.result?.pnl <= 0).length;

  return {
    sessionId,
    name: session.name,
    status: session.status,
    duration: session.endedAt
      ? session.endedAt - session.startedAt
      : Date.now() - session.startedAt,
    trades: executed.length,
    wins,
    losses,
    winRate: executed.length ? wins / executed.length : 0,
    totalPnL
  };
}

/**
 * 📚 LIST ALL SESSIONS
 */
export function listSessions() {
  return Object.values(orchestratorState.sessions);
    }
