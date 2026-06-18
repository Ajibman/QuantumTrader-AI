// =====================================================
// STAGE 21A
// MARKET ACCESS GATEWAY
// ASSET RESOLVER
// =====================================================

export class AssetResolver {

  constructor() {

    this.assetMap = {

      // -----------------------------
      // EQUITIES
      // -----------------------------

      AAPL: {
        class: "EQUITY",
        market: "US_EQUITIES",
        venueType: "STOCK_EXCHANGE"
      },

      MSFT: {
        class: "EQUITY",
        market: "US_EQUITIES",
        venueType: "STOCK_EXCHANGE"
      },

      NVDA: {
        class: "EQUITY",
        market: "US_EQUITIES",
        venueType: "STOCK_EXCHANGE"
      },

      // -----------------------------
      // INDICES
      // -----------------------------

      SPX: {
        class: "INDEX",
        market: "US_INDEX",
        venueType: "INDEX_MARKET"
      },

      NAS100: {
        class: "INDEX",
        market: "US_INDEX",
        venueType: "INDEX_MARKET"
      },

      // -----------------------------
      // COMMODITIES
      // -----------------------------

      GOLD: {
        class: "COMMODITY",
        market: "PRECIOUS_METALS",
        venueType: "COMMODITY_MARKET"
      },

      SILVER: {
        class: "COMMODITY",
        market: "PRECIOUS_METALS",
        venueType: "COMMODITY_MARKET"
      },

      BRENT: {
        class: "COMMODITY",
        market: "ENERGY",
        venueType: "COMMODITY_MARKET"
      },

      // -----------------------------
      // DIGITAL ASSETS
      // -----------------------------

      BTC: {
        class: "CRYPTO",
        market: "DIGITAL_ASSETS",
        venueType: "DIGITAL_ASSET_VENUE"
      },

      ETH: {
        class: "CRYPTO",
        market: "DIGITAL_ASSETS",
        venueType: "DIGITAL_ASSET_VENUE"
      }
    };
  }

  // =====================================================
  // RESOLVE
  // =====================================================

  resolve(symbol) {

    const key =
      String(symbol || "")
        .trim()
        .toUpperCase();

    const asset =
      this.assetMap[key];

    if (!asset) {

      return {
        resolved: false,
        symbol: key,
        class: "UNKNOWN",
        market: "UNKNOWN",
        venueType: "UNKNOWN"
      };
    }

    return {
      resolved: true,
      symbol: key,
      ...asset
    };
  }

  // =====================================================
  // CATEGORY LOOKUP
  // =====================================================

  getAssetClass(symbol) {

    return this.resolve(symbol).class;
  }

  getMarket(symbol) {

    return this.resolve(symbol).market;
  }

  getVenue(symbol) {

    return this.resolve(symbol).venueType;
  }
}
