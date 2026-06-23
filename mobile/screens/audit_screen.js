// QuantumTrader-AI
// mobile/screens/audit_screen.js
// Production Audit & Compliance Trace Screen (Read-Only)

export function renderAuditScreen({

  router,
  appState,
  apiLayer

}) {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) return;

  root.innerHTML = `

    <div class="qta-audit">

      <!-- HEADER -->

      <div class="qta-audit-header">

        <h1>
          Audit Trail
        </h1>

        <p>
          System event trace (read-only)
        </p>

      </div>

      <!-- SUMMARY -->

      <div class="qta-audit-summary">

        <div class="qta-card">

          <h3>Total Events</h3>

          <p id="audit-total">
            Loading...
          </p>

        </div>

        <div class="qta-card">

          <h3>Last Event</h3>

          <p id="audit-last">
            Loading...
          </p>

        </div>

        <div class="qta-card">

          <h3>Status</h3>

          <p id="audit-status">
            Stable
          </p>

        </div>

      </div>

      <!-- TRACE VIEW -->

      <div class="qta-audit-log">

        <h3>Recent Activity</h3>

        <div id="audit-log-list">
          Loading audit logs...
        </div>

      </div>

      <!-- ACTIONS -->

      <div class="qta-audit-actions">

        <button id="refresh-btn">
          Refresh Logs
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

  loadAuditLogs({
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
      loadAuditLogs({
        appState,
        apiLayer
      })
  );
}

// =====================================
// AUDIT LOADER
// =====================================

async function loadAuditLogs({

  appState,
  apiLayer

}) {

  const totalEl =
    document.getElementById(
      "audit-total"
    );

  const lastEl =
    document.getElementById(
      "audit-last"
    );

  const listEl =
    document.getElementById(
      "audit-log-list"
    );

  try {

    const response =
      apiLayer?.getAuditLogs
        ? await apiLayer.getAuditLogs()
        : null;

    if (!response?.success) {

      if (listEl) {

        listEl.textContent =
          "Audit logs unavailable";
      }

      return;
    }

    const data =
      response.data;

    // -----------------------------
    // SUMMARY
    // -----------------------------

    if (totalEl) {

      totalEl.textContent =
        data?.totalEvents ??
        0;
    }

    if (lastEl) {

      lastEl.textContent =
        data?.lastEvent ||
        "None";
    }

    // -----------------------------
    // LOG LIST (SAFE RENDER)
    // -----------------------------

    if (listEl) {

      const logs =
        data?.events || [];

      if (!logs.length) {

        listEl.textContent =
          "No audit events found";

        return;
      }

      listEl.innerHTML =
        logs
          .slice(0, 20)
          .map(
            (log) =>
              `<div class="qta-log-item">
                <strong>${log.type}</strong>
                <p>${log.message}</p>
                <small>${new Date(log.timestamp).toLocaleString()}</small>
              </div>`
          )
          .join("");
    }

  } catch (error) {

    if (listEl) {

      listEl.textContent =
        "Failed to load audit logs";
    }

    console.error(
      "Audit screen error",
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
