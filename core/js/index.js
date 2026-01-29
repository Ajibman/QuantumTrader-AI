// Example state object
const AppState = {
  wallet: {
    exists: true,
    subscriptionValid: true
  },
  traderLab: {
    completed: false
  },
  cPilot: {
    qualified: false
  },
  tradingFloor: {
    approved: false
  }
};

(function(){

  // ---- 1. GET ELEMENTS ----
  const traderLabBtn = document.querySelector('[data-entry="traderlab"]');
  const cPilotBtn = document.querySelector('[data-entry="cpilot"]');
  const tradingFloorBtn = document.querySelector('[data-entry="tradingfloor"]');

  const traderLabStatus = document.querySelector('[data-status="traderlab"]');
  const cPilotStatus = document.querySelector('[data-status="cpilot"]');
  const tradingFloorStatus = document.querySelector('[data-status="tradingfloor"]');

  // ---- 2. FUNCTION TO REFRESH UI BASED ON REAL STATE ----
  function refreshAccessStatus() {
    // Read from AppState (wallet + module completion)
    const traderLabEligible = AppState.wallet.exists && AppState.wallet.subscriptionValid;
    const traderLabCompleted = AppState.traderLab.completed;
    const cPilotQualified = AppState.cPilot.qualified;
    const tradingFloorApproved = AppState.tradingFloor.approved;

    // TraderLab always first
    if(traderLabEligible){
      traderLabBtn.disabled = false;
      traderLabStatus.textContent = "🟢 AVAILABLE";
    } else {
      traderLabBtn.disabled = true;
      traderLabStatus.textContent = "🔒 LOCKED";
    }

    // CPilot unlocks only if TraderLab completed
    if(traderLabCompleted){
      cPilotBtn.disabled = false;
      cPilotStatus.textContent = "🟢 AVAILABLE";
    } else {
      cPilotBtn.disabled = true;
      cPilotStatus.textContent = "🔒 LOCKED";
    }

    // Trading Floor unlocks only if CPilot qualified AND tradingFloor approved
    if(cPilotQualified && tradingFloorApproved){
      tradingFloorBtn.disabled = false;
      tradingFloorStatus.textContent = "🟢 AVAILABLE";
    } else {
      tradingFloorBtn.disabled = true;
      tradingFloorStatus.textContent = "⛔ RESTRICTED";
    }
  }

  // ---- 3. INITIAL RUN ----
  refreshAccessStatus();

  // ---- 4. DYNAMIC REFRESH (every 1s) ----
  setInterval(refreshAccessStatus, 1000);

})();
