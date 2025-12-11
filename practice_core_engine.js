 // Integrated Practice Core Engine
// Coordinates enhanced TraderLab, TradingFloor, and CPilot practice engines

document.addEventListener("DOMContentLoaded", () => {

  const modules = {
    tradingfloor: document.getElementById("tradingfloor"),
    traderlab: document.getElementById("traderlab"),
    cpilot: document.getElementById("cpilot")
  };

  // Engine activation flags
  const engineState = {
    tradingfloor: false,
    traderlab: false,
    cpilot: false
  };

  // Activate the corresponding practice engine
  function activateEngine(moduleName) {
    Object.keys(engineState).forEach(name => engineState[name] = false);
    engineState[moduleName] = true;
    console.log(`Practice Engine → ${moduleName.toUpperCase()} activated`);
  }

  // Watcher: check active module every 300ms
  setInterval(() => {
    if (modules.tradingfloor.style.display !== "none" && !engineState.tradingfloor) {
      activateEngine("tradingfloor");
    } else if (modules.traderlab.style.display !== "none" && !engineState.traderlab) {
      activateEngine("traderlab");
    } else if (modules.cpilot.style.display !== "none" && !engineState.cpilot) {
      activateEngine("cpilot");
    }
  }, 300);

  // Optional: initial engine activation
  Object.keys(modules).forEach(name => {
    if (modules[name].style.display !== "none") {
      engineState[name] = true;
      console.log(`Practice Engine → ${name.toUpperCase()} initial activation`);
    }
  });

});
