// Practice TradingFloor Engine
// Generates controlled price updates and trade hints
// Does NOT modify layout or create new UI structures

document.addEventListener("DOMContentLoaded", () => {

  const tfModule = document.getElementById("tradingfloor");
  if (!tfModule) return; // Safety check

  // Create a small info bar below the trading floor image
  const feedBox = document.createElement("div");
  feedBox.style.marginTop = "15px";
  feedBox.style.fontSize = "14px";
  feedBox.style.fontWeight = "bold";
  feedBox.style.color = "#222";
  feedBox.style.minHeight = "24px";
  feedBox.textContent = "TradingFloor initialized (practice mode).";

  tfModule.appendChild(feedBox);

  // Assets for practice
  const assets = ["BTC/USD", "ETH/USD", "GOLD", "OIL", "S&P 500"];

  function randomAsset() {
    return assets[Math.floor(Math.random() * assets.length)];
  }

  function randomPrice() {
    // Generates a smooth, believable price range
    return (Math.random() * (40000 - 1200) + 1200).toFixed(2);
  }

  function randomHint() {
    const hints = [
      "Liquidity sweep forming...",
      "Possible breakout structure...",
      "Order block interaction detected...",
      "High-timeframe bias aligning...",
      "Volatility expansion probable...",
      "Fair value gap reaction likely...",
      "Trend weakening, watch closely...",
      "Institutional flow stabilizing..."
    ];
    return hints[Math.floor(Math.random() * hints.length)];
  }

  // Update feed every 4 seconds, ONLY when TradingFloor is visible
  setInterval(() => {
    if (tfModule.style.display !== "none") {
      const asset = randomAsset();
      const price = randomPrice();
      const hint = randomHint();

      feedBox.textContent = `${asset} → $${price} | ${hint}`;
    }
  }, 4000);

});
