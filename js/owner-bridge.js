function applyOwnerState(state) {
  if (!state || !window.CCLM2) return;

  const context = {
    mode: state.mode,
    page: state.page,
    nodes: Array.from(state.nodes)
  };

  // Update CCLM²
  window.CCLM2.setContext(context);

  // Also notify pages (unchanged)
  document.dispatchEvent(
    new CustomEvent("QT_OWNER_UPDATE", {
      detail: context
    })
  );
}
