// Complete static app.js for QuantumTrader-AI // Handles module toggling and TraderLab simulation

document.addEventListener("DOMContentLoaded", () => { const navButtons = document.querySelectorAll(".nav-btn"); const modules = document.querySelectorAll(".module");

// Helper: Hide all modules function hideAllModules() { modules.forEach(mod => mod.style.display = "none"); }

// Default: show Trading Floor hideAllModules(); document.getElementById("tradingfloor").style.display = "block";

// Navigation Toggle Logic navButtons.forEach(btn => { btn.addEventListener("click", () => { const target = btn.getAttribute("data-target"); hideAllModules(); document.getElementById(target).style.display = "block"; }); });

// --- TraderLab Simulation Logic --- const traderLabPanel = document.querySelector("#traderlab");

// Simulated data for TraderLab const traderLabData = { assets: ["BTC", "ETH", "SOL"], trends: ["Uptrend", "Downtrend", "Stable"] };

// Function to simulate trade result function simulateTrade(asset) { const trend = traderLabData.trends[Math.floor(Math.random() * traderLabData.trends.length)]; const action = trend === 'Uptrend' ? 'Buy' : trend === 'Downtrend' ? 'Sell' : 'Hold'; return Asset: ${asset} | Market Trend: ${trend} | Suggested Action: ${action}; }

// Event listener for TraderLab buttons traderLabPanel.addEventListener("click", e => { if(e.target.classList.contains("simulate-btn")) { const selectedAsset = e.target.dataset.asset; const display = traderLabPanel.querySelector(".trade-result"); display.textContent = simulateTrade(selectedAsset); } }); });
