// cpilot_ready.js — AutoTrader wiring
(function(){

  const cpilotSection = document.querySelector("#cpilot-container") || document.querySelector("main");

  // Inject CPilot interface
  cpilotSection.insertAdjacentHTML("beforeend", `
    <section class="section" id="cpilot-interface">
      <h2>Auto Take-Profit Timing</h2>
      <div class="radio-group" id="tp-time-group">
        ${["15s","30s","60s","120s","180s","240s","300s","10m","15m","20m","30m","1h","12h","24h","48h","72h","5d","7d"]
          .map(tp => `<label><input type="radio" name="tp-time" value="${tp}" ${tp==="15s"?"checked":""}> ${tp}</label>`).join('')}
      </div>
      <section class="section">
        <h2>CPilot Controls</h2>
        <button class="btn-primary" id="start-autotrade-btn" disabled>Start Auto Trading</button>
        <button class="btn-secondary" id="stop-autotrade-btn" disabled>Stop Auto Trading</button>
      </section>
      <section class="section">
        <h2>Simulation Monitor</h2>
        <div class="panel" id="sim-monitor">
          <p>Step logs will appear here once Auto Trading is activated.</p>
        </div>
      </section>
    </section>
  `);

  const startBtn = document.getElementById("start-autotrade-btn");
  const stopBtn = document.getElementById("stop-autotrade-btn");
  const tpRadios = document.querySelectorAll('input[name="tp-time"]');
  const simMonitor = document.getElementById("sim-monitor");

  // Helper to get selected TP timing
  function getSelectedTP(){
    return Array.from(tpRadios).find(r=>r.checked)?.value;
  }

  // Refresh button state based on CPilot unlock
  function refreshCPilotUI(){
    if(AppState.cPilot.qualified){
      startBtn.disabled = false;
      stopBtn.disabled = false;
    } else {
      startBtn.disabled = true;
      stopBtn.disabled = true;
    }
  }
  refreshCPilotUI();
  setInterval(refreshCPilotUI, 1000);

  // AutoTrader simulation object
  let autoTraderInterval = null;

  // Start AutoTrading
  startBtn.addEventListener("click", ()=>{
    if(autoTraderInterval) return; // prevent multiple starts
    const tp = getSelectedTP();
    const timestamp = new Date().toLocaleTimeString();
    simMonitor.innerHTML += `<p>[${timestamp}] AutoTrading started with TP=${tp}</p>`;
    simMonitor.scrollTop = simMonitor.scrollHeight;

    // Simulated AutoTrader execution (every TP interval)
    const ms = parseTPtoMs(tp);
    autoTraderInterval = setInterval(()=>{
      const now = new Date().toLocaleTimeString();
      simMonitor.innerHTML += `<p>[${now}] AutoTrader step executed at TP=${tp}</p>`;
      simMonitor.scrollTop = simMonitor.scrollHeight;
    }, ms);
  });

  // Stop AutoTrading
  stopBtn.addEventListener("click", ()=>{
    if(autoTraderInterval){
      clearInterval(autoTraderInterval);
      autoTraderInterval = null;
      const now = new Date().toLocaleTimeString();
      simMonitor.innerHTML += `<p>[${now}] AutoTrading stopped</p>`;
      simMonitor.scrollTop = simMonitor.scrollHeight;
    }
  });

  // Convert TP string to milliseconds
  function parseTPtoMs(tp){
    if(tp.endsWith('s')) return parseInt(tp)*1000;
    if(tp.endsWith('m')) return parseInt(tp)*60*1000;
    if(tp.endsWith('h')) return parseInt(tp)*60*60*1000;
    if(tp.endsWith('d')) return parseInt(tp)*24*60*60*1000;
    return 15000; // default 15s
  }

})();

// core/js/cpilot_ready.js

import SignalObject from './signalObject.js';

/**
 * CPilot Core Controller
 * Builds, evaluates, and monitors trading signals
 */

const CPilot = {

  signal: SignalObject,

  init(config = {}) {
    this.signal.reset();
    this.signal.generateId();

    if (config.mode) this.signal.mode = config.mode;
    if (config.tpTiming) this.signal.tpTiming = config.tpTiming;
    if (config.marketGuidance) this.signal.marketGuidance = config.marketGuidance;

    return this.signal.snapshot();
  },

  ingestMarketData(marketData = {}) {
    const {
      rsi,
      macd,
      emaTrend,
      liquidity,
      volatility,
      momentum
    } = marketData;

    this.signal.updateIndicators({
      rsi,
      macd,
      emaTrend,
      liquidity
    });

    if (volatility !== undefined) this.signal.volatility = volatility;
    if (momentum !== undefined) this.signal.momentum = momentum;

    this.deriveDirection();
    this.deriveConfidence();
    this.signal.evaluateRisk();

    return this.signal.snapshot();
  },

  deriveDirection() {
    const { rsi, macd, emaTrend } = this.signal.indicators;

    if (rsi > 55 && macd === 'bullish' && emaTrend === 'up') {
      this.signal.setDirection('BUY');
    } 
    else if (rsi < 45 && macd === 'bearish' && emaTrend === 'down') {
      this.signal.setDirection('SELL');
    } 
    else {
      this.signal.direction = null;
    }
  },

  deriveConfidence() {
    let score = 0;

    const { rsi, macd, emaTrend, liquidity } = this.signal.indicators;

    if (macd === 'bullish' || macd === 'bearish') score += 25;
    if (emaTrend === 'up' || emaTrend === 'down') score += 25;
    if (liquidity === 'high') score += 20;

    if (rsi >= 50 && rsi <= 60) score += 15;
    if (this.signal.volatility < 40) score += 15;

    this.signal.setConfidence(score);
  },

  armSignalMonitoring() {
    if (!this.signal.direction) return null;

    this.signal.armMonitor();
    return this.signal.snapshot();
  },

  getSignal() {
    return this.signal.snapshot();
  },

  resetSignal() {
    this.signal.reset();
    return true;
  }
};

export default CPilot;

// inside cpilot_ready.js

function ingestMarketTick(tick) {
  if (!currentSignal) return;

  // example logic — transparent & explainable
  if (tick.momentum > 0.5) {
    currentSignal.direction = 'BUY';
    currentSignal.confidence = 70;
  } else if (tick.momentum < -0.5) {
    currentSignal.direction = 'SELL';
    currentSignal.confidence = 70;
  } else {
    currentSignal.direction = 'HOLD';
    currentSignal.confidence = 40;
  }

  currentSignal.status = 'SIMULATING';
  currentSignal.lastTick = tick;
}

export default {
  init,
  snapshot,
  resetSignal,
  ingestMarketTick
};
