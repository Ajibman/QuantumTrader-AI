 // Enhanced TraderLab Practice Engine
// Adds realistic trade simulation logic

document.addEventListener("DOMContentLoaded", () => {

  const traderLabPanel = document.getElementById("traderlab");
  if (!traderLabPanel) return;

  const resultBox = traderLabPanel.querySelector(".trade-result");
  if (!resultBox) return;

  // Asset simulation parameters
  const traderLabData = {
    assets: ["BTC", "ETH", "SOL"],
    trends: ["Uptrend", "Downtrend", "Stable"]
  };

  // Simulate realistic trade outcome
  function simulateTrade(asset) {
    // Random market trend
    const trend = traderLabData.trends[Math.floor(Math.random() * traderLabData.trends.length)];

    // Suggested action based on trend
    let action = trend === "Uptrend" ? "Buy" :
                 trend === "Downtrend" ? "Sell" : "Hold";

    // Risk/Reward estimation
    const riskPercent = (Math.random() * 5 + 1).toFixed(1);   // 1%–6%
    const rewardPercent = (Math.random() * 10 + 2).toFixed(1); // 2%–12%
    
    // Simulated expected P/L
    const pl = trend === "Uptrend" ? rewardPercent : trend === "Downtrend" ? `-${riskPercent}` : "0";

    // Return formatted trade suggestion
    return `Asset: ${asset} | Trend: ${trend} | Suggested Action: ${action} | Risk: ${riskPercent}% | Potential Reward: ${rewardPercent}% | Expected P/L: ${pl}%`;
  }

  // Event listener for buttons
  traderLabPanel.addEventListener("click", e => {
    if (e.target.classList.contains("simulate-btn")) {
      const asset = e.target.dataset.asset;
      resultBox.textContent = simulateTrade(asset);
    }
  });

  // Optional: auto-simulate for practice mode every 10s
  setInterval(() => {
    if (traderLabPanel.style.display !== "none") {
      const randomAsset = traderLabData.assets[Math.floor(Math.random() * traderLabData.assets.length)];
      resultBox.textContent = simulateTrade(randomAsset);
    }
  }, 10000);

});
