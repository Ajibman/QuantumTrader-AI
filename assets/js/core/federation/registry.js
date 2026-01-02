// assets/js/core/federation/registry.js
// Central registry for admitted cognitive agents

const FederationRegistry = (() => {
  const agents = new Map();

  function register(agent) {
    if (!agent || !agent.id) return false;
    agents.set(agent.id, Object.freeze(agent));
    return true;
  }

  function get(agentId) {
    return agents.get(agentId) || null;
  }

  function list() {
    return Array.from(agents.values());
  }

  return Object.freeze({
    register,
    get,
    list
  });
})();

export default FederationRegistry;
