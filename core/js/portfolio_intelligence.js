/**

* =====================================================
* QuantumTrader-AI
* STAGE 23 — PORTFOLIO INTELLIGENCE LAYER
* =====================================================
* 
* Responsibilities:
* - Portfolio state management
* - Position tracking
* - Exposure tracking
* - Asset allocation analysis
* - Realized PnL tracking
* - Unrealized PnL tracking
* - Risk concentration monitoring
* - Portfolio health scoring
* 
* MetaBrain decides trades.
* Portfolio Intelligence decides
* portfolio condition.
* =====================================================
  */

export class PortfolioIntelligence {

constructor() {

this.positions = new Map();

this.metrics = {

  totalExposure: 0,

  realizedPnL: 0,

  unrealizedPnL: 0,

  totalTrades: 0,

  winningTrades: 0,

  losingTrades: 0
};

}

// =====================================================
// OPEN / UPDATE POSITION
// =====================================================

updatePosition({
symbol,
assetClass = "UNKNOWN",
quantity = 0,
entryPrice = 0,
marketPrice = 0
}) {

const position = {

  symbol,

  assetClass,

  quantity,

  entryPrice,

  marketPrice,

  marketValue:
    quantity * marketPrice,

  unrealizedPnL:
    (marketPrice - entryPrice)
    * quantity,

  updatedAt:
    Date.now()
};

this.positions.set(
  symbol,
  position
);

this.recalculate();

return position;

}

// =====================================================
// CLOSE POSITION
// =====================================================

closePosition(symbol) {

const position =
  this.positions.get(symbol);

if (!position) {
  return null;
}

this.metrics.realizedPnL +=
  position.unrealizedPnL;

this.metrics.totalTrades++;

if (
  position.unrealizedPnL >= 0
) {
  this.metrics.winningTrades++;
} else {
  this.metrics.losingTrades++;
}

this.positions.delete(symbol);

this.recalculate();

return position;

}

// =====================================================
// RECALCULATE PORTFOLIO
// =====================================================

recalculate() {

let exposure = 0;
let unrealized = 0;

for (
  const position
  of this.positions.values()
) {

  exposure +=
    position.marketValue;

  unrealized +=
    position.unrealizedPnL;
}

this.metrics.totalExposure =
  exposure;

this.metrics.unrealizedPnL =
  unrealized;

}

// =====================================================
// POSITION LOOKUPS
// =====================================================

getPosition(symbol) {

return this.positions.get(symbol);

}

getPositions() {

return [
  ...this.positions.values()
];

}

// =====================================================
// ALLOCATION ANALYSIS
// =====================================================

allocation() {

const result = {};

const total =
  this.metrics.totalExposure;

if (total <= 0) {
  return result;
}

for (
  const position
  of this.positions.values()
) {

  const key =
    position.assetClass;

  result[key] =
    (result[key] || 0)
    + position.marketValue;
}

for (
  const key
  of Object.keys(result)
) {

  result[key] =
    result[key] / total;
}

return result;

}

// =====================================================
// CONCENTRATION RISK
// =====================================================

concentrationRisk() {

const total =
  this.metrics.totalExposure;

if (total <= 0) {
  return 0;
}

let largest = 0;

for (
  const position
  of this.positions.values()
) {

  largest = Math.max(
    largest,
    position.marketValue
  );
}

return largest / total;

}

// =====================================================
// WIN RATE
// =====================================================

winRate() {

const trades =
  this.metrics.totalTrades;

if (trades === 0) {
  return 0;
}

return (
  this.metrics.winningTrades /
  trades
);

}

// =====================================================
// PORTFOLIO HEALTH
// =====================================================

healthScore() {

let score = 100;

const concentration =
  this.concentrationRisk();

if (concentration > 0.50) {
  score -= 20;
}

if (
  this.metrics.unrealizedPnL < 0
) {
  score -= 10;
}

if (
  this.winRate() < 0.40
) {
  score -= 10;
}

return Math.max(
  0,
  Math.min(100, score)
);

}

// =====================================================
// SUMMARY
// =====================================================

summary() {

return {

  positions:
    this.positions.size,

  totalExposure:
    this.metrics.totalExposure,

  realizedPnL:
    this.metrics.realizedPnL,

  unrealizedPnL:
    this.metrics.unrealizedPnL,

  winRate:
    this.winRate(),

  concentrationRisk:
    this.concentrationRisk(),

  healthScore:
    this.healthScore(),

  allocation:
    this.allocation()
};

}
}
