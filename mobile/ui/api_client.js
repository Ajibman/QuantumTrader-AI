// mobile/ui/api_client.js

import { emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * API CLIENT — SYSTEM GATEWAY
 *
 * Responsibilities:
 * - Unified backend communication
 * - Engine + market data access layer
 * - Authenticated request handling
 * - Error normalization
 * - Request lifecycle tracking
 */

export class ApiClient {

  constructor(config = {}) {

    this.baseURL = config.baseURL || "";
    this.timeout = config.timeout || 10000;

    this.authToken = null;

    this.retryCount = config.retryCount || 2;

    this.initialized = true;

  }

  // =========================
  // AUTH ATTACHMENT
  // =========================

  setAuthToken(token) {

    this.authToken = token;

  }

  // =========================
  // CORE REQUEST ENGINE
  // =========================

  async request(endpoint, options = {}, retries = 0) {

    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout
    );

    const headers = {
      "Content-Type": "application/json",
      ...(this.authToken && {
        Authorization: `Bearer ${this.authToken}`
      }),
      ...(options.headers || {})
    };

    emit("API_REQUEST_STARTED", {
      endpoint,
      method: options.method || "GET"
    });

    try {

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status}`
        );
      }

      const data = await response.json();

      emit("API_REQUEST_SUCCESS", {
        endpoint,
        data
      });

      return data;

    } catch (error) {

      clearTimeout(timeoutId);

      emit("API_REQUEST_ERROR", {
        endpoint,
        error: error.message
      });

      // Retry logic
      if (retries < this.retryCount) {

        return this.request(
          endpoint,
          options,
          retries + 1
        );

      }

      return {
        error: true,
        message: error.message
      };

    }

  }

  // =========================
  // MARKET DATA
  // =========================

  getMarketData(symbol) {

    return this.request(
      `/market/data?symbol=${symbol}`
    );

  }

  getPrice(symbol) {

    return this.request(
      `/market/price?symbol=${symbol}`
    );

  }

  // =========================
  // CPILOT ENGINE API
  // =========================

  getCPilotSignal() {

    return this.request(
      `/cpilot/signal`
    );

  }

  sendCPilotFeedback(data) {

    return this.request(
      `/cpilot/feedback`,
      {
        method: "POST",
        body: JSON.stringify(data)
      }
    );

  }

  // =========================
  // META BRAIN API
  // =========================

  getMetaBrainDecision(context) {

    return this.request(
      `/meta/decision`,
      {
        method: "POST",
        body: JSON.stringify(context)
      }
    );

  }

  // =========================
  // TRADER / EXECUTION API
  // =========================

  createOrder(order) {

    return this.request(
      `/order/create`,
      {
        method: "POST",
        body: JSON.stringify(order)
      }
    );

  }

  getOrderStatus(orderId) {

    return this.request(
      `/order/status?id=${orderId}`
    );

  }

  // =========================
  // SYSTEM HEALTH
  // =========================

  ping() {

    return this.request("/health");

  }

}
