// QuantumTrader-AI
// core/api/system_api_contract_layer.js
// Production API Contract Enforcement Layer

const API_VERSION = "v1";

const BASE_URL = "/api";


// =====================================
// SAFE REQUEST CORE
// =====================================

async function request(endpoint, options = {}) {

  try {

    const response =
      await fetch(
        `${BASE_URL}/${API_VERSION}/${endpoint}`,
        {
          method:
            options.method || "GET",

          headers: {
            "Content-Type":
              "application/json",

            ...(options.headers || {})
          },

          body:
            options.body
              ? JSON.stringify(
                  options.body
                )
              : undefined
        }
      );

    const data =
      await response.json();

    // Normalize all responses
    return normalizeResponse(
      data,
      response.status
    );

  } catch (error) {

    return normalizeError(
      error
    );
  }
}

// =====================================
// RESPONSE NORMALIZER
// =====================================

function normalizeResponse(
  data,
  status
) {

  if (status >= 200 && status < 300) {

    return {

      success: true,

      version: API_VERSION,

      code:
        data?.code || "OK",

      timestamp:
        Date.now(),

      data:
        data?.data || data
    };
  }

  return normalizeError({
    message:
      data?.message ||
      "Request failed",

    status
  });
}

// =====================================
// ERROR NORMALIZER
// =====================================

function normalizeError(
  error
) {

  return {

    success: false,

    version: API_VERSION,

    code: "ERROR",

    timestamp:
      Date.now(),

    error: {

      message:
        error?.message ||
        "Unknown error",

      status:
        error?.status || 500
    }
  };
}

// =====================================
// PUBLIC API METHODS
// =====================================

export const apiLayer = {

  // -----------------------------
  // AUTH
  // -----------------------------

  login(credentials) {

    return request(
      "auth/login",
      {
        method: "POST",
        body: credentials
      }
    );
  },

  // -----------------------------
  // MARKET DATA
  // -----------------------------

  getMarketData(symbol) {

    return request(
      `market/${symbol}`
    );
  },

  // -----------------------------
  // CPILOT
  // -----------------------------

  getCPilotState() {

    return request(
      "cpilot/state"
    );
  },

  // -----------------------------
  // SIMULATION
  // -----------------------------

  runSimulation(symbol) {

    return request(
      "traderlab/simulate",
      {
        method: "POST",
        body: { symbol }
      }
    );
  },

  // -----------------------------
  // MARKET ANALYSIS
  // -----------------------------

  analyzeMarket(symbol) {

    return request(
      "traderlab/analyze",
      {
        method: "POST",
        body: { symbol }
      }
    );
  },

  // -----------------------------
  // HEALTH
  // -----------------------------

  getSystemHealth() {

    return request(
      "system/health"
    );
  },

  // -----------------------------
  // AUDIT LOGS
  // -----------------------------

  getAuditLogs() {

    return request(
      "system/audit"
    );
  }
};
