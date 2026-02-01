// core/js/cpilot/cpilot_ui_gate.js

import { buildCPilotSignal } from "./cpilot_entry.js";

export function applyCPilotGate() {
  const signal = buildCPilotSignal();

  const enterBtn = document.getElementById("enter-cpilot");
  const resetBtn = document.getElementById("reset-cpilot");
  const statusBadge = document.getElementById("cpilot-status");
  const note = document.getElementById("cpilot-note");

  if (!signal) {
    // No TraderLab evaluation yet
    statusBadge.textContent = "🔒 LOCKED";
    statusBadge.className = "status locked";
    note.textContent = "Complete TraderLab training to unlock CPilot.";
    enterBtn.disabled = true;
    resetBtn.disabled = true;
    return;
  }

  if (!signal.permission.cpilotAllowed) {
    statusBadge.textContent = "🔒 LOCKED";
    statusBadge.className = "status locked";
    note.textContent = "TraderLab qualification not yet passed.";
    enterBtn.disabled = true;
    resetBtn.disabled = true;
    return;
  }

  // Qualified
  statusBadge.textContent = "🟢 AVAILABLE";
  statusBadge.className = "status available";
  note.textContent = "CPilot unlocked. Simulation access available.";
  enterBtn.disabled = false;
  resetBtn.disabled = false;
}
