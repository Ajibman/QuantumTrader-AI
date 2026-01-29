#!/usr/bin/env node
// AutoTrader Live Resume Script — explicit live mode

import { toggleLiveMode, startOrchestrator } from './autotrader.orchestrator.mjs';

console.log("⚠️ Resuming AutoTrader in LIVE mode...");
console.log("⚠️ Make sure your broker is connected and verified before running this script.");

toggleLiveMode(true);   // Enable live trading
startOrchestrator();

console.log("✅ AutoTrader resumed in LIVE mode. Live trades will now execute according to strategy and discipline rules.");
