// ======================================================
// STAGE 26 — MULTI-REGION FAILOVER SYSTEM
// LATENCY AWARE ROUTING + HEALTH MONITORING
// ======================================================

export class MultiRegionFailoverLayer {
  constructor() {
    this.regions = new Map();

    this.primaryRegion = null;

    // -----------------------------
    // CONFIG
    // -----------------------------
    this.config = {
      failoverThreshold: 0.6,
      latencyWeight: 0.4,
      healthWeight: 0.6
    };
  }

  // =====================================================
  // REGISTER REGION
  // =====================================================

  registerRegion({ id, endpoint }) {
    this.regions.set(id, {
      id,
      endpoint,
      health: 1,
      latency: 100,
      active: true,
      lastCheck: Date.now()
    });

    if (!this.primaryRegion) {
      this.primaryRegion = id;
    }
  }

  // =====================================================
  // UPDATE REGION HEALTH
  // =====================================================

  updateHealth(regionId, metrics) {
    const region = this.regions.get(regionId);
    if (!region) return;

    region.health = metrics.health ?? region.health;
    region.latency = metrics.latency ?? region.latency;
    region.lastCheck = Date.now();

    if (region.health < this.config.failoverThreshold) {
      region.active = false;
    } else {
      region.active = true;
    }
  }

  // =====================================================
  // ROUTE DECISION ENGINE
  // =====================================================

  route() {
    const candidates = [...this.regions.values()].filter(r => r.active);

    if (candidates.length === 0) {
      throw new Error("NO_ACTIVE_REGIONS");
    }

    let best = null;
    let bestScore = -Infinity;

    for (const region of candidates) {
      const score =
        (region.health * this.config.healthWeight) -
        (region.latency / 1000 * this.config.latencyWeight);

      if (score > bestScore) {
        bestScore = score;
        best = region;
      }
    }

    this.primaryRegion = best.id;

    return {
      region: best.id,
      endpoint: best.endpoint,
      score: bestScore
    };
  }

  // =====================================================
  // FAILOVER LOGIC
  // =====================================================

  failover() {
    const active = [...this.regions.values()].filter(r => r.active);

    if (active.length === 0) {
      throw new Error("SYSTEM_OFFLINE_ALL_REGIONS_DOWN");
    }

    const sorted = active.sort(
      (a, b) => (b.health - a.health) + (a.latency - b.latency) / 100
    );

    this.primaryRegion = sorted[0].id;

    return {
      failoverTo: this.primaryRegion,
      reason: "AUTOMATIC_FAILOVER"
    };
  }

  // =====================================================
  // SYSTEM STATUS
  // =====================================================

  getStatus() {
    return {
      primary: this.primaryRegion,
      regions: [...this.regions.values()]
    };
  }
}
