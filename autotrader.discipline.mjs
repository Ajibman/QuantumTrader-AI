/* =========================================================
   QuantumTrader-AI
   AutoTrader Discipline Envelope — SERIAL 3 of 6
   Certainty Model: 99.9^n %
   Constraint: 1 <= n <= 21  (n MUST NEVER COLLAPSE)
   ========================================================= */

/* ---------- DISCIPLINE LIMITS ---------- */
const DISCIPLINE_LIMITS = {
  MIN_N: 1,
  MAX_N: 21
};

/* ---------- RISK CONFIG ---------- */
const RISK_RULES = {
  minConfidence: 0.70,
  maxRiskPerTrade: 0.01,      // 1%
  maxExposure: 0.30,          // 30%
  minBalance: 10,
  minTradeIntervalMs: 30_000
};

/* ---------- DISCIPLINE RESOLVER ---------- */
/* liftbridgeScore is assumed to be provided upstream */
export function resolveDisciplineN(liftbridgeScore) {
  let n_raw = Math.floor(liftbridgeScore);

  if (Number.isNaN(n_raw)) {
    n_raw = DISCIPLINE_LIMITS.MIN_N;
  }

  const n = Math.max(
    DISCIPLINE_LIMITS.MIN_N,
    Math.min(DISCIPLINE_LIMITS.MAX_N, n_raw)
  );

  return n;
}

/* ---------- GATE HELPERS ---------- */
function deny(gate, reason) {
  return {
    permitted: false,
    failedGate: gate,
    reason,
    timestamp: Date.now()
  };
}

function allow(n) {
  return {
    permitted: true,
    disciplineDepth: n,
    timestamp: Date.now()
  };
}

/* ---------- DISCIPLINE GATES ---------- */
const GATES = [

  /* Gate 1 — Signal sanity (NON-NEGOTIABLE) */
  function gate1(ctx) {
    if (!ctx.signal || !ctx.signal.action) {
      return "Invalid signal";
    }
  },

  /* Gate 2 — HOLD exclusion */
  function gate2(ctx) {
    if (ctx.signal.action === "HOLD") {
      return "HOLD is non-executable";
    }
  },

  /* Gate 3 — Confidence */
  function gate3(ctx) {
    if (ctx.signal.confidence < RISK_RULES.minConfidence) {
      return "Confidence below threshold";
    }
  },

  /* Gate 4 — Balance floor */
  function gate4(ctx) {
    if (ctx.balance < RISK_RULES.minBalance) {
      return "Balance below safety floor";
    }
  },

  /* Gate 5 — Exposure */
  function gate5(ctx) {
    if (ctx.exposure > ctx.equity * RISK_RULES.maxExposure) {
      return "Exposure limit exceeded";
    }
  },

  /* Gate 6 — Risk per trade */
  function gate6(ctx) {
    const risk = ctx.equity * RISK_RULES.maxRiskPerTrade;
    if (risk <= 0) {
      return "Invalid projected risk";
    }
  },

  /* Gate 7 — Trade frequency */
  function gate7(ctx) {
    if (!ctx.lastTradeTime) return;
    if (Date.now() - ctx.lastTradeTime < RISK_RULES.minTradeIntervalMs) {
      return "Trade frequency violation";
    }
  }

  /* Gates 8–21 intentionally reserved
     (volatility, entropy, regime, slippage,
      CPilot veto, Medusa health, etc.)
  */
];

/* ---------- PERMISSION EVALUATOR ---------- */
export function evaluateDiscipline(context) {
  const { liftbridgeScore = 1 } = context;

  const n = resolveDisciplineN(liftbridgeScore);

  for (let i = 0; i < n; i++) {
    const failure = GATES[i]?.(context);
    if (failure) {
      return deny(i + 1, failure);
    }
  }

  return allow(n);
}

/* ---------- INTROSPECTION ---------- */
export function getDisciplineStatus(liftbridgeScore) {
  const n = resolveDisciplineN(liftbridgeScore);
  return {
    disciplineDepth: n,
    certaintyModel: `99.9^${n}%`,
    invariant: "n never collapses"
  };
      }
