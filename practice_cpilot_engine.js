 // Enhanced CPilot Practice Engine
// Intelligent hints, trend reasoning, risk guidance

document.addEventListener("DOMContentLoaded", () => {

  const cpilotPanel = document.getElementById("cpilot");
  if (!cpilotPanel) return;

  // Feedback area below CPilot image
  let statusBox = cpilotPanel.querySelector(".cpilot-status");
  if (!statusBox) {
    statusBox = document.createElement("div");
    statusBox.className = "cpilot-status";
    statusBox.style.marginTop = "15px";
    statusBox.style.fontSize = "14px";
    statusBox.style.fontWeight = "bold";
    statusBox.style.color = "#222";
    statusBox.style.minHeight = "20px";
    statusBox.textContent = "CPilot ready (practice mode).";
    cpilotPanel.appendChild(statusBox);
  }

  // Market signals for practice
  const marketSignals = [
    "Analyzing market sentiment...",
    "Scanning liquidity zones...",
    "High-timeframe bias detected...",
    "Trend strength evaluation...",
    "Entry zone assessment...",
    "Volatility compression noted...",
    "Risk estimation ongoing...",
    "Trade suggestion compiling..."
  ];

  // Generate intelligent hint based on pseudo-random logic
  function generateHint() {
    const index = Math.floor(Math.random() * marketSignals.length);
    const trendChance = Math.random();
    let trendIndicator = "Neutral";
    let riskLevel = "Low";

    if (trendChance > 0.8) { trendIndicator = "Strong Uptrend"; riskLevel = "Moderate"; }
    else if (trendChance > 0.6) { trendIndicator = "Uptrend"; riskLevel = "Low"; }
    else if (trendChance > 0.4) { trendIndicator = "Stable"; riskLevel = "Low"; }
    else if (trendChance > 0.2) { trendIndicator = "Downtrend"; riskLevel = "Moderate"; }
    else { trendIndicator = "Strong Downtrend"; riskLevel = "High"; }

    return `${marketSignals[index]} | Trend: ${trendIndicator} | Risk: ${riskLevel}`;
  }

  // Auto-update CPilot every 3.5 seconds when visible
  setInterval(() => {
    if (cpilotPanel.style.display !== "none") {
      statusBox.textContent = generateHint();
    }
  }, 3500);

});
