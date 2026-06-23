// QuantumTrader-AI
// mobile/screens/dashboard_screen.js
// Production Dashboard Screen

export function renderDashboardScreen({

  router,
  appState

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    return;
  }

  const state =
    appState.getState();

  const session =
    state.session || {};

  const system =
    state.system || {};

  root.innerHTML = `

    <div class="qta-dashboard">

      <!-- HEADER -->

      <div class="qta-dashboard-header">

        <h1>
          QuantumTrader-AI
        </h1>

        <div
          class="qta-session-info"
        >
          User:
          ${
            session.userId ||
            "Guest"
          }
        </div>

      </div>

      <!-- STATUS CARDS -->

      <div
        class="qta-status-grid"
      >

        <div
          class="qta-card"
        >
          <h3>
            System Status
          </h3>

          <p>
            ${
              system.status ||
              "Unknown"
            }
          </p>
        </div>

        <div
          class="qta-card"
        >
          <h3>
            Health Score
          </h3>

          <p>
            ${
              system.healthScore ??
              0
            }
          </p>
        </div>

        <div
          class="qta-card"
        >
          <h3>
            Session
          </h3>

          <p>
            ${
              session.authenticated
                ? "Active"
                : "Inactive"
            }
          </p>
        </div>

      </div>

      <!-- NAVIGATION -->

      <div
        class="qta-nav-grid"
      >

        <button
          id="market-btn"
        >
          Market
        </button>

        <button
          id="cpilot-btn"
        >
          CPilot
        </button>

        <button
          id="traderlab-btn"
        >
          TraderLab
        </button>

        <button
          id="health-btn"
        >
          Health
        </button>

        <button
          id="audit-btn"
        >
          Audit
        </button>

        <button
          id="settings-btn"
        >
          Settings
        </button>

      </div>

    </div>

  `;

  attachHandlers(router);
}

// =====================================
// NAVIGATION
// =====================================

function attachHandlers(
  router
) {

  bind(
    "market-btn",
    () =>
      router.navigate(
        "market"
      )
  );

  bind(
    "cpilot-btn",
    () =>
      router.navigate(
        "cpilot"
      )
  );

  bind(
    "traderlab-btn",
    () =>
      router.navigate(
        "traderlab"
      )
  );

  bind(
    "health-btn",
    () =>
      router.navigate(
        "health"
      )
  );

  bind(
    "audit-btn",
    () =>
      router.navigate(
        "audit"
      )
  );

  bind(
    "settings-btn",
    () =>
      router.navigate(
        "settings"
      )
  );
}

// =====================================
// EVENT BINDER
// =====================================

function bind(
  id,
  callback
) {

  const element =
    document.getElementById(
      id
    );

  if (!element) {
    return;
  }

  element.addEventListener(
    "click",
    callback
  );
}
