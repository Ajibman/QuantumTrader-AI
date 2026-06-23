// QuantumTrader-AI
// mobile/router/app_router.js
// Production Navigation Router

export class AppRouter {

  constructor({

    rootElementId = "app"

  } = {}) {

    this.root =
      document.getElementById(
        rootElementId
      );

    this.currentRoute = null;

    this.routes = new Map();
  }

  // =====================================
  // REGISTER ROUTE
  // =====================================

  register(
    routeName,
    screenRenderer
  ) {

    this.routes.set(
      routeName,
      screenRenderer
    );
  }

  // =====================================
  // NAVIGATE
  // =====================================

  navigate(routeName, data = {}) {

    if (
      !this.routes.has(
        routeName
      )
    ) {

      console.error(
        `Route not found: ${routeName}`
      );

      return false;
    }

    try {

      const renderScreen =
        this.routes.get(
          routeName
        );

      this.currentRoute =
        routeName;

      if (this.root) {

        this.root.innerHTML = "";
      }

      renderScreen({
        router: this,
        data
      });

      return true;

    } catch (error) {

      console.error(
        "Navigation Error",
        error
      );

      if (
        routeName !==
        "startup_error"
      ) {

        this.navigate(
          "startup_error",
          {
            error:
              error.message
          }
        );
      }

      return false;
    }
  }

  // =====================================
  // CURRENT ROUTE
  // =====================================

  getCurrentRoute() {

    return this.currentRoute;
  }

  // =====================================
  // ROUTE EXISTS
  // =====================================

  hasRoute(
    routeName
  ) {

    return this.routes.has(
      routeName
    );
  }

  // =====================================
  // RESET
  // =====================================

  reset() {

    this.currentRoute =
      null;
  }
}
