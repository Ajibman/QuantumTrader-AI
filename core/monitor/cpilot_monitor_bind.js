// core/monitor/cpilot_monitor_bind.js

import { subscribe } from "../events/event_bus.js";

const CPilotMonitorBind = {
  init() {
    subscribe((event) => {
      if (event.type === "tick") {
        this.onTick(event);
      }
    });
  },

  onTick({ tick, signal }) {
    const monitor = document.getElementById("simulation-monitor");

    if (!monitor) return;

    const line = document.createElement("div");
    line.className = "monitor-line";

    line.textContent = `[${new Date().toLocaleTimeString()}] `
      + `Price: ${tick.price} | `
      + `TP: ${signal?.timing?.label || "—"} | `
      + `Mode: ${signal?.mode || "—"}`;

    monitor.appendChild(line);

    // Auto-scroll
    monitor.scrollTop = monitor.scrollHeight;
  }
};

export default CPilotMonitorBind;
