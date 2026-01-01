federation_admission.js

export function admitExternalAI(aiProfile) {
  if (!likeMindCompatibilityFilter(aiProfile)) {
    return { status: "rejected", reason: "incompatible" };
  }

  return {
    status: "admitted",
    role: "advisory_only",
    authority: "none",
    path: "simulation_only",
    decayEnabled: true
  };
}
