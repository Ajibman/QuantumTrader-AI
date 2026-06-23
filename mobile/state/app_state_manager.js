// QuantumTrader-AI
// mobile/state/app_state_manager.js
// Production Application State Manager

export class AppStateManager {

  constructor() {

    this.state = {

      // ==========================
      // SESSION
      // ==========================

      session: {

        token: null,

        authenticated: false,

        userId: null,

        expiresAt: null
      },

      // ==========================
      // APP
      // ==========================

      app: {

        initialized: false,

        version: "1.0.0",

        environment:
          "production"
      },

      // ==========================
      // ROUTING
      // ==========================

      navigation: {

        currentRoute:
          "splash",

        previousRoute:
          null
      },

      // ==========================
      // SYSTEM
      // ==========================

      system: {

        status: "unknown",

        healthScore: 0,

        lastUpdate: null
      },

      // ==========================
      // MARKET
      // ==========================

      market: {

        selectedSymbol:
          null,

        lastPrice: null,

        lastSignal: null
      }
    };

    this.listeners =
      new Set();
  }

  // =====================================
  // GET FULL STATE
  // =====================================

  getState() {

    return structuredClone(
      this.state
    );
  }

  // =====================================
  // GET SECTION
  // =====================================

  get(key) {

    return this.state[key];
  }

  // =====================================
  // UPDATE SECTION
  // =====================================

  update(
    section,
    updates
  ) {

    if (
      !this.state[section]
    ) {

      return false;
    }

    this.state[section] = {

      ...this.state[section],

      ...updates
    };

    this.notify();

    return true;
  }

  // =====================================
  // SESSION
  // =====================================

  setSession({

    token,

    authenticated,

    userId,

    expiresAt

  }) {

    this.update(
      "session",
      {

        token,

        authenticated,

        userId,

        expiresAt
      }
    );
  }

  clearSession() {

    this.update(
      "session",
      {

        token: null,

        authenticated:
          false,

        userId: null,

        expiresAt: null
      }
    );
  }

  // =====================================
  // ROUTING
  // =====================================

  setRoute(
    routeName
  ) {

    this.update(
      "navigation",
      {

        previousRoute:
          this.state.navigation
            .currentRoute,

        currentRoute:
          routeName
      }
    );
  }

  // =====================================
  // SYSTEM STATUS
  // =====================================

  setSystemStatus({

    status,

    healthScore

  }) {

    this.update(
      "system",
      {

        status,

        healthScore,

        lastUpdate:
          Date.now()
      }
    );
  }

  // =====================================
  // MARKET
  // =====================================

  setMarketState({

    selectedSymbol,

    lastPrice,

    lastSignal

  }) {

    this.update(
      "market",
      {

        selectedSymbol,

        lastPrice,

        lastSignal
      }
    );
  }

  // =====================================
  // LISTENERS
  // =====================================

  subscribe(
    callback
  ) {

    this.listeners.add(
      callback
    );

    return () => {

      this.listeners.delete(
        callback
      );
    };
  }

  notify() {

    const snapshot =
      this.getState();

    for (
      const listener
      of this.listeners
    ) {

      try {

        listener(snapshot);

      } catch (error) {

        console.error(
          "State listener error",
          error
        );
      }
    }
  }

  // =====================================
  // PERSISTENCE
  // =====================================

  persist() {

    localStorage.setItem(
      "qta_app_state",

      JSON.stringify(
        this.state
      )
    );
  }

  restore() {

    const saved =
      localStorage.getItem(
        "q
