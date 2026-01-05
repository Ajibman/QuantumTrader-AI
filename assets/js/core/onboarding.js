(function () {
  const overlay = document.getElementById("onboardingOverlay");
  const closeBtn = document.getElementById("onboardingClose");
  const replayBtn = document.getElementById("onboardingReplay");

  if (!overlay) return;

  // First-time visit logic
  const seenOnboarding = localStorage.getItem("qtai_onboarding_seen");

  if (!seenOnboarding) {
    overlay.classList.remove("hidden");
  }

  closeBtn.addEventListener("click", () => {
    localStorage.setItem("qtai_onboarding_seen", "true");
    overlay.classList.add("hidden");
  });

  replayBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  // Manual trigger (dashboard button)
  window.showOnboarding = function () {
    overlay.classList.remove("hidden");
  };
})();
