/* ================================
   MARKET PRICE STUB (SIMULATION)
   ================================ */

function getMarketPrice(asset) {
  const basePrices = {
    BTC: 50000000,   // ₦50m
    ETH: 3000000,    // ₦3m
    EURUSD: 1600
  };

  const base = basePrices[asset] || 1000;
  const variance = (Math.random() - 0.5) * 0.05; // ±5%
  return +(base * (1 + variance)).toFixed(2);
}

/* ================================
   SIMULATION ENGINE
   ================================ */

const SimulationEngine = {
  balance: 0,
  positions: [],

  init(demoBalance = 100000) {
    this.balance = demoBalance;
    this.positions = [];
    this.render();
  },

  buy(asset, amount) {
    const price = getMarketPrice(asset);
    const cost = amount * price;

    if (cost > this.balance) {
      alert("Insufficient demo balance");
      return;
    }

    this.balance -= cost;

    this.positions.push({
      asset,
      amount,
      entryPrice: price
    });

    this.render();
  },

  sell(index) {
    const position = this.positions[index];
    const exitPrice = getMarketPrice(position.asset);
    const proceeds = position.amount * exitPrice;
    const pnl = proceeds - (position.amount * position.entryPrice);

    this.balance += proceeds;
    this.positions.splice(index, 1);

    this.render();
    this.logPnL(pnl);
  },

  render() {
    const bal = document.getElementById("balance");
    const list = document.getElementById("positions");

    if (bal) bal.innerText = this.balance.toFixed(2);
    if (!list) return;

    list.innerHTML = "";

    this.positions.forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.asset} | ${p.amount} @ ₦${p.entryPrice}
        <button onclick="SimulationEngine.sell(${i})">Close</button>
      `;
      list.appendChild(li);
    });
  },

  logPnL(pnl) {
    console.log(
      pnl >= 0
        ? `✅ Profit: ₦${pnl.toFixed(2)}`
        : `❌ Loss: ₦${pnl.toFixed(2)}`
    );
  }
};

// Simulation Engine (uses getMarketPrice)
const SimulationEngine = {
  balance: 0,
  positions: [],
  ...
}

const SimulationEngine = {
  balance: 0,
  positions: [],

  init(demoBalance) {
    this.balance = demoBalance;
    this.positions = [];
    this.render();
  },

  buy(asset, amount, price) {
    const cost = amount * price;
    if (cost > this.balance) {
      alert("Insufficient demo balance");
      return;
    }

    this.balance -= cost;

    this.positions.push({
      asset,
      amount,
      entryPrice: price,
      type: "BUY"
    });

    this.render();
  },

  sell(index, price) {
    const position = this.positions[index];
    const proceeds = position.amount * price;
    const pnl = proceeds - (position.amount * position.entryPrice);

    this.balance += proceeds;
    this.positions.splice(index, 1);

    this.render();
    this.showPnL(pnl);
  },

  render() {
    document.getElementById("balance").innerText = this.balance.toFixed(2);
    this.renderPositions();
  },

  renderPositions() {
    const list = document.getElementById("positions");
    list.innerHTML = "";

    this.positions.forEach((pos, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${pos.asset} | ${pos.amount} @ ${pos.entryPrice}
        <button onclick="SimulationEngine.sell(${i}, getMarketPrice('${pos.asset}'))">
          Close
        </button>
      `;
      list.appendChild(li);
    });
  },

  showPnL(pnl) {
    const msg = pnl >= 0 ? `Profit: ₦${pnl}` : `Loss: ₦${pnl}`;
    console.log(msg);
  }
};
