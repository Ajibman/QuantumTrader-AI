// QuantumTrader-AI
// mobile/screens/login_screen.js
// Production Authentication Screen

export function renderLoginScreen({

  router,
  appState,
  apiLayer

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    return;
  }

  root.innerHTML = `

    <div class="qta-login">

      <div class="qta-login-card">

        <h1>
          QuantumTrader-AI
        </h1>

        <p>
          Sign in to continue
        </p>

        <input
          id="qta-username"
          type="text"
          placeholder="Username"
        />

        <input
          id="qta-password"
          type="password"
          placeholder="Password"
        />

        <button
          id="qta-login-btn"
        >
          Login
        </button>

        <div
          id="qta-login-status"
          class="qta-login-status"
        ></div>

      </div>

    </div>

  `;

  const button =
    document.getElementById(
      "qta-login-btn"
    );

  button?.addEventListener(
    "click",
    () =>
      handleLogin({
        router,
        appState,
        apiLayer
      })
  );
}

// =====================================
// LOGIN FLOW
// =====================================

async function handleLogin({

  router,
  appState,
  apiLayer

}) {

  const username =
    document
      .getElementById(
        "qta-username"
      )
      ?.value
      ?.trim();

  const password =
    document
      .getElementById(
        "qta-password"
      )
      ?.value;

  const status =
    document.getElementById(
      "qta-login-status"
    );

  try {

    setStatus(
      status,
      "Authenticating..."
    );

    // ---------------------------------
    // API CONTRACT ENTRY
    // ---------------------------------

    const response =
      await apiLayer.login({

        username,
        password
      });

    if (
      !response?.success
    ) {

      setStatus(
        status,
        response?.error
          ?.message ||
          "Login failed"
      );

      return;
    }

    const session =
      response.data;

    // ---------------------------------
    // SESSION STORAGE
    // ---------------------------------

    localStorage.setItem(
      "qta_session_token",
      session.sessionToken
    );

    // ---------------------------------
    // APP STATE UPDATE
    // ---------------------------------

    appState.setSession({

      token:
        session.sessionToken,

      authenticated:
        true,

      userId:
        session.userId,

      expiresAt:
        session.expiresAt
    });

    setStatus(
      status,
      "Login successful"
    );

    // ---------------------------------
    // ROUTE USER
    // ---------------------------------

    router.navigate(
      "dashboard"
    );

  } catch (error) {

    setStatus(
      status,
      error.message ||
      "Authentication failed"
    );
  }
}

// =====================================
// STATUS
// =====================================

function setStatus(
  element,
  message
) {

  if (!element) {
    return;
  }

  element.textContent =
    message;
}
