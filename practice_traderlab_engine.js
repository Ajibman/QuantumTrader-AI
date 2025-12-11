// practice_traderlab_engine.js
// Practice-Mode TraderLab Engine for QuantumTrader-AI

(function() {
  const TRADERLAB = document.getElementById("traderlab");
  if (!TRADERLAB) {
    console.warn("TraderLab container not found.");
    return;
  }

  const STORAGE_KEY = "qtai_traderlab_practice";
  const instruments = ["BTC", "ETH", "SOL"];
  const trends = ["Uptrend", "Downtrend", "Stable"];
  const priceFeeds = {
    BTC: [60000, 60100, 59950, 60050, 60120, 60080, 60200],
    ETH: [4200, 4210, 4195, 4205, 4215, 4208, 4220],
    SOL: [120, 121, 119.5, 120.5, 121.2, 120.8, 122]
  };

  let state = {
    tradeHistory: [],
    openPositions: [],
    selectedInstrument: "BTC",
    feedIndex: 0,
    feedRunning: false
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = JSON.parse(raw);
    } catch(e) {
      console.warn("Failed to load TraderLab practice state", e);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // --- DOM Setup ---
  function initDOM() {
    if (TRADERLAB.querySelector(".traderlab-practice")) return;

    const html = `
      <div class="traderlab-practice" style="padding:12px;margin-top:10px;background:#f9f9f9;border-radius:6px;">
        <label><strong>Instrument:</strong>
          <select id="tl-instrument" style="margin-left:8px;padding:6px;border-radius:4px;">
            <option>BTC</option><option>ETH</option><option>SOL</option>
          </select>
        </label>
        <label style="margin-left:12px;"><strong>Qty:</strong>
          <input type="number" id="tl-qty" value="0.01" min="0.0001" step="0.0001" style="width:80px;margin-left:6px;padding:6px;border-radius:4px;" />
        </label>
        <button id="tl-simulate" style="margin-left:12px;padding:6px 12px;background:#007acc;color:#fff;border:none;border-radius:4px;cursor:pointer;">Simulate Trade</button>
        <div style="margin-top:10px;font-size:14px;">Current Price: <span id="tl-price">—</span></div>
        <div style="margin-top:10px;font-weight:bold;" id="tl-result"></div>
        <hr style="margin:10px 0"/>
        <h4 style="margin:6px 0;">Open Positions</h4>
        <div id="tl-positions" style="min-height:50px;background:#fff;padding:6px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.1);"></div>
        <h4 style="margin:6px 0;">Trade History</h4>
        <div id="tl-history" style="min-height:50px;background:#fff;padding:6px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.1);"></div>
      </div>
    `;
    TRADERLAB.insertAdjacentHTML("beforeend", html);

    $("#tl-instrument").value = state.selectedInstrument;
  }

  // --- Helpers ---
  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }
  function formatNum(n) { return (Math.round(n*100)/100).toLocaleString(); }

  function getCurrentPrice() {
    const feed = priceFeeds[state.selectedInstrument];
    if (!feed) return 0;
    state.feedIndex = (state.feedIndex + 1) % feed.length;
    return feed[state.feedIndex];
  }

  function simulateTrade(instrument, qty) {
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const action = trend === "Uptrend" ? "Buy" : trend === "Downtrend" ? "Sell" : "Hold";
    const price = getCurrentPrice();
    return { trend, action, price, instrument, qty };
  }

  // --- Position Management ---
  function enterPosition(trade) {
    const pos = {
      id: "pos_" + Date.now(),
      ...trade,
      timestamp: new Date().toISOString()
    };
    state.openPositions.push(pos);
    saveState();
    renderPositions();
  }

  function closePosition(posId) {
    const idx = state.openPositions.findIndex(p => p.id === posId);
    if (idx === -1) return;
    const pos = state.openPositions[idx];
    const closePrice = getCurrentPrice();
    const pnl = (pos.action === "Buy" ? (closePrice - pos.price) : (pos.price - closePrice)) * pos.qty;
    state.openPositions.splice(idx, 1);
    state.tradeHistory.unshift({ ...pos, closePrice, pnl });
    saveState();
    renderPositions();
    renderHistory();
  }

  // --- Rendering ---
  function renderPositions() {
    const container = $("#tl-positions");
    if (!container) return;
    if (!state.openPositions.length) {
      container.innerHTML = `<div style="color:#666">No open positions</div>`;
      return;
    }
    container.innerHTML = state.openPositions.map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:4px;border-bottom:1px solid #eee">
        <div>${p.instrument} • ${p.action} • ${p.qty} @ ${formatNum(p.price)}</div>
        <button data-close="${p.id}" style="padding:4px 6px;border:none;background:#c83b3b;color:#fff;border-radius:4px;cursor:pointer">Close</button>
      </div>
    `).join("");

    $all("button[data-close]", container).forEach(btn => {
      btn.onclick = () => closePosition(btn.getAttribute("data-close"));
    });
  }

  function renderHistory() {
    const container = $("#tl-history");
    if (!container) return;
    if (!state.tradeHistory.length) {
      container.innerHTML = `<div style="color:#666">No trades yet</div>`;
      return;
    }
    container.innerHTML = state.tradeHistory.slice(0,20).map(tx => `
      <div style="padding:4px;border-bottom:1px solid #eee;font-size:13px;">
        ${tx.instrument} ${tx.action} ${tx.qty} @ ${formatNum(tx.price)} | P/L: ${tx.pnl ? formatNum(tx.pnl) : 0}
      </div>
    `).join("");
  }

  function updatePriceDisplay() {
    const priceEl = $("#tl-price");
    if (priceEl) priceEl.textContent = formatNum(getCurrentPrice());
  }

  // --- Controls ---
  function wireControls() {
    const simBtn = $("#tl-simulate");
    const instrumentSelect = $("#tl-instrument");
    const qtyInput = $("#tl-qty");

    if (instrumentSelect) instrumentSelect.onchange = () => {
      state.selectedInstrument = instrumentSelect.value;
      state.feedIndex = 0;
      saveState();
      updatePriceDisplay();
      renderPositions();
    };

    if (simBtn) simBtn.onclick = () => {
      const qty = Number(qtyInput.value);
      if (!qty || qty <= 0) { alert("Enter a valid quantity."); return; }
      const trade = simulateTrade(state.selectedInstrument, qty);
      $("#tl-result").textContent = `Trend: ${trade.trend} | Suggested: ${trade.action} | Price: ${formatNum(trade.price)}`;
      if (trade.action !== "Hold") enterPosition(trade);
      updatePriceDisplay();
    };
  }

  // --- Initialization ---
  function init() {
    loadState();
    initDOM();
    wireControls();
    renderPositions();
    renderHistory();
    updatePriceDisplay();
  }

  init();

})();
