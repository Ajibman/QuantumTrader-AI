export class RoutingEngine {

constructor({
assetResolver,
venueRegistry
}) {

this.assetResolver = assetResolver;
this.venueRegistry = venueRegistry;

this.metrics = {
  routed: 0,
  failed: 0
};

}

// ====================================================
// MAIN ROUTING FUNCTION
// ====================================================

route(order = {}) {

const symbol =
  order.symbol ?? "";

const asset =
  this.assetResolver.resolve(symbol);

if (!asset.resolved) {

  this.metrics.failed++;

  return {
    success: false,
    reason: "ASSET_NOT_RESOLVED"
  };
}

const venues =
  this.venueRegistry.getVenues(asset.class);

if (!venues.length) {

  this.metrics.failed++;

  return {
    success: false,
    reason: "NO_VENUE_AVAILABLE"
  };
}

const activeVenues =
  venues.filter(v => v.active);

if (!activeVenues.length) {

  this.metrics.failed++;

  return {
    success: false,
    reason: "NO_ACTIVE_VENUE"
  };
}

const selected =
  this.selectVenue(
    activeVenues,
    order,
    asset
  );

this.metrics.routed++;

return {
  success: true,

  asset,

  route: {
    venueId: selected.id,
    venueType: selected.type,
    priority: selected.priority
  }
};

}

// ====================================================
// VENUE SELECTION LOGIC
// ====================================================

selectVenue(
venues,
order,
asset
) {

const sorted =
  [...venues]
    .sort(
      (a, b) =>
        a.priority - b.priority
    );

return sorted[0];

}

// ====================================================
// METRICS
// ====================================================

getMetrics() {

return {
  ...this.metrics,

  successRate:
    this.metrics.routed +
    this.metrics.failed === 0
      ? 0
      : this.metrics.routed /
        (
          this.metrics.routed +
          this.metrics.failed
        )
};

}

resetMetrics() {

this.metrics = {
  routed: 0,
  failed: 0
};

}
}
