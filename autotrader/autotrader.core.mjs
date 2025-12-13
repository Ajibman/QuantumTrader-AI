/* =========================================================
   QuantumTrader-AI
   AutoTrader Core Engine — SERIAL 1 of 6
   Purpose: Control, timing, and heartbeat (NO execution)
   ========================================================= */

/* ---------- STATE ---------- */
export const AutoTraderState = {
  enabled: false,
  mode: "MANUAL",      // MANUAL | AUTO
  interval: null,      // milliseconds
  timer: null
};

/* ---------- TIMING PRESETS ---------- */
export const AUTO_INTERVALS = {
  SEC_30: 30_000,
  SEC_60: 60_000,
  MIN_5: 300_000
};

/* ---------- ENABLE AUTOTRADER ---------- */
export function enableAutoTrader(interval) {
  if (!interval) {
    console.warn("[AutoTrader] Interval not specified");
    return;
  }

  if (AutoTraderState.timer) {
    clearInterval(AutoTraderState.timer);
  }

  AutoTraderState.enabled = true;
  AutoTraderState.mode = "AUTO";
  AutoTraderState.interval = interval;

  AutoTraderState.timer = setInterval(() => {
    dispatchAutoTradeTick();
  }, interval);

  console.log(
    `[AutoTrader] ENABLED → Interval: ${interval} ms`
  );
}

/* ---------- DISABLE AUTOTRADER ---------- */
export function disableAutoTrader() {
  if (AutoTraderState.timer) {
    clearInterval(AutoTraderState.timer);
  }

  AutoTraderState.enabled = false;
  AutoTraderState.mode = "MANUAL";
  AutoTraderState.interval = null;
  AutoTraderState.timer = null;

  console.log("[AutoTrader] DISABLED → Manual mode restored");
}

/* ---------- HEARTBEAT DISPATCH ---------- */
function dispatchAutoTradeTick() {
  if (!AutoTraderState.enabled) return;

  const tick = {
    timestamp: Date.now(),
    source: "AUTOTRADER",
    interval: AutoTraderState.interval
  };

  onAutoTradeTick(tick);
}

/* ---------- PLACEHOLDER HOOK ---------- */
/* Serial 2 will inject strategy logic here */
function onAutoTradeTick(tick) {
  console.log("[AutoTrader Tick]", tick);
}

/* ---------- STATUS QUERY (OPTIONAL) ---------- */
export function getAutoTraderStatus() {
  return {
    enabled: AutoTraderState.enabled,
    mode: AutoTraderState.mode,
    interval: AutoTraderState.interval
  };
}
