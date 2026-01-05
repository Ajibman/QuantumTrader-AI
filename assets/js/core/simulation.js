 // --- APP STATES ---
const APP_STATE = {
  TRAINING: 'training',
  SIMULATION: 'simulation',
  CONFIDENCE: 'confidence',
  EXECUTION_LOCKED: 'execution_locked',
  EXECUTION_UNLOCKED: 'execution_unlocked',
};
APP_STATE.current = APP_STATE.SIMULATION;

// --- SIMULATION STATS ---
const simulationStats = {
  trades: 0,
  wins: 0,
  losses: 0,
  equityStart: 10000,
  equityCurrent: 10000,
  maxDrawdown: 0,
  sessionStart: Date.now(),
};

// --- CHART STATE ---
const ChartState = {
  prices: [],
  equity: [],
};

// --- MARKET PRICE STUB ---
function getMarketPrice(asset = 'BTC') {
  const basePrices = { BTC: 50000000, ETH: 3000000, EURUSD: 1600 };
  const base = basePrices[asset] || 1000;
  const variance = (Math.random() - 0.5) * 0.05; // ±5%
  return +(base * (1 + variance)).toFixed(2);
}

// --- TEST TRADE EXECUTION ---
function executeTestTrade(type) {
  const price = getMarketPrice();
  const size = 1; // fixed demo unit
  simulationStats.trades++;

  const outcome = simulateOutcome(type, price);
  simulationStats.equityCurrent += outcome.pnl;

  updateDrawdown();
  addReflection(
    outcome.pnl >= 0
      ? `You gained ₦${outcome.pnl.toFixed(2)}. Observe the trend.`
      : `You lost ₦${Math.abs(outcome.pnl).toFixed(2)}. Watch the RSI.`
  );

  updateConfidence();
  checkConfidenceUnlock();
}

// --- SIMULATE TRADE OUTCOME ---
function simulateOutcome(type, entryPrice) {
  const move = (Math.random() - 0.5) * 2; // small demo swings
  const pnl = move * 50; // fixed demo scale
  return { pnl };
}

// --- DRAWDOWN TRACKING ---
function updateDrawdown() {
  const peak = Math.max(simulationStats.equityCurrent, simulationStats.equityStart);
  const dd = ((peak - simulationStats.equityCurrent) / peak) * 100;
  simulationStats.maxDrawdown = Math.max(simulationStats.maxDrawdown, dd);
}

// --- CONFIDENCE METER ---
function updateConfidence() {
  const percent = Math.min(Math.floor((simulationStats.trades / 30) * 100), 100);
  document.getElementById('confidencePercent').innerText = percent + '%';
  document.getElementById('confidenceFill').style.width = percent + '%';
}

// --- REFLECTION LOG ---
function addReflection(message) {
  const list = document.getElementById('reflectionList');
  const li = document.createElement('li');
  li.innerText = message;
  list.appendChild(li);
}

// --- MA + RSI CHARTS ---
function simulationTick(asset = 'BTC') {
  const price = getMarketPrice(asset);
  ChartState.prices.push(price);
  if (ChartState.prices.length > 30) ChartState.prices.shift();

  const ma = calculateMA(ChartState.prices, 5);
  drawLineChart('priceChart', ChartState.prices, ma);

  const rsi = calculateRSI(ChartState.prices);
  drawRSI(rsi);
}

// --- MOVING AVERAGE ---
function calculateMA(data, period = 5) {
  if (data.length < period) return null;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

// --- RSI ---
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  const rsVal = gains / losses;
  return 100 - 100 / (1 + rsVal);
}

// --- DRAW LINE CHART WITH MA ---
function drawLineChart(canvasId, data, maValue = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || data.length < 2) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;

  // Price Line
  ctx.beginPath();
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 2;
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * canvas.width;
    const y = canvas.height - ((val - min) / range) * canvas.height;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // MA Overlay
  if (maValue) {
    const y = canvas.height - ((maValue - min) / range) * canvas.height;
    ctx.beginPath();
    ctx.strokeStyle = '#ffd54f';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// --- DRAW RSI CHART ---
function drawRSI(rsi) {
  const canvas = document.getElementById('rsiChart');
  if (!canvas || rsi === null) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Levels
  [30, 70].forEach(level => {
    const y = canvas.height - (level / 100) * canvas.height;
    ctx.strokeStyle = '#555';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  });

  const y = canvas.height - (rsi / 100) * canvas.height;
  ctx.fillStyle = rsi > 70 ? '#ff5252' : rsi < 30 ? '#69f0ae' : '#42a5f5';
  ctx.fillRect(0, y, canvas.width, canvas.height - y);
}

// --- CONFIDENCE UNLOCK CHECK ---
function checkConfidenceUnlock() {
  const pnlPercent = ((simulationStats.equityCurrent - simulationStats.equityStart) / simulationStats.equityStart) * 100;
  const sessionDuration = (Date.now() - simulationStats.sessionStart) / (1000 * 60);

  if (simulationStats.trades >= 30 &&
      pnlPercent >= -5 &&
      simulationStats.maxDrawdown <= 10 &&
      sessionDuration >= 20 &&
      APP_STATE.current !== APP_STATE.EXECUTION_UNLOCKED) {
    unlockExecution();
  }
}

// --- UNLOCK EXECUTION TOOLS ---
function unlockExecution() {
  APP_STATE.current = APP_STATE.EXECUTION_UNLOCKED;
  localStorage.setItem('executionUnlocked', 'true');
  console.log('Execution tools unlocked');

  // Optionally reveal indicator panel in UI
  const panel = document.getElementById('indicatorPanel');
  if(panel) panel.style.display = 'block';
}

// --- SIMULATION LOOP (optional) ---
setInterval(() => {
  simulationTick('BTC');
}, 2000);

<div id="liveTradeSection">
  <button id="proceedLiveBtn" disabled onclick="requestLiveTrading()">
    Proceed to Live Trading
  </button>

  <p id="liveTradeHint" style="font-size: 0.9em; opacity: 0.7;">
    Available once confidence is sufficient. Training can continue anytime.
  </p>
</div>

function requestLiveTrading() {
  const confirmed = confirm(
    "You are about to proceed to live trading.\n\n" +
    "• Monthly subscription: ₦10,000\n" +
    "• Training remains available\n" +
    "• No automatic trades will be placed\n\n" +
    "Do you wish to continue?"
  );

  if (!confirmed) {
    addReflection("You chose to continue training. No changes were made.");
    return;
  }

  checkSubscriptionStatus();
}
