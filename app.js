 // Static app.js (No globe animation) // Handles module switching only

document.addEventListener("DOMContentLoaded", () => { const navButtons = document.querySelectorAll(".nav-btn"); const modules = document.querySelectorAll(".module");

// Helper: Hide all modules function hideAllModules() { modules.forEach((mod) => (mod.style.display = "none")); }

// Default: show Trading Floor hideAllModules(); document.getElementById("tradingfloor").style.display = "block";

// Navigation Toggle Logic
