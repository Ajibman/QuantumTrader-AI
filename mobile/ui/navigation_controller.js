/**

* =====================================================
* QuantumTrader-AI
* STAGE 39A — NAVIGATION CONTROLLER
* =====================================================
* 
* Purpose:
* Handles screen transitions in mobile app.
* Keeps UI flow structured and predictable.
* 
* No trading logic is handled here.
* =====================================================
  */

export class NavigationController {

constructor() {

this.currentScreen = "DASHBOARD";

this.history = [];

}

// ---------------------------------------------
// NAVIGATE TO SCREEN
// ---------------------------------------------

go(screen, params = {}) {

this.history.push(this.currentScreen);

this.currentScreen = screen;

return {
  screen: this.currentScreen,
  params
};

}

// ---------------------------------------------
// BACK NAVIGATION
// ---------------------------------------------

back() {

this.currentScreen =
  this.history.pop() || "DASHBOARD";

return {
  screen: this.currentScreen
};

}

// ---------------------------------------------
// CURRENT STATE
// ---------------------------------------------

getState() {

return {
  currentScreen: this.currentScreen,
  history: this.history
};

}
}
