// assets/js/core/federation/roles.js
// Defines allowed roles for external AI participants

const FederationRoles = Object.freeze({
  ADVISORY_ONLY: {
    canAnalyze: true,
    canDecide: false,
    canInstruct: false,
    canExecute: false
  }
});

export default FederationRoles;
