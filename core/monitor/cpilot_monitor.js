// core/monitor/cpilot_monitor.js

export const CPilotMonitor = {
  log(message) {
    const box = document.getElementById("simulation-monitor");
    if (!box) return;

    const entry = document.createElement("div");
    entry.textContent = message;
    box.appendChild(entry);

    box.scrollTop = box.scrollHeight;
  }
};
