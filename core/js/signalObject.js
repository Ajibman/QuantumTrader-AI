// core/js/signalObject.js

const SignalObject = {
  id: null,
  timestamp: null,

  mode: 'Manual', // Manual | Auto
  tpTiming: '15s', // 15s | 30s
  marketGuidance: 'neutral', // favorable | caution | unfavorable

  direction: null, // BUY | SELL
  confidence: 0, // 0 – 100
  volatility: 0, // 0 – 100
  momentum: 0, // 0 – 100

  riskProfile: {
    exposure: 'low', // low | medium | high
    stopLoss: null,
    takeProfit: null
  },

  indicators: {
    rsi: null,
    macd: null,
    emaTrend: null,
    liquidity: null
  },

  monitor: {
    active: false,
    lastUpdate: null
  },

  generateId() {
    this.id = `SIG-${Date.now()}`;
    this.timestamp = new Date().toISOString();
  },

  setDirection(dir) {
    if (dir === 'BUY' || dir === 'SELL') {
      this.direction = dir;
    }
  },

  setConfidence(value) {
    this.confidence = Math.max(0, Math.min(100, value));
  },

  updateIndicators(data = {}) {
    this.indicators = { ...this.indicators, ...data };
  },

  evaluateRisk() {
    if (this.confidence > 70 && this.volatility < 40) {
      this.riskProfile.exposure = 'high';
    } else if (this.confidence > 40) {
      this.riskProfile.exposure = 'medium';
    } else {
      this.riskProfile.exposure = 'low';
    }
  },

  armMonitor() {
    this.monitor.active = true;
    this.monitor.lastUpdate = Date.now();
  },

  snapshot() {
    return JSON.parse(JSON.stringify(this));
  },

  reset() {
    Object.assign(this, {
      id: null,
      timestamp: null,
      direction: null,
      confidence: 0,
      volatility: 0,
      momentum: 0,
      riskProfile: {
        exposure: 'low',
        stopLoss: null,
        takeProfit: null
      },
      indicators: {
        rsi: null,
        macd: null,
        emaTrend: null,
        liquidity: null
      },
      monitor: {
        active: false,
        lastUpdate: null
      }
    });
  }
};

export default SignalObject;
