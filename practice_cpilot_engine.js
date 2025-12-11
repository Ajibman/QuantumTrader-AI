// CPilot Practice Engine
// Lightweight logic for CPilot practice mode
// Does NOT alter layout or add new UI elements

document.addEventListener("DOMContentLoaded", () => {
  
  const cpilotPanel = document.getElementById("cpilot");

  if (!cpilotPanel) return; // Safety check

  // Create a simple text feedback area BELOW the cpilot image
  const statusBox = document.createElement("div");
  statusBox.style.marginTop = "15px";
  statusBox.style.fontSize = "14px";
  statusBox.style.fontWeight = "bold";
  statusBox.style.color = "#222";
  statusBox.style.minHeight = "20px";
  statusBox.textContent = "CPilot ready (practice mode).";

  cpilotPanel.appendChild(statusBox);

  // CPilot behavior simulation
  const pilotMessages = [
    "Analyzing market sentiment...",
    "Scanning liquidity zones...",
    "Checking high-timeframe bias...",
    "Evaluating volatility compression...",
    "Assessing trend strength...",
    "Reviewing potential entry zones...",
    "Estimating risk levels...",
    "Compiling trade suggestion..."
  ];

  function generateFeedback() {
    const msg = pilotMessages[Math.floor(Math.random() * pilotMessages.length)];
    return msg;
  }

  // Auto-update CPilot every 4 seconds while module is visible
  setInterval(() => {
    if (cpilotPanel.style.display !== "none") {
      statusBox.textContent = generateFeedback();
    }
  }, 4000);

});
