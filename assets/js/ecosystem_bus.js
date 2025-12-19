// ecosystem_bus.js

export const SocialResponsibilityBus = {
  logs: {},

  init(nodes = []) {
    nodes.forEach(node => {
      this.logs[node] = [];
    });
  },

  broadcast(event) {
    Object.keys(this.logs).forEach(node => {
      this.logs[node].push({
        observedAt: new Date().toISOString(),
        event
      });
      console.log(`[SRL] ${node} observed XT activation`);
    });

    localStorage.setItem(
      "SRL_ECOSYSTEM_LOGS",
      JSON.stringify(this.logs)
    );
  }
};
