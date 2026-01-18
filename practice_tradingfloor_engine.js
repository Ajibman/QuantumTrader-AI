 // Enhanced Practice TradingFloor Engine
// Realistic market feed: smoother prices, micro-trends, momentum changes, volatility pulses

document.addEventListener("DOMContentLoaded", () => {

  const tfModule = document.getElementById("tradingfloor");
  if (!tfModule) return;

  // Create feed box (clean, small, no layout interference)
  const feedBox = document.createElement("div");
  feedBox.style.marginTop = "15px";
  feedBox.style.fontSize = "14px";
  feedBox.style.fontWeight = "bold";
  feedBox.style.color = "#222";
  feedBox.style.minHeight = "24px";
  feedBox.textContent = "TradingFloor (practice engine ready).";

  tfModule.appendChild(feedBox);

  // Asset list
  const assets = ["BTC/USD", "ETH/USD", "GOLD", "OIL", "S&P 500"];

  // Internal engine state
  let selectedAsset = assets[Math.floor(Math.random() * assets.length)];
  let price = randomBasePrice(selectedAsset);
  let trend = "Neutral";
  let momentum = 0;
  let volatility = 1;

  // Generate realistic starting price
  function randomBasePrice(asset) {
    switch (asset) {
      case "BTC/USD": return 41000 + Math.random() * 2000;
      case "ETH/USD": return 2500 + Math.random() * 200;
      case "GOLD":    return 1900 + Math.random() * 40;
      case "OIL":     return 75 + Math.random() * 5;
      case "S&P 500": return 5100 + Math.random() * 30;
      default: return 1000 + Math.random() * 100;
    }
  }

  // Determine trend label
  function trendLabel(mom) {
    if (mom > 0.6) return "Strong Uptrend";
    if (mom > 0.2) return "Mild Uptrend";
    if (mom < -0.6) return "Strong Downtrend";
    if (mom < -0.2) return "Mild Downtrend";
    return "Neutral";
  }

  // Market hint generator
  function marketHint(t) {
    if (t.includes("Strong Uptrend")) return "Momentum building — buyers dominant.";
    if (t.includes("Mild Uptrend"))   return "Buyers slightly in control.";
    if (t.includes("Strong Downtrend")) return "Selling pressure intensifying.";
    if (t.includes("Mild Downtrend"))   return "Market leaning bearish.";
    return "Market undecided — wait for clarity.";
  }

  // Main practice feed update
  function updateFeed() {

    if (tfModule.style.display === "none") return;

    // Random volatility pulses
    if (Math.random() < 0.05) {
      volatility = (Math.random() * 3) + 1;
    }

    // Momentum change (smooth, balanced)
    momentum += (Math.random() - 0.5) * 0.15;
    momentum = Math.max(Math.min(momentum, 1), -1); // clamp to [-1, 1]

    // Apply micro-trend to price
    price += momentum * volatility;

    // Avoid negative or unrealistic values
    if (price < 1) price = randomBasePrice(selectedAsset);

    // Determine readable trend
    trend = trendLabel(momentum);
    const hint = marketHint(trend);

    // Format display
    feedBox.textContent =
      `${selectedAsset} → $${price.toFixed(2)} | ${trend} | ${hint}`;
  }

  // Auto-switch assets every 30 seconds
  setInterval(() => {
    if (tfModule.style.display !== "none") {
      selectedAsset = assets[Math.floor(Math.random() * assets.length)];
      price = randomBasePrice(selectedAsset);
      momentum = 0;
      volatility = 1;

      feedBox.textContent = `Switched to ${selectedAsset}...`;
    }
  }, 30000);

  // Update feed every 2.8 seconds (smooth, realistic)
  setInterval(updateFeed, 2800);
});
