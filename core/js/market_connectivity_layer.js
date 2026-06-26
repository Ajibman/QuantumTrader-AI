 /**
 * =====================================================
 * QuantumTrader-AI
 * STAGE 36A — MARKET CONNECTIVITY LAYER
 * Version: 2.0 Production
 * =====================================================
 *
 * Purpose:
 * Provides a unified abstraction layer over all market
 * data providers used throughout QuantumTrader-AI.
 *
 * Responsibilities:
 * • Provider registration
 * • Market data aggregation
 * • Provider failover
 * • Health monitoring
 * • Market cache
 * • Event broadcasting
 * • Latency monitoring
 * • Paper / Live mode management
 *
 * NOTE:
 * This layer DOES NOT execute trades.
 * All execution is handled by ExchangeGateway.
 *
 * =====================================================
 *
 * SECTION INDEX
 *
 * 1. Constructor
 * 2. Configuration
 * 3. Provider Registration
 * 4. Event Hub
 * 5. Health Management
 * 6. Cache Management
 * 7. Diagnostics
 * 8. Utilities
 *
 * =====================================================
 */

export class MarketConnectivityLayer {

    // =====================================================
    // SECTION 1 — CONSTRUCTOR
    // =====================================================

    constructor(config = {}) {

        this.mode = config.mode ?? "PAPER";

        this.debug = config.debug ?? false;

        this.providers = new Map();

        this.providerHealth = new Map();

        this.providerLatency = new Map();

        this.marketCache = new Map();

        this.requestCounters = new Map();

        this.lastTick = null;

        this.primaryProvider = null;

        this.eventHub = null;

        this.defaultCacheTTL = 3000;

        this.startedAt = Date.now();

    }

    // =====================================================
    // SECTION 2 — CONFIGURATION
    // =====================================================

    setMode(mode) {

        this.mode = mode;

        return this;

    }

    getMode() {

        return this.mode;

    }

    enableDebug() {

        this.debug = true;

    }

    disableDebug() {

        this.debug = false;

    }

    setPrimaryProvider(providerName) {

        if (this.providers.has(providerName)) {

            this.primaryProvider = providerName;

        }

        return this;

    }

    attachEventHub(eventHub) {

        this.eventHub = eventHub;

        return this;

    }

    // =====================================================
    // SECTION 3 — PROVIDER REGISTRATION
    // =====================================================

    registerProvider(name, provider) {

        if (!name || !provider) {

            throw new Error("Invalid provider registration.");

        }

        this.providers.set(name, provider);

        this.providerHealth.set(name, {

            online: true,

            latency: 0,

            failures: 0,

            lastSeen: Date.now()

        });

        if (!this.primaryProvider) {

            this.primaryProvider = name;

        }

        return this;

    }

    unregisterProvider(name) {

        this.providers.delete(name);

        this.providerHealth.delete(name);

        this.providerLatency.delete(name);

    }

    getProviders() {

        return [...this.providers.keys()];

    }

    hasProvider(name) {

        return this.providers.has(name);

 }

// =====================================================
    // SECTION 4 — PROVIDER HEALTH MANAGEMENT
    // =====================================================

    updateProviderHealth(name, online = true, latency = 0) {

        if (!this.providerHealth.has(name)) return;

        const health = this.providerHealth.get(name);

        health.online = online;
        health.latency = latency;
        health.lastSeen = Date.now();

        if (!online) {
            health.failures++;
        }

        this.providerLatency.set(name, latency);

    }

    getProviderHealth(name) {

        return this.providerHealth.get(name) ?? null;

    }

    getAllProviderHealth() {

        return [...this.providerHealth.entries()];

    }

    isProviderHealthy(name) {

        const health = this.providerHealth.get(name);

        return health ? health.online : false;

    }

    // =====================================================
    // SECTION 5 — CACHE MANAGEMENT
    // =====================================================

    cacheMarketData(symbol, data) {

        this.marketCache.set(symbol, {

            data,

            timestamp: Date.now()

        });

    }

    getCachedData(symbol) {

        const cache = this.marketCache.get(symbol);

        if (!cache) return null;

        const expired =
            (Date.now() - cache.timestamp) >
            this.defaultCacheTTL;

        if (expired) {

            this.marketCache.delete(symbol);

            return null;

        }

        return cache.data;

    }

    clearCache() {

        this.marketCache.clear();

    }

    // =====================================================
    // SECTION 6 — FAILOVER ENGINE
    // =====================================================

    getAvailableProviders() {

        const available = [];

        for (const [name] of this.providers) {

            if (this.isProviderHealthy(name)) {

                available.push(name);

            }

        }

        return available;

    }

