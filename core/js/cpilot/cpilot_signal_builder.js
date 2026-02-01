// core/js/cpilot/cpilot_signal_builder.js

import { buildCPilotSignal } from "./cpilot_entry.js";
import { createFullSignal } from "../signal/full_signal.js";

export function prepareCPilotSignal() {
  const baseSignal = buildCPilotSignal();
  if (!baseSignal) return null;

  const mode =
    document.querySelector('input[name="trade-mode"]:checked')?.value ||
    "manual";

  const timingRaw = document.getElementById("tp-timing")?.value;
  const [value, unit, label] = timingRaw.split("|");

  return createFullSignal({
    permission: baseSignal.permission,
    context: baseSignal.context,
    mode,
    timing: {
      value: Number(value),
      unit,
      label
    }
  });
}
