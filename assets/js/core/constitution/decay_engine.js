// assets/js/core/constitution/decay_engine.js
// Constitutional Decay Engine — silent lifecycle governance

const DecayEngine = Object.freeze({
  enabled: true,
  scope: "external_ai_only",
  rules: {
    versionExpiry: true,
    inactivityExpiry: true,
    revocationAllowed: true
  },
  action: "deactivate"
});

// Silent export
export default DecayEngine;
