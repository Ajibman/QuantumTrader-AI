export class VenueRegistry {

constructor() {

this.venues = {

  // ==========================================
  // EQUITIES
  // ==========================================

  EQUITY: [
    {
      id: "GLOBAL_EQUITY_EXCHANGE",
      type: "STOCK_EXCHANGE",
      priority: 1,
      active: true
    }
  ],

  // ==========================================
  // INDEXES
  // ==========================================

  INDEX: [
    {
      id: "GLOBAL_INDEX_MARKET",
      type: "INDEX_MARKET",
      priority: 1,
      active: true
    }
  ],

  // ==========================================
  // COMMODITIES
  // ==========================================

  COMMODITY: [
    {
      id: "GLOBAL_COMMODITY_MARKET",
      type: "COMMODITY_MARKET",
      priority: 1,
      active: true
    }
  ],

  // ==========================================
  // DIGITAL ASSETS
  // ==========================================

  CRYPTO: [
    {
      id: "DIGITAL_ASSET_NETWORK",
      type: "DIGITAL_ASSET_VENUE",
      priority: 1,
      active: true
    }
  ],

  // ==========================================
  // FIXED INCOME
  // ==========================================

  BOND: [
    {
      id: "GLOBAL_BOND_MARKET",
      type: "FIXED_INCOME_MARKET",
      priority: 1,
      active: true
    }
  ]
};

}

// ==========================================
// GET VENUES FOR ASSET CLASS
// ==========================================

getVenues(assetClass) {

const key =
  String(assetClass || "")
    .trim()
    .toUpperCase();

return this.venues[key] || [];

}

// ==========================================
// PRIMARY VENUE
// ==========================================

getPrimaryVenue(assetClass) {

const venues =
  this.getVenues(assetClass);

if (!venues.length) {
  return null;
}

return venues
  .sort((a, b) => a.priority - b.priority)[0];

}

// ==========================================
// VENUE ACTIVE CHECK
// ==========================================

isVenueActive(venueId) {

for (const group of Object.values(this.venues)) {

  const venue =
    group.find(v => v.id === venueId);

  if (venue) {
    return venue.active;
  }
}

return false;

}

// ==========================================
// REGISTER NEW VENUE
// ==========================================

register(assetClass, venue) {

const key =
  String(assetClass || "")
    .trim()
    .toUpperCase();

if (!this.venues[key]) {
  this.venues[key] = [];
}

this.venues[key].push(venue);

}

// ==========================================
// DEACTIVATE VENUE
// ==========================================

deactivate(venueId) {

for (const group of Object.values(this.venues)) {

  const venue =
    group.find(v => v.id === venueId);

  if (venue) {
    venue.active = false;
  }
}

}
}
