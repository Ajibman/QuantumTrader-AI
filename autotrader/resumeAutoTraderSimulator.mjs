#!/usr/bin/env node
// AutoTrader Resume Script — simulation mode

import { toggleLiveMode, startOrchestrator } from './autotrader.orchestrator.mjs';

console.log("🔹 Resuming AutoTrader from frozen state...");
toggleLiveMode(false);   // Ensure simulation mode
startOrchestrator();
console.log("✅ AutoTrader resumed in SIMULATION mode. No live trades will occur.");
