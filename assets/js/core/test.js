// core_test.js
// Dry-run test to verify all core modules import correctly

console.log("=== QuantumTrader-AI Core Dry-Run Test ===");

try {
  // Bootstrap
  import('./bootstrap.js').then(() => console.log("✅ bootstrap.js loaded"));

  // Constitution
  import('./constitution/node16_cognitive_federation.js').then((module) => {
    console.log("✅ node16_cognitive_federation.js loaded", module.default);
  });

  import('./constitution/lmc_filter.js').then((module) => {
    console.log("✅ lmc_filter.js loaded", Object.keys(module));
  });

  import('./constitution/decay_engine.js').then((module) => {
    console.log("✅ decay_engine.js loaded", module.default);
  });

  // Federation
  import('./federation/admission.js').then((module) => {
    console.log("✅ admission.js loaded", Object.keys(module));
  });

  import('./federation/roles.js').then((module) => {
    console.log("✅ roles.js loaded", Object.keys(module));
  });

  import('./federation/registry.js').then((module) => {
    console.log("✅ registry.js loaded", Object.keys(module.default));
  });

  // Simulation
  import('./simulation/traderlab_gate.js').then((module) => {
    console.log("✅ traderlab_gate.js loaded", Object.keys(module.default));
  });

  import('./simulation/scenario_bus.js').then((module) => {
    console.log("✅ scenario_bus.js loaded", Object.keys(module.default));
  });

  // Utils
  import('./utils/freeze.js').then((module) => {
    console.log("✅ freeze.js loaded", Object.keys(module));
  });

} catch (err) {
  console.error("❌ Dry-run import failed", err);
}
