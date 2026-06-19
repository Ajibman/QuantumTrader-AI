 /**

* =====================================================
* QuantumTrader-AI
* STAGE 36A — MARKET CONNECTIVITY LAYER
* =====================================================
* 
* Purpose:
* Provide unified abstraction over all market data
* and execution sources.
* 
* This layer does NOT execute trades directly.
* It standardizes market interaction.
* 
* Supports:
* - Crypto exchanges
* - Forex feeds
* - Stock/ETF data
* - Futures feeds
* 
* =====================================================
  */

export class MarketConnectivityLayer {

constructor(config = {}) {

this.mode = config.mode ?? "PAPER";

this.providers = new Map();

this.lastTick = null;

}

// ---------------------------------------------
// REGISTER DATA PROVIDER
// ---------------------------------------------

registerProvider(name, provider) {
this.providers.set(name, provider);
}

// ---------------------------------------------
// UNIFIED MARKET FEED
// ---------------------------------------------

async getMarketData(symbol) {

const dataSources = [];

for (const [name, provider] of this.providers) {

  if (provider.getPrice) {

    const data = await provider.getPrice(symbol);

    dataSources.push({
      source: name,
      data
    });
  }
}

this.lastTick = {
  symbol,
  dataSources,
  timestamp: Date.now()
};

return this.lastTick;

}

// ---------------------------------------------
// MODE SWITCH (PAPER / LIVE)
// ---------------------------------------------

setMode(mode) {
this.mode = mode;
}
}
