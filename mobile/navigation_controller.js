// mobile/ui/navigation_controller.js

import { emit, on } from "./event_system.js";

/**
 * QuantumTrader-AI
 * Navigation Controller
 *
 * Responsibilities:
 * - Route management
 * - View lifecycle coordination
 * - Navigation history
 * - Active screen tracking
 */

const navigationState = {

  currentView: "dashboard",

  previousView: null,

  history: ["dashboard"],

  registeredViews: new Map()

};

/**
 * Register View
 */
export function registerView(
  viewName,
  viewHandler
) {

  navigationState.registeredViews.set(
    viewName,
    viewHandler
  );

}

/**
 * Initialize Navigation
 */
export function initializeNavigation() {

  registerNavigationEvents();

  console.log(
    "[Navigation] Initialized"
  );

  emit("NAVIGATION_READY");

}

/**
 * Register Navigation Events
 */
function registerNavigationEvents() {

  on("NAVIGATE", payload => {

    navigateTo(
      payload?.view,
      payload?.data
    );

  });

}

/**
 * Navigate To View
 */
export function navigateTo(
  viewName,
  data = {}
) {

  if (
    !navigationState.registeredViews.has(
      viewName
    )
  ) {

    console.warn(
      `[Navigation] View not registered: ${viewName}`
    );

    return false;

  }

  navigationState.previousView =
    navigationState.currentView;

  navigationState.currentView =
    viewName;

  navigationState.history.push(
    viewName
  );

  const viewHandler =
    navigationState.registeredViews.get(
      viewName
    );

  try {

    if (
      typeof viewHandler === "function"
    ) {

      viewHandler(data);

    }

    emit("VIEW_CHANGED", {
      currentView:
        navigationState.currentView,
      previousView:
        navigationState.previousView,
      data
    });

    emit("NAVIGATION_UPDATED", {
      ...getNavigationState()
    });

    console.log(
      `[Navigation] ${navigationState.previousView} → ${viewName}`
    );

    return true;

  } catch (error) {

    console.error(
      "[Navigation] Navigation Error",
      error
    );

    emit("NAVIGATION_ERROR", {
      view: viewName,
      error: error.message
    });

    return false;

  }

}

/**
 * Navigate Back
 */
export function navigateBack() {

  if (
    navigationState.history.length < 2
  ) {
    return;
  }

  navigationState.history.pop();

  const previousView =
    navigationState.history[
      navigationState.history.length - 1
    ];

  navigateTo(previousView);

}

/**
 * Current View
 */
export function getCurrentView() {

  return navigationState.currentView;

}

/**
 * Navigation State
 */
export function getNavigationState() {

  return {

    currentView:
      navigationState.currentView,

    previousView:
      navigationState.previousView,

    history: [
      ...navigationState.history
    ]

  };

}

/**
 * Reset Navigation
 */
export function resetNavigation() {

  navigationState.currentView =
    "dashboard";

  navigationState.previousView =
    null;

  navigationState.history =
    ["dashboard"];

  emit("NAVIGATION_RESET");

}
