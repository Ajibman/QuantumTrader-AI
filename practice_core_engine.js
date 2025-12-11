// practice_core_engine.js
// Coordinates all practice engines without modifying UI

document.addEventListener("DOMContentLoaded", () => {

  const modules = {
    tradingfloor: document.getElementById("tradingfloor"),
    traderlab: document.getElementById("traderlab"),
    cpilot: document.getElementById("cpilot")
  };

  // Engine state trackers (ON / OFF)
  const engineState = {
    tradingfloor: false,
    traderlab: false,
    cpilot: false
  };

  // Activate engine for the module the user is viewing
  function activateEngine(moduleName) {
    Object.keys(engineState).forEach(name => {
      engineState[name] = false;   // Turn all engines OFF
    });

    engineState[moduleName] = true; // Turn ON the current module engine

    console.log(`Practice Engine → ${moduleName.toUpperCase()} activated`);
  }

  // Watcher: detects module changes every 300ms
  setInterval(() => {
    if (modules.tradingfloor.style.display !== "none") {
      if (!engineState.tradingfloor) activateEngine("tradingfloor");
    }
    else if (modules.traderlab.style.display !== "none") {
      if (!engineState.traderlab) activateEngine("traderlab");
    }
    else if (modules.cpilot.style.display !== "none") {
      if (!engineState.cpilot) activateEngine("cpilot");
    }
  }, 300);

});
