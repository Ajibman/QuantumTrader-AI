 // core/js/signal/full_signal.js

export function createFullSignal({
  permission,
  context = {},
  timing = null,
  mode = "manual"
}) {
  return {
    permission,
    context,
    timing,
    mode,

    meta: {
      source: "TraderLab",
      createdAt: new Date().toISOString(),
      environment: "simulation"
    }
  };
}
