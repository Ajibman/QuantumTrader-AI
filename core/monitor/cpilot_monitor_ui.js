// core/js/monitor/cpilot_monitor_ui.js

import CPilotMonitorBind from "./cpilot_monitor_bind.js";

/**
 * Initialize the CPilot monitor panel in the UI
 * Should be called once on page load
 */
const CPilotMonitorUI = {
  init() {
    // Bind the monitor element
    CPilotMonitorBind.init("cpilot-monitor");

    // Optional: auto-scroll or formatting logic can be added here
    console.log("[CPilotMonitorUI] Monitor initialized");
  },

  /**
   * Subscribe CPilot Engine or SimulationFeed to the monitor
   * @param {object} source - Any object emitting ticks with .subscribe(fn)
   */
  attachSource(source) {
    if (!source || typeof source.subscribe !== "function") {
      console.warn("[CPilotMonitorUI] Invalid source for monitor subscription");
      return;
    }

    source.subscribe(tick => CPilotMonitorBind.emitTick(tick));
    console.log("[CPilotMonitorUI] Source attached to monitor");
  }
};

export default CPilotMonitorUI;
