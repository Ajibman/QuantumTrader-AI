// --- Panel Visibility Controller ---
document.addEventListener("DOMContentLoaded", () => {

  const panels = [
    "trading-floor",
    "traderlab-panel",
    "cpilot-panel",
    "system-panel"
  ];

  function showPanel(panelId) {
    panels.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === panelId) ? "block" : "none";
    });
  }

  document.getElementById("btnSystem")?.addEventListener("click", () => {
    showPanel("system-panel");
  });

  document.getElementById("btnTradingFloor")?.addEventListener("click", () => {
    showPanel("trading-floor");
  });

  document.getElementById("btnTraderLab")?.addEventListener("click", () => {
    showPanel("traderlab-panel");
  });

  document.getElementById("btnCPilot")?.addEventListener("click", () => {
    showPanel("cpilot-panel");
  });

});
