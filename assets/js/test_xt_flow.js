import { emitXTEvent } from "./xt_logical_module.js";
import { SocialResponsibilityBus } from "../ecosystem_bus.js";

// Initialize all 12 nodes in the bus
SocialResponsibilityBus.init([
  "TradingFloor",
  "TraderLab",
  "AutoTrader",
  "RiskEngine",
  "PolicyMatrix",
  "Compliance",
  "Ethics",
  "Audit",
  "Settlement",
  "Liquidity",
  "Intelligence",
  "PublicTrust"
]);

console.log("=== Starting XT Event Test ===");

// Fire the XT event manually
emitXTEvent();

// Inspect bus logs after emission
console.log("=== SRL Logs ===");
console.table(SocialResponsibilityBus.logs);

// Public surfacing happens automatically
console.log("=== Check console for PUBLIC_SURFACE output ===");
