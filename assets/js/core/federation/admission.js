export function validateAIProfile(profile) {
  for (const key in profile.capabilities) {
    if (profile.capabilities[key] !== true && key === "analysis_only") {
      return false;
    }
  }
  return true;
}
