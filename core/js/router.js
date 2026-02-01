 // core/js/router.js
// QuantumTrader-AI SPA Router (GitHub Pages compatible)

(function () {
  const container = document.getElementById("app");

  if (!container) {
    console.error("SPA container #app not found in index.html");
    return;
  }

  // -----------------------------
  // Route map
  // -----------------------------
  const routes = {
    "": "views/traderlab.html",          // default
    "#/": "views/traderlab.html",
    "#/traderlab": "views/traderlab.html",
    "#/cpilot": "views/cpilot.html",
    "#/tradingfloor": "views/tradingfloor.html"
  };

  // -----------------------------
  // Load view
  // -----------------------------
  async function loadView(hash) {
    const viewPath = routes[hash] || routes[""];

    try {
      const response = await fetch(viewPath);
      if (!response.ok) throw new Error(`Failed to load ${viewPath}`);

      const html = await response.text();
      container.innerHTML = html;

      // Push state (hash-based, GitHub Pages safe)
      if (location.hash !== hash) {
        history.pushState({ view: hash }, "", hash);
      }

      // Init page-specific logic AFTER DOM injection
      switch (hash) {
        case "#/traderlab":
        case "":
          if (typeof initTraderLab === "function") initTraderLab();
          break;

        case "#/cpilot":
          if (typeof initCPilot === "function") initCPilot();
          break;

        case "#/tradingfloor":
          if (typeof initTradingFloor === "function") initTradingFloor();
          break;
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `
        <div style="padding:20px; color:#fff;">
          <h3>View failed to load</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  }

  // -----------------------------
  // Navigation handler
  // -----------------------------
  function handleNavigation() {
    const hash = location.hash;
    loadView(hash);
  }

  // -----------------------------
  // Event listeners
  // -----------------------------
  window.addEventListener("hashchange", handleNavigation);
  window.addEventListener("popstate", handleNavigation);

  // -----------------------------
  // Initial load
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    handleNavigation();
  });

})();
