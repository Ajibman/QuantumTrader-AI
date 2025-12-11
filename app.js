// Complete static app.js for QuantumTrader-AI // Handles module toggling and TraderLab simulation

document.addEventListener("DOMContentLoaded", () => { const navButtons = document.querySelectorAll(".nav-btn"); const modules = document.querySelectorAll(".module"); const traderLabPanel = document.getElementById("traderlab");

// Helper to hide all modules function hideAllModules() { modules.forEach(mod => mod.style.display = "none"); }

// Default view: show Trading Floor hideAllModules(); document.getElementById("tradingfloor").style.display = "block";

// Module toggle logic navButtons.forEach(btn => { btn.addEventListener("click", () => { const target = btn.getAttribute("data-target"); hideAllModules(); document.getElementById(target).style.display = "block"; }); });

// TraderLab simulation data const traderLabData = { assets: ["BTC", "ETH", "SOL"], trends: ["Uptrend", "Downtrend", "Stable"] };

// Simulate trade function function simulateTrade(asset) { const trend = traderLabData.trends[Math.floor(Math.random() * traderLabData.trends.length)]; const action = trend === 'Uptrend' ? 'Buy' : trend === 'Downtrend' ? 'Sell' : 'Hold'; return Asset: ${asset} | Market Trend: ${trend} | Suggested Action: ${action}; }

// Event listener for TraderLab buttons traderLabPanel.addEventListener("click", e => { if (e.target.classList.contains("simulate-btn")) { const selectedAsset = e.target.dataset.asset; const display = traderLabPanel.querySelector(".trade-result"); display.textContent = simulateTrade(selectedAsset); } }); });
