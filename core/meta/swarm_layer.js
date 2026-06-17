// ======================================================
// STAGE 14 — PRODUCTION SWARM CONSENSUS LAYER
// QuantumTrader-AI
// ======================================================

export class MetaBrainNode {
constructor(id, evaluator) {
this.id = id;
this.evaluator = evaluator;

this.bias = {
  trend: (Math.random() - 0.5) * 0.05,
  volatility: (Math.random() - 0.5) * 0.05
};

}

evaluate(signal) {

const mutated = {
  ...signal,

  trendStrength:
    (signal.trendStrength ?? 0) +
    this.bias.trend,

  volatility:
    (signal.volatility ?? 0) +
    this.bias.volatility
};

try {
  return this.evaluator(mutated);
} catch (err) {
  return {
    action: "HOLD",
    confidence: 0,
    score: 0,
    nodeId: this.id,
    error: err.message
  };
}

}
}

// ======================================================
// CONSENSUS ENGINE
// ======================================================

export class ConsensusEngine {

constructor(nodes = []) {
this.nodes = nodes;
}

evaluate(signal) {

const results =
  this.nodes.map(node =>
    node.evaluate(signal)
  );

let buyVotes = 0;
let sellVotes = 0;
let holdVotes = 0;

let confidenceTotal = 0;

for (const result of results) {

  confidenceTotal +=
    result.confidence ?? 0;

  switch (result.action) {

    case "BUY":
      buyVotes++;
      break;

    case "SELL":
      sellVotes++;
      break;

    default:
      holdVotes++;
  }
}

const total =
  results.length || 1;

const consensus =
  Math.max(
    buyVotes,
    sellVotes,
    holdVotes
  ) / total;

const action =
  buyVotes > sellVotes &&
  buyVotes > holdVotes
    ? "BUY"
    : sellVotes > buyVotes &&
      sellVotes > holdVotes
    ? "SELL"
    : "HOLD";

return {

  action,

  consensus,

  averageConfidence:
    confidenceTotal / total,

  buyVotes,
  sellVotes,
  holdVotes,

  totalNodes: total,

  rawResults: results
};

}
}

// ======================================================
// RISK ARBITER
// ======================================================

export class RiskArbiter {

validate(consensus) {

const issues = [];

if (consensus.consensus < 0.50) {
  issues.push("LOW_CONSENSUS");
}

if (consensus.averageConfidence < 0.25) {
  issues.push("LOW_CONFIDENCE");
}

return {
  allowed: issues.length === 0,
  issues
};

}
}

// ======================================================
// SWARM CONSENSUS LAYER
// ======================================================

export class SwarmConsensusLayer {

constructor(
evaluator,
size = 5
) {

this.nodes =
  Array.from(
    { length: size },
    (_, index) =>
      new MetaBrainNode(
        `swarm-node-${index}`,
        evaluator
      )
  );

this.consensusEngine =
  new ConsensusEngine(
    this.nodes
  );

this.riskArbiter =
  new RiskArbiter();

}

evaluate(signal) {

const consensus =
  this.consensusEngine.evaluate(signal);

const risk =
  this.riskArbiter.validate(
    consensus
  );

return {

  action:
    risk.allowed
      ? consensus.action
      : "HOLD",

  consensus:
    consensus.consensus,

  confidence:
    consensus.averageConfidence,

  buyVotes:
    consensus.buyVotes,

  sellVotes:
    consensus.sellVotes,

  holdVotes:
    consensus.holdVotes,

  totalNodes:
    consensus.totalNodes,

  allowed:
    risk.allowed,

  issues:
    risk.issues,

  raw:
    consensus.rawResults
};

}
  }
