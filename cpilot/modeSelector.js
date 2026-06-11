// cPilot Mode Selector (MVP)

const modes = {
  conservative: {
    riskMultiplier: 0.5,
    aggression: "low"
  },
  balanced: {
    riskMultiplier: 1.0,
    aggression: "medium"
  },
  aggressive: {
    riskMultiplier: 1.5,
    aggression: "high"
  }
};

function getMode(modeName = "balanced") {
  return modes[modeName] || modes.balanced;
}

module.exports = {
  getMode
};