    getNextProvider(currentProvider = null) {

        const available = this.getAvailableProviders();

        if (available.length === 0) {

            return null;

        }

        if (!currentProvider) {

            return available[0];

        }

        const index = available.indexOf(currentProvider);

        if (index === -1) {

            return available[0];

        }

        return available[(index + 1) % available.length];

    }

    markProviderFailure(name) {

        if (!this.providerHealth.has(name)) return;

        const health = this.providerHealth.get(name);

        health.online = false;

        health.failures++;

        health.lastSeen = Date.now();

    }

    restoreProvider(name) {

        if (!this.providerHealth.has(name)) return;

        const health = this.providerHealth.get(name);

        health.online = true;

        health.lastSeen = Date.now();

    }

 // =====================================================
    // SECTION 7 — UNIFIED MARKET DATA ENGINE
    // =====================================================

    async getMarketData(symbol, options = {}) {

        // Return cached data first (unless disabled)
        if (!options.bypassCache) {

            const cached = this.getCachedData(symbol);

            if (cached) {

                return cached;

            }

        }

        const providers = [];

        // Primary provider first
        if (
            this.primaryProvider &&
            this.providers.has(this.primaryProvider) &&
            this.isProviderHealthy(this.primaryProvider)
        ) {

            providers.push(this.primaryProvider);

        }

        // Remaining healthy providers
        for (const name of this.getAvailableProviders()) {

            if (!providers.includes(name)) {

                providers.push(name);

            }

        }

        if (providers.length === 0) {

            throw new Error("No market providers available.");

        }

        let lastError = null;

        for (const providerName of providers) {

            const provider = this.providers.get(providerName);

            if (!provider || typeof provider.getPrice !== "function") {

                continue;

            }

            const started = performance.now();

// Count this provider request
this.incrementRequestCounter(providerName);

try {

    const result = await provider.getPrice(symbol);
 
            try {
           
                const latency = performance.now() - started;

                this.updateProviderHealth(
                    providerName,
                    true,
                    latency
                );

                const marketTick = {

                    symbol: this.normalizeSymbol(symbol),

                    source: providerName,

                    mode: this.mode,

                    timestamp: Date.now(),

                    latency,

                    data: result

                };

                this.lastTick = marketTick;

                this.cacheMarketData(symbol, marketTick);

                this.broadcastMarketTick(marketTick);

                return marketTick;

            } catch (error) {

                lastError = error;

                this.markProviderFailure(providerName);

            }

        }

        throw lastError ??
            new Error("Unable to retrieve market data.");

    }

    // =====================================================
    // SECTION 8 — SYMBOL NORMALIZATION
    // =====================================================

    normalizeSymbol(symbol) {

        if (!symbol) return "";

        return symbol
            .toUpperCase()
            .replace("-", "")
            .replace("/", "")
            .replace("_", "");

    }

    // =====================================================
    // SECTION 9 — MARKET EVENT BROADCASTING
    // =====================================================

    broadcastMarketTick(tick) {

        if (!this.eventHub) {

            return;

        }

        if (typeof this.eventHub.emit === "function") {

            this.eventHub.emit("market:tick", tick);

        }

    }

    broadcastMarketStatus(status) {

        if (!this.eventHub) {

            return;

        }

        if (typeof this.eventHub.emit === "function") {

            this.eventHub.emit("market:status", status);

        // =====================================================
    // SECTION 10 — REQUEST STATISTICS
    // =====================================================

    incrementRequestCounter(providerName) {

        const count =
            this.requestCounters.get(providerName) ?? 0;

        this.requestCounters.set(
            providerName,
            count + 1
        );

    }

    getRequestCounters() {

        return Object.fromEntries(
            this.requestCounters
        );

    }

    resetRequestCounters() {

        this.requestCounters.clear();

    }

    // =====================================================
    // SECTION 11 — DIAGNOSTICS
    // =====================================================

    getLastTick() {

        return this.lastTick;

    }

    getSystemStatus() {

        return {

            mode: this.mode,

            uptime:
                Date.now() - this.startedAt,

            providerCount:
                this.providers.size,

            availableProviders:
                this.getAvailableProviders(),

            primaryProvider:
                this.primaryProvider,

            cacheSize:
                this.marketCache.size,

            lastTick:
                this.lastTick,

            debug:
                this.debug

        };

    }

    // =====================================================
    // SECTION 12 — DEBUG UTILITIES
    // =====================================================

    log(...args) {

        if (!this.debug) return;

        console.log(
            "[MarketConnectivityLayer]",
            ...args
        );

    }

    destroy() {

        this.providers.clear();

        this.providerHealth.clear();

        this.providerLatency.clear();

        this.marketCache.clear();

        this.requestCounters.clear();

        this.lastTick = null;

        this.primaryProvider = null;

        this.eventHub = null;

     }

   }

    

