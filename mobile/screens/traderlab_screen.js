// QuantumTrader-AI
// mobile/screens/traderlab_screen.js
// Production TraderLab (Simulation + Analysis Only)

export function renderTraderLabScreen({

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

    <div class="qta-traderlab">

      <!-- HEADER -->

      <div class="qta-traderlab-header">

        <h1>
          TraderLab
        </h1>

        <p>
          Strategy simulation and analysis environment
        </p>

      </div>

      <!-- CONTEXT PANEL -->

      <div class="qta-card">

        <h3>Active Market Context</h3>

        <p>
          ${
            market.selectedSymbol ||
            "No symbol selected"
          }
        </p>

      </div>

      <!-- STRATEGY PANEL -->

      <div class="qta-traderlab-panel">

        <div class="qta-card">

          <h3>Strategy Mode</h3>

          <p id="strategy-mode">
            Idle
          </p>

        </div>

        <div class="qta-card">

          <h3>Simulation Output</h3>

          <p id="simulation-output">
            Awaiting run...
          </p>

        </div>

      </div>

      <!-- ACTIONS -->

      <div class="qta-traderlab-actions">

        <button id="run-sim-btn">
          Run Simulation
        </button>

        <button id="analyze-btn">
          Analyze Market
        </button>

        <button id="dashboard-btn">
          Dashboard
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
    "run-sim-btn",
    () =>
      runSimulation({
        appState,
        apiLayer
      })
  );

  bind(
    "analyze-btn",
    () =>
      analyzeMarket({
        appState,
        apiLayer
      })
  );
}

// =====================================
// SIMULATION (SAFE CONTRACT LAYER ONLY)
// =====================================

async function runSimulation({

  appState,
  apiLayer

}) {

  const modeEl =
    document.getElementById(
      "strategy-mode"
    );

  const outputEl =
    document.getElementById(
      "simulation-output"
    );

  try {

    if (modeEl) {
      modeEl.textContent =
        "Running simulation...";
    }

    const state =
      appState.getState();

    const symbol =
      state.market
        .selectedSymbol;

    if (!symbol) {

      if (outputEl) {
        outputEl.textContent =
          "No symbol selected";
      }

      return;
    }

    const response =
      apiLayer?.runSimulation
        ? await apiLayer.runSimulation(
            symbol
          )
        : null;

    if (!response?.success) {

      if (outputEl) {
        outputEl.textContent =
          "Simulation unavailable";
      }

      return;
    }

    const data =
      response.data;

    if (outputEl) {

      outputEl.textContent =
        data?.result ||
        "No output";
    }

  } catch (error) {

    if (outputEl) {

      outputEl.textContent =
        "Simulation error";
    }

    console.error(
      "TraderLab simulation error",
      error
    );
  }
}

// =====================================
// MARKET ANALYSIS (READ-ONLY)
// =====================================

async function analyzeMarket({

  appState,
  apiLayer

}) {

  const outputEl =
    document.getElementById(
      "simulation-output"
    );

  try {

    const state =
      appState.getState();

    const symbol =
      state.market
        .selectedSymbol;

    if (!symbol) {

      if (outputEl) {
        outputEl.textContent =
          "No symbol selected";
      }

      return;
    }

    const response =
      apiLayer?.analyzeMarket
        ? await apiLayer.analyzeMarket(
            symbol
          )
        : null;

    if (!response?.success) {

      if (outputEl) {
        outputEl.textContent =
          "Analysis unavailable";
      }

      return;
    }

    const data =
      response.data;

    if (outputEl) {

      outputEl.textContent =
        data?.analysis ||
        "No analysis available";
    }

  } catch (error) {

    if (outputEl) {

      outputEl.textContent =
        "Analysis error";
    }

    console.error(
      "TraderLab analysis error",
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
