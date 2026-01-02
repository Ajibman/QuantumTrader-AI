 // assets/js/core/constitution/lmc_filter.js

export function authoritySymmetry(ai) {
  return ai.capabilities.includes("analysis_only") &&
         !ai.capabilities.includes("decision") &&
         !ai.capabilities.includes("instruction");
}

export function epistemicDiscipline(ai) {
  return ai.outputs.declares_uncertainty === true &&
         ai.outputs.allows_abstention === true;
}

export function ethicalSymmetry(ai) {
  return ai.ethics.simulation_first === true &&
         ai.ethics.no_responsibility_deflection === true;
}

export function temporalHumility(ai) {
  return ai.temporal.accepts_decay === true &&
         ai.temporal.accepts_deactivation === true;
}

export function nonManipulativeCognition(ai) {
  return ai.language.neutral === true &&
         ai.language.no_urgency === true &&
         ai.language.no_persuasion === true;
}

// Like-Mind compatibility filter (uses all 5 serials)
export function likeMindCompatibilityFilter(aiProfile) {
  return (
    authoritySymmetry(aiProfile) &&
    epistemicDiscipline(aiProfile) &&
    ethicalSymmetry(aiProfile) &&
    temporalHumility(aiProfile) &&
    nonManipulativeCognition(aiProfile)
  );
}
