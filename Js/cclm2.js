(function () {
  // =========================
  // CCLM² — Core Cognitive Logic Module
  // =========================

  const CCLM2 = {
    context: {
      mode: "simulation",
      page: null,
      nodes: []
    },

    nodes: {},

    // Register a node
    registerNode(id, nodeImpl) {
      this.nodes[id] = nodeImpl;
    },

    // Update system context
    setContext(ctx) {
      this.context = { ...this.context, ...ctx };
      this.evaluate();
    },

    // Core evaluation loop
    evaluate() {
      const activeNodes = this.context.nodes;

      const results = [];

      activeNodes.forEach((id) => {
        const node = this.nodes[id];
        if (!node) return;

        try {
          const output = node.run(this.context);
          results.push({ id, output });
        } catch (err) {
          console.error(`[CCLM²] Node ${id} failed`, err);
        }
      });

      this.emit(results);
    },

    // Emit cognition results
    emit(results) {
      document.dispatchEvent(
        new CustomEvent("QT_CCLM_UPDATE", {
          detail: {
            context: this.context,
            results,
            timestamp: Date.now()
          }
        })
      );
    }
  };

  // Expose globally
  window.CCLM2 = CCLM2;

})();
