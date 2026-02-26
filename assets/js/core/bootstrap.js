// assets/js/core/bootstrap.js
// QuantumTrader-AI Core Bootstrap
// Loads constitutional and core governance first, silently

import { enforceAccessControl } from "./constitution/accessControl.js";
import { enforceSubscription } from "./federation/subscriptionGuard.js";

export function bootCore() {
  // Enforce exclusive trader & subscription
  enforceAccessControl();
  enforceSubscription();

  // App can proceed to dashboard / simulation
  console.log("Bootstrap: Access granted, subscription valid.");
}

// Auto-run bootstrap when this file loads
bootCore();

// --- Constitution ---
import './constitution/node16_cognitive_federation.js';
import './constitution/lmc_filter.js';
import './constitution/decay_engine.js';

// --- Federation (operational gates) ---
import './federation/admission.js';
import './federation/roles.js';
import './federation/registry.js';

// --- Simulation gates ---
import './simulation/traderlab_gate.js';
import './simulation/scenario_bus.js';

// --- Utilities ---
import './utils/freeze.js';

// Bootstrap completes silently

// js/core/bootstrap.js

import { enforceAccessControl } from "./constitution/accessControl.js";
import { enforceSubscription } from "./federation/subscriptionGuard.js";

export function bootCore() {
  enforceAccessControl();
  enforceSubscription();
}
