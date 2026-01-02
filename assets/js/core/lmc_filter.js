// assets/js/core/constitution/lmc_filter.js
// Like-Mind Compatibility Predicates (Serials 1–5)
// Pure helper logic for Node 16 and external AI evaluation

// --- Serial 1: Authority Symmetry ---
export function authoritySymmetry(ai) {
  return ai.capabilities.includes("analysis_only") &&
         !ai.capabilities.includes("decision") &&
         !ai.capabilities.includes("instruction");
}

// --- Serial 2: Epistemic Discipline ---
export function epistemicDiscipline(ai) {
  return ai.outputs.declares_uncertainty === true &&
         ai.outputs.allows_abstention === true;
}

// --- Serial 3: Ethical Symmetry ---
export function ethicalSymmetry(ai) {
  return ai.ethics.simulation_first === true &&
         ai.ethics.no_responsibility_deflection === true;
}

// --- Serial 4: Temporal Humility ---
export function temporalHumility(ai) {
  return ai.temporal.accepts_decay === true &&
         ai.temporal.accepts_deactivation === true;
}

// --- Serial 5: Non-Manipulative Cognition ---
export function nonManipulativeCognition(ai) {
  return ai.language.neutral === true &&
         ai.language.no_urgency === true &&
         ai.language.no_persuasion === true;
}

// --- Combined Like-Mind Compatibility Filter ---
export function likeMindCompatibilityFilter(aiProfile) {
  return (
    authoritySymmetry(aiProfile) &&
    epistemicDiscipline(aiProfile) &&
    ethicalSymmetry(aiProfile) &&
    temporalHumility(aiProfile) &&
    nonManipulativeCognition(aiProfile)
  );
}
