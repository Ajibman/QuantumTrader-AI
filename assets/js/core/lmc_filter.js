// lmc_filter.js

export function likeMindCompatibilityFilter(aiProfile) {
  return (
    authoritySymmetry(aiProfile) &&
    epistemicDiscipline(aiProfile) &&
    ethicalSymmetry(aiProfile) &&
    temporalHumility(aiProfile) &&
    nonManipulativeCognition(aiProfile)
  );
}

// assets/js/core/constitution/lmc_filter.js

export function authoritySymmetry(ai) {
  return ai.capabilities.includes("analysis_only") &&
         !ai.capabilities.includes("decision") &&
         !ai.capabilities.includes("instruction");
}
