// QuantumTrader-AI
// mobile/screens/health_screen.js
// Production System Health Screen (Safe Observability Layer)

export function renderHealthScreen({

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

  root.innerHTML = `

    <div class="qta-health">

      <!-- HEADER -->

      <div class="qta-health-header">

        <h1>
          System Health
        </h1>

        <p>
          Live operational stability overview
        </p>

      </div>

      <!-- HEALTH OVERVIEW -->

      <div class="qta-health-grid">

        <div class="qta-card">

          <h3>Status</h3>

          <p id="health-status">
            ${
              system.status ||
              "Unknown"
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Health Score</h3>

          <p id="health-score">
            ${
              system.healthScore ??
              0
            }
          </p>

        </div>

        <div class="qta-card">

          <h3>Last Update</h3>

          <p>
            ${
              system.lastUpdate
                ? new Date(
                    system.lastUpdate
                  ).toLocaleString()
                : "Never"
            }
          </p>

        </div>

      </div>

      <!-- STABILITY INSIGHT -->

      <div class="qta-health-insight">

        <h3>Stability Insight</h3>

        <p id="health-insight">
          Loading system diagnostics...
        </p>

      </div>

      <!-- ACTIONS -->

      <div class="qta-health-actions">

        <button id="refresh-btn">
          Refresh Health
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

  loadHealth({
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
      loadHealth({
        appState,
        apiLayer
      })
  );
}

// =====================================
// HEALTH LOADER
// =====================================

async function loadHealth({

  appState,
  apiLayer

}) {

  const statusEl =
    document.getElementById(
      "health-status"
    );

  const scoreEl =
    document.getElementById(
      "health-score"
    );

  const insightEl =
    document.getElementById(
      "health-insight"
    );

  try {

    const response =
      apiLayer?.getSystemHealth
        ? await apiLayer.getSystemHealth()
        : null;

    if (!response?.success) {

      if (insightEl) {

        insightEl.textContent =
          "Health data unavailable";
      }

      return;
    }

    const data =
      response.data;

    // -----------------------------
    // UI UPDATE
    // -----------------------------

    if (statusEl) {

      statusEl.textContent =
        data?.status ||
        "Unknown";
    }

    if (scoreEl) {

      scoreEl.textContent =
        data?.healthScore ??
        0;
    }

    if (insightEl) {

      insightEl.textContent =
        data?.insight ||
        "No insights available";
    }

    // -----------------------------
    // STATE SYNC
    // -----------------------------

    appState.setSystemStatus({

      status:
        data?.status,

      healthScore:
        data?.healthScore
    });

  } catch (error) {

    if (insightEl) {

      insightEl.textContent =
        "Health check failed";
    }

    console.error(
      "Health screen error",
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
