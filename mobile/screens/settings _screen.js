// QuantumTrader-AI
// mobile/screens/settings_screen.js
// Production Settings Screen

export function renderSettingsScreen({

  router,
  appState,
  sessionManager

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

  const app =
    state.app || {};

  root.innerHTML = `

    <div class="qta-settings">

      <!-- HEADER -->

      <div
        class="qta-settings-header"
      >

        <h1>
          Settings
        </h1>

      </div>

      <!-- APP INFO -->

      <div class="qta-card">

        <h3>
          Application
        </h3>

        <p>
          Version:
          ${app.version || "1.0.0"}
        </p>

        <p>
          Environment:
          ${app.environment || "production"}
        </p>

      </div>

      <!-- SESSION -->

      <div class="qta-card">

        <h3>
          Session
        </h3>

        <p>
          Status:
          ${
            session.authenticated
              ? "Authenticated"
              : "Not Authenticated"
          }
        </p>

        <p>
          User:
          ${
            session.userId ||
            "Unknown"
          }
        </p>

      </div>

      <!-- COMPLIANCE -->

      <div class="qta-card">

        <h3>
          Compliance
        </h3>

        <button
          id="privacy-btn"
        >
          Privacy Policy
        </button>

        <button
          id="terms-btn"
        >
          Terms of Service
        </button>

      </div>

      <!-- ACCOUNT -->

      <div class="qta-card">

        <h3>
          Account
        </h3>

        <button
          id="logout-btn"
        >
          Logout
        </button>

      </div>

      <!-- NAVIGATION -->

      <div
        class="qta-settings-actions"
      >

        <button
          id="dashboard-btn"
        >
          Back to Dashboard
        </button>

      </div>

    </div>

  `;

  attachHandlers({

    router,
    appState,
    sessionManager
  });
}

// =====================================
// HANDLERS
// =====================================

function attachHandlers({

  router,
  appState,
  sessionManager

}) {

  bind(

    "dashboard-btn",

    () =>
      router.navigate(
        "dashboard"
      )
  );

  bind(

    "privacy-btn",

    () => {

      window.open(
        "/privacy-policy.html",
        "_blank"
      );
    }
  );

  bind(

    "terms-btn",

    () => {

      window.open(
        "/terms-of-service.html",
        "_blank"
      );
    }
  );

  bind(

    "logout-btn",

    () => {

      const token =
        localStorage.getItem(
          "qta_session_token"
        );

      if (
        token &&
        sessionManager &&
        typeof sessionManager
          .destroy ===
          "function"
      ) {

        sessionManager.destroy(
          token
        );
      }

      localStorage.removeItem(
        "qta_session_token"
      );

      appState.clearSession();

      router.navigate(
        "login"
      );
    }
  );
}

// =====================================
// BINDER
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
