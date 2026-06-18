/**

* =====================================================
* QuantumTrader-AI
* STAGE 22B — EXECUTION REGISTRY
* =====================================================
* 
* Purpose:
* Central registry for all execution providers.
* 
* Responsibilities:
* - Provider registration
* - Provider discovery
* - Provider activation
* - Health monitoring
* - Failover support
* - Capability inspection
* 
* MetaBrain and ExecutionApiBinding should
* never need to know implementation details
* of individual execution providers.
* =====================================================
  */

export class ExecutionRegistry {

constructor() {

this.providers = new Map();

this.activeProvider = null;

this.healthCache = {};

}

// =====================================================
// REGISTER PROVIDER
// =====================================================

register(name, provider, capabilities = {}) {

if (!name || !provider) {
  throw new Error(
    "Provider registration failed."
  );
}

this.providers.set(name, {
  name,
  provider,
  capabilities,
  registeredAt: Date.now()
});

if (!this.activeProvider) {
  this.activeProvider = name;
}

return true;

}

// =====================================================
// REMOVE PROVIDER
// =====================================================

unregister(name) {

return this.providers.delete(name);

}

// =====================================================
// GET PROVIDER
// =====================================================

get(name) {

return this.providers.get(name);

}

// =====================================================
// LIST PROVIDERS
// =====================================================

list() {

return [...this.providers.keys()];

}

// =====================================================
// ACTIVE PROVIDER
// =====================================================

setActive(name) {

if (!this.providers.has(name)) {

  throw new Error(
    `Provider not found: ${name}`
  );
}

this.activeProvider = name;

return true;

}

getActive() {

return this.providers.get(
  this.activeProvider
);

}

getActiveName() {

return this.activeProvider;

}

// =====================================================
// CAPABILITIES
// =====================================================

getCapabilities(name) {

const item =
  this.providers.get(name);

return item?.capabilities || {};

}

// =====================================================
// HEALTH CHECK
// =====================================================

async healthCheck(name) {

const item =
  this.providers.get(name);

if (!item) {

  return {
    healthy: false,
    reason: "PROVIDER_NOT_FOUND"
  };
}

try {

  if (
    typeof item.provider.health ===
    "function"
  ) {

    const result =
      await item.provider.health();

    this.healthCache[name] =
      result;

    return result;
  }

  return {
    healthy: true,
    reason: "NO_HEALTH_ENDPOINT"
  };

} catch (error) {

  return {
    healthy: false,
    reason:
      error?.message ||
      "HEALTH_CHECK_FAILED"
  };
}

}

// =====================================================
// CHECK ALL PROVIDERS
// =====================================================

async healthCheckAll() {

const results = {};

for (const name of this.list()) {

  results[name] =
    await this.healthCheck(name);
}

return results;

}

// =====================================================
// FAILOVER
// =====================================================

async failover() {

const providers =
  this.list();

for (const name of providers) {

  const health =
    await this.healthCheck(name);

  if (health?.healthy) {

    this.activeProvider = name;

    return {
      success: true,
      provider: name
    };
  }
}

return {
  success: false,
  reason:
    "NO_HEALTHY_PROVIDER_FOUND"
};

}

// =====================================================
// REGISTRY STATUS
// =====================================================

status() {

return {

  activeProvider:
    this.activeProvider,

  providerCount:
    this.providers.size,

  providers:
    this.list(),

  healthCache:
    this.healthCache
};

}
}
