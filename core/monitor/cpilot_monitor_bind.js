 // core/js/monitor/cpilot_monitor_bind.js

/**
 * CPilot Monitor Bind
 * Handles rendering ticks and engine updates to the monitor panel.
 */

const CPilotMonitorBind = {
  monitorElement: null,
  subscribers: [],

  /**
   * Initialize the monitor bind.
   * @param {string} monitorId - ID of the DOM element to display ticks
   */
  init(monitorId = "cpilot-monitor") {
    this.monitorElement = document.getElementById(monitorId);

    if (!this.monitorElement) {
      console.warn(`[CPilotMonitorBind] Monitor element "${monitorId}" not found`);
    }
  },

  /**
   * Subscribe a handler to receive each tick.
   * @param {function} fn - Callback with tick object
   */
  subscribe(fn) {
    if (typeof fn === "function") this.subscribers.push(fn);
  },

  /**
   * Publish tick to monitor element and all subscribers.
   */
  emitTick(tick) {
    // Render in DOM
    if (this.monitorElement) {
      this.monitorElement.textContent =
        `[${tick.timestamp}] Price: ${tick.price} Volume: ${tick.volume}\n\n` +
        this.monitorElement.textContent;
    }

    // Notify subscribers
    this.subscribers.forEach(fn => fn(tick));
  }
};

export default CPilotMonitorBind;
