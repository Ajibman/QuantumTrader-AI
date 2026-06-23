// QuantumTrader-AI
// mobile/boot/boot_manager.js
// Production Startup Orchestrator

export class BootManager {

  constructor({

    apiLayer,
    sessionManager,
    router,
    healthProvider,
    errorPolicy

  }) {

    this.apiLayer = apiLayer;

    this.sessionManager =
      sessionManager;

    this.router = router;

    this.healthProvider =
      healthProvider;

    this.errorPolicy =
      errorPolicy;
  }

  // =====================================
  // APPLICATION START
  // =====================================

  async start() {

    try {

      const bootReport = {

        api: false,

        session: false,

        health: false,

        routing: false
      };

      // -----------------------------
      // STEP 1 — API AVAILABILITY
      // -----------------------------

      await this.verifyApi();

      bootReport.api = true;

      // -----------------------------
      // STEP 2 — SESSION RECOVERY
      // -----------------------------

      const session =
        await this.restoreSession();

      bootReport.session = true;

      // -----------------------------
      // STEP 3 — HEALTH CHECK
      // -----------------------------

      await this.verifyHealth(
        session
      );

      bootReport.health = true;

      // -----------------------------
      // STEP 4 — ROUTE USER
      // -----------------------------

      await this.routeUser(
        session
      );

      bootReport.routing = true;

      return {

        success: true,

        bootReport
      };

    } catch (error) {

      return this.handleBootFailure(
        error
      );
    }
  }

  // =====================================
  // VERIFY API
  // =====================================

  async verifyApi() {

    if (!this.apiLayer) {

      throw new Error(
        "API layer unavailable"
      );
    }

    return true;
  }

  // =====================================
  // RESTORE SESSION
  // =====================================

  async restoreSession() {

    const token =
      localStorage.getItem(
        "qta_session_token"
      );

    if (!token) {

      return null;
    }

    const restored =
      this.sessionManager.restore(
        token
      );

    if (!restored?.success) {

      localStorage.removeItem(
        "qta_session_token"
      );

      return null;
    }

    return restored;
  }

  // =====================================
  // HEALTH CHECK
  // =====================================

  async verifyHealth(
    session
  ) {

    if (
      !this.healthProvider
    ) {
      return true;
    }

    const result =
      this.healthProvider.score();

    if (
      result?.status ===
      "critical"
    ) {

      throw new Error(
        "System health critical"
      );
    }

    return true;
  }

  // =====================================
  // ROUTE USER
  // =====================================

  async routeUser(
    session
  ) {

    if (!this.router) {

      throw new Error(
        "Router unavailable"
      );
    }

    if (!session) {

      this.router.navigate(
        "login"
      );

      return;
    }

    this.router.navigate(
      "dashboard"
    );
  }

  // =====================================
  // FAILURE HANDLER
  // =====================================

  handleBootFailure(
    error
  ) {

    let response;

    if (
      this.errorPolicy &&
      typeof this.errorPolicy
        .normalize ===
      "function"
    ) {

      response =
        this.errorPolicy
          .normalize(error);

    } else {

      response = {

        success: false,

        error: {

          code:
            "BOOT_FAILURE",

          message:
            error.message,

          retryable: true
        }
      };
    }

    if (
      this.router &&
      typeof this.router
        .navigate ===
      "function"
    ) {

      this.router.navigate(
        "startup_error"
      );
    }

    return response;
  }
  }
