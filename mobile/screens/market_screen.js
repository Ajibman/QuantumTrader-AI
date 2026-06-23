// QuantumTrader-AI
// mobile/screens/market_screen.js
// Production Market Intelligence Screen (Read-Only Layer)

export function renderMarketScreen({

  router,
  appState,
  apiLayer

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) return;

  const state =
    appState.getState();

  const market =
    state.market || {};

  root.innerHTML = `

    <div class="qta-market">

      <!-- HEADER -->

      <div class="qta-market-header">

        <h1>
          Market Intelligence
        </h1>

        <p>
          Live system-fed market view
        </p>

      </div>

      <!-- SYMBOL SELECTOR -->

      <div class="qta-market-selector">

        <input
          id="symbol-input"
          type="text"
          placeholder="Enter symbol (e.g. BTCUSD)"
        />

        <button id="load-symbol-btn">
          Load
        </button>

      </div>

      <!-- MARKET DATA PANEL -->

      <div class="qta-market-panel">

        <div class="qta-card">

          <h3>Selected Symbol</h3>

          <p>
            ${
              market.selectedSymbol ||
              "None"
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Last Price</h3>

          <p>
            ${
              market.lastPrice ??
              "—"
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Last Signal</h3>

          <p>
            ${
              market.lastSignal ||
              "Neutral"
            }
          </p>

        </div>

      </div>

      <!-- NAVIGATION -->

      <div class="qta-market-actions">

        <button id="dashboard-btn">
          Dashboard
        </button>

        <button id="refresh-btn">
          Refresh Data
        </button>

      </div>

    </div>

  `;

  attachHandlers({
    router,
    appState,
    apiLayer
  });
}

// =====================================
// HANDLERS
// =====================================

function attachHandlers({

  router,
  appState,
  apiLayer

}) {

  bind(
    "dashboard-btn",
    () =>
      router.navigate(
        "dashboard"
      )
  );

  bind(
    "refresh-btn",
    () =>
      refreshMarket({
        appState,
        apiLayer
      })
  );

  bind(
    "load-symbol-btn",
    () =>
      loadSymbol({
        appState,
        apiLayer
      })
  );
}

// =====================================
// LOAD SYMBOL
// =====================================

async function loadSymbol({

  appState,
  apiLayer

}) {

  const input =
    document.getElementById(
      "symbol-input"
    );

  const symbol =
    input?.value?.trim();

  if (!symbol) return;

  try {

    const response =
      await apiLayer.getMarketData(
        symbol
      );

    if (!response?.success) {
      return;
    }

    const data =
      response.data;

    appState.setMarketState({

      selectedSymbol:
        symbol,

      lastPrice:
        data.lastPrice,

      lastSignal:
        data.signal
    });

  } catch (error) {

    console.error(
      "Market load error",
      error
    );
  }
}

// =====================================
// REFRESH MARKET
// =====================================

async function refreshMarket({

  appState,
  apiLayer

}) {

  const state =
    appState.getState();

  const symbol =
    state.market
      .selectedSymbol;

  if (!symbol) return;

  try {

    const response =
      await apiLayer.getMarketData(
        symbol
      );

    if (!response?.success) return;

    const data =
      response.data;

    appState.setMarketState({

      selectedSymbol:
        symbol,

      lastPrice:
        data.lastPrice,

      lastSignal:
        data.signal
    });

  } catch (error) {

    console.error(
      "Market refresh error",
      error
    );
  }
}

// =====================================
// BIND UTILITY
// =====================================

function bind(
  id,
  callback
) {

  const el =
    document.getElementById(
      id
    );

  if (!el) return;

  el.addEventListener(
    "click",
    callback
  );
}
