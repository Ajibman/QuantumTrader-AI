// QuantumTrader-AI
// mobile/screens/startup_error_screen.js
// Production Startup Error Screen (Recovery Safe)

export function renderStartupErrorScreen({

  router,
  appState,
  error

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    return;
  }

  const message =
    error?.message ||
    "Unknown startup error";

  root.innerHTML = `

    <div class="qta-error">

      <!-- HEADER -->

      <div class="qta-error-header">

        <h1>
          Startup Issue
        </h1>

        <p>
          QuantumTrader-AI could not start correctly.
        </p>

      </div>

      <!-- ERROR BOX -->

      <div class="qta-error-box">

        <h3>
          What happened
        </h3>

        <p>
          ${message}
        </p>

      </div>

      <!-- RECOVERY OPTIONS -->

      <div class="qta-error-actions">

        <button id="retry-btn">
          Retry Startup
        </button>

        <button id="login-btn">
          Go to Login
        </button>

        <button id="reset-btn">
          Reset Session
        </button>

      </div>

      <!-- TECH DETAILS (collapsed style) -->

      <details class="qta-error-details">

        <summary>
          Technical Details
        </summary>

        <pre>
${JSON.stringify(error || {}, null, 2)}
        </pre>

      </details>

    </div>

  `;

  attachHandlers({

    router,
    appState
  });
}

// =====================================
// HANDLERS
// =====================================

function attachHandlers({

  router,
  appState

}) {

  bind(

    "retry-btn",

    () => {

      router.navigate(
        "splash"
      );
    }
  );

  bind(

    "login-btn",

    () => {

      router.navigate(
        "login"
      );
    }
  );

  bind(

    "reset-btn",

    () => {

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
// BIND UTIL
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
