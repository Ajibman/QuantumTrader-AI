// QuantumTrader-AI
// mobile/screens/cpilot_screen.js
// Production CPilot Intelligence Viewer (Read-Only)

export function renderCPilotScreen({

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

  const system =
    state.system || {};

  const market =
    state.market || {};

  root.innerHTML = `

    <div class="qta-cpilot">

      <!-- HEADER -->

      <div class="qta-cpilot-header">

        <h1>
          CPilot Intelligence
        </h1>

        <p>
          System-generated decision insights
        </p>

      </div>

      <!-- INTELLIGENCE PANEL -->

      <div class="qta-cpilot-panel">

        <div class="qta-card">

          <h3>System Status</h3>

          <p>
            ${
              system.status ||
              "Unknown"
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Health Score</h3>

          <p>
            ${
              system.healthScore ??
              0
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Market Context</h3>

          <p>
            ${
              market.selectedSymbol ||
              "No symbol selected"
            }
          </p>

        </div>

      </div>

      <!-- CPILOT ACTION STATE -->

      <div class="qta-cpilot-insight">

        <h3>Decision State</h3>

        <p id="cpilot-state">
          Fetching CPilot state...
        </p>

      </div>

      <!-- ACTIONS -->

      <div class="qta-cpilot-actions">

        <button id="dashboard-btn">
          Dashboard
        </button>

        <button id="refresh-btn">
          Refresh Insight
        </button>

      </div>

    </div>

  `;

  attachHandlers({
    router,
    appState,
    apiLayer
  });

  loadCPilotInsight({
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
      loadCPilotInsight({
        appState,
        apiLayer
      })
  );
}

// =====================================
// LOAD CPILOT INSIGHT
// =====================================

async function loadCPilotInsight({

  appState,
  apiLayer

}) {

  const el =
    document.getElementById(
      "cpilot-state"
    );

  try {

    // Optional safe API hook (contract-bound)
    const response =
      apiLayer?.getCPilotState
        ? await apiLayer.getCPilotState()
        : null;

    if (
      !response?.success
    ) {

      if (el) {
        el.textContent =
          "CPilot unavailable";
      }

      return;
    }

    const data =
      response.data;

    if (el) {

      el.textContent =
        data?.state ||
        "No insight available";
    }

    // Optional state sync (read-only mirror)
    appState.update(
      "system",
      {
        cpilotState:
          data?.state || null
      }
    );

  } catch (error) {

    if (el) {

      el.textContent =
        "Failed to load CPilot";
    }

    console.error(
      "CPilot screen error",
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
