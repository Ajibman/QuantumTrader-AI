--js
document.addEventListener("DOMContentLoaded", function () {
  const autoToggle = document.getElementById("bestDisplayAuto");
  const displayBox = document.getElementById("bestDisplayContent");

  // Items for “Best Display Today”
  const apexItems = [
    "Market Momentum: Strong Buy Zones",
    "Capital Flow Heatmap Surge",
    "TraderLab Signal Cluster",
    "CPilot Sentiment Spike",
    "Volatility Window Expansion",
    "Arbitrage Opportunity Detected"
  ];

  function generateBestDisplay() {
    const pick = apexItems[Math.floor(Math.random() * apexItems.length)];
    displayBox.innerHTML = `<p>${pick}</p>`;
  }

  // Auto mode loop
  let autoInterval = null;

  autoToggle.addEventListener("change", () => {
    if (autoToggle.checked) {
      displayBox.innerHTML = "<p>Auto mode activated…</p>";
      autoInterval = setInterval(generateBestDisplay, 3000);

      // Optional: trigger one immediately
      generateBestDisplay();
    } else {
      clearInterval(autoInterval);
      autoInterval = null;
      displayBox.innerHTML = "<p>Auto mode is OFF</p>";
    }
  });
});
