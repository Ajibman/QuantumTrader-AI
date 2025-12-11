 // Static app.js (No globe animation) // Handles module switching only

document.addEventListener("DOMContentLoaded", () => { const navButtons = document.querySelectorAll(".nav-btn"); const modules = document.querySelectorAll(".module");

// Helper: Hide all modules function hideAllModules() { modules.forEach((mod) => (mod.style.display = "none")); }

// Default: show Trading Floor hideAllModules(); document.getElementById("tradingfloor").style.display = "block";

// Navigation Toggle Logic

                          // Static app.js with TraderLab simulation // Handles module switching and TraderLab mock trades

document.addEventListener("DOMContentLoaded", () => { const navButtons = document.querySelectorAll(".nav-btn"); const modules = document.querySelectorAll(".module");

// Helper: Hide all modules function hideAllModules() { modules.forEach((mod) => (mod.style.display = "none")); }

// Default: show Trading Floor hideAllModules(); document.getElementById("tradingfloor").style.display = "block";

// Navigation Toggle Logic navButtons.forEach((btn) => { btn.addEventListener("click", () => { const target = btn.getAttribute("data-target"); hideAllModules(); document.getElementById(target).style.display = "block"; }); });

// --- TraderLab Simulation Logic ---

const traderLabPanel = document.querySelector("#traderlab");

// Simulated data for TraderLab const traderLabData = { assets: ["BTC", "ETH", "SOL"], trends: ["Uptrend", "Downtrend", "Stable"] };

// Function to simulate trade result function simulateTrade(asset) { const trend = traderLabData.trends[Math.floor(Math.random() * traderLabData.trends.length)]; return Asset: ${asset} | Market Trend: ${trend} | Suggested Action: ${trend === 'Uptrend' ? 'Buy' : 'Sell'}; }

// Event listener for TraderLab buttons traderLabPanel.addEventListener("click", (e) => { if(e.target.classList.contains("simulate-btn")) { const selectedAsset = e.target.dataset.asset; const display = traderLabPanel.querySelector(".trade-result"); display.textContent = simulateTrade(selectedAsset); } }); });
