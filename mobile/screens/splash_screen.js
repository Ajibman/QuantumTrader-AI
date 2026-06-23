// QuantumTrader-AI
// mobile/screens/splash_screen.js
// Production Startup Screen

export function renderSplashScreen({

  router,
  appState,
  bootManager

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    return;
  }

  root.innerHTML = `

    <div class="qta-splash">

      <div class="qta-splash-content">

        <div class="qta-logo">
          QuantumTrader-AI
        </div>

        <div
          id="qta-boot-status"
          class="qta-status"
        >
          Initializing...
        </div>

        <div
          class="qta-loader"
        ></div>

      </div>

    </div>

  `;

  const statusElement =
    document.getElementById(
      "qta-boot-status"
    );

  initializeBoot(
    statusElement,
    router,
    appState,
    bootManager
  );
}

// =====================================
// BOOT FLOW
// =====================================

async function initializeBoot(

  statusElement,

  router,

  appState,

  bootManager

) {

  try {

    updateStatus(
      statusElement,
      "Verifying API..."
    );

    await delay(300);

    updateStatus(
      statusElement,
      "Restoring Session..."
    );

    await delay(300);

    updateStatus(
      statusElement,
      "Checking System Health..."
    );

    await delay(300);

    const result =
      await bootManager.start();

    if (
      result?.success
    ) {

      appState.update(
        "app",
        {
          initialized: true
        }
      );

      return;
    }

    router.navigate(
      "startup_error",
      {
        error:
          result?.error ||
          "Boot failed"
      }
    );

  } catch (error) {

    router.navigate(
      "startup_error",
      {
        error:
          error.message
      }
    );
  }
}

// =====================================
// STATUS UPDATE
// =====================================

function updateStatus(
  element,
  message
) {

  if (!element) {
    return;
  }

  element.textContent =
    message;
}

// =====================================
// DELAY
// =====================================

function delay(ms) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );
}
