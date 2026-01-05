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
