 // TradingFloor Run Controller — App-ready
import { tradingFloorFeed } from "./tradingfloor_sim_feed.js";

let activeSignal = null;
let running = false;

export function loadTradingFloorSignal(signal) {
  if (!signal) throw new Error("No signal loaded");
  activeSignal = signal;
}

export function startTradingFloor() {
  if (!activeSignal) throw new Error("TradingFloor not armed with signal");
  if (running) return;

  running = true;
  const { value, unit } = activeSignal.tp;
  const timing = { value, unit };

  // Bind simulation ticks
  tradingFloorFeed.subscribe(onTick);
  tradingFloorFeed.start(timing);

  updateButtons(true);
  logMonitor(`TradingFloor STARTED — Auto TP: ${value}${unit}`);
}

export function stopTradingFloor() {
  running = false;
  tradingFloorFeed.stop();
  activeSignal = null;
  updateButtons(false);
  logMonitor("TradingFloor STOPPED");
}

function onTick(tick) {
  if (!running) return;
  logMonitor(`[${tick.timestamp}] Price: ${tick.price}, Volume: ${tick.volume}`);
}

function logMonitor(msg) {
  const monitor = document.getElementById("simulation-monitor");
  if (!monitor) return;
  const p = document.createElement("p");
  p.textContent = msg;
  monitor.appendChild(p);
  monitor.scrollTop = monitor.scrollHeight;
}

function updateButtons(isRunning) {
  const startBtn = document.getElementById("start-trade-btn");
  const stopBtn = document.getElementById("stop-trade-btn");
  if (startBtn) startBtn.disabled = isRunning;
  if (stopBtn) stopBtn.disabled = !isRunning;
}
