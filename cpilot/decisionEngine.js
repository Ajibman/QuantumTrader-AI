// cPilot Decision Engine (MVP)

function selectStrategy(labResult) {
  if (!labResult || !labResult.approved || labResult.approved.length === 0) {
    return {
      name: "NONE",
      signal: "HOLD",
      reason: "No valid strategies approved by TraderLab"
    };
  }

  // Pick best strategy from TraderLab
  const best = labResult.best;

  return {
    name: best.name,
    signal: best.signal,
    score: best.score,
    mode: "auto-selected",
    source: "TraderLab"
  };
}

module.exports = {
  selectStrategy
};
