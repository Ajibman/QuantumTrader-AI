// mobile/ui/notification.js

import { on, emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * Notification Service
 *
 * Responsibilities:
 * - Alert management
 * - Event notifications
 * - Notification history
 * - Notification prioritization
 * - Trader communication layer
 */

const notificationState = {

  notifications: [],

  unreadCount: 0,

  lastNotification: null

};

const MAX_HISTORY = 500;

/**
 * Initialize Notification System
 */
export function initializeNotifications() {

  registerNotificationEvents();

  console.log("[Notifications] Initialized");

}

/**
 * Register Event Listeners
 */
function registerNotificationEvents() {

  /*
   * Application Events
   */

  on("APP_READY", () => {

    createNotification({
      level: "SUCCESS",
      title: "Application Ready",
      message: "QuantumTrader-AI is online."
    });

  });

  on("APP_ERROR", payload => {

    createNotification({
      level: "ERROR",
      title: "Application Error",
      message: payload?.error || "Unknown error."
    });

  });

  /*
   * CPilot Events
   */

  on("CPILOT_STARTED", () => {

    createNotification({
      level: "INFO",
      title: "CPilot Online",
      message: "CPilot engine initialized."
    });

  });

  on("CPILOT_ALERT", payload => {

    createNotification({
      level: "WARNING",
      title: "CPilot Alert",
      message: payload?.message || "Trading alert received."
    });

  });

  /*
   * Meta Brain Events
   */

  on("META_BRAIN_READY", () => {

    createNotification({
      level: "SUCCESS",
      title: "Meta Brain Online",
      message: "Strategic intelligence active."
    });

  });

  on("META_BRAIN_OVERRIDE", () => {

    createNotification({
      level: "WARNING",
      title: "Meta Brain Override",
      message: "Trade decision adjusted."
    });

  });

  /*
   * AutoTrader Events
   */

  on("AUTOTRADER_STARTED", () => {

    createNotification({
      level: "INFO",
      title: "AutoTrader Active",
      message: "Autonomous trading enabled."
    });

  });

  on("AUTOTRADER_STOPPED", () => {

    createNotification({
      level: "INFO",
      title: "AutoTrader Stopped",
      message: "Autonomous trading disabled."
    });

  });

  /*
   * Execution Events
   */

  on("ORDER_CREATED", order => {

    createNotification({
      level: "INFO",
      title: "Order Created",
      message: `${order?.symbol || "Asset"} order created.`
    });

  });

  on("ORDER_FILLED", order => {

    createNotification({
      level: "SUCCESS",
      title: "Order Filled",
      message: `${order?.symbol || "Asset"} execution completed.`
    });

  });

  on("ORDER_REJECTED", order => {

    createNotification({
      level: "ERROR",
      title: "Order Rejected",
      message: `${order?.symbol || "Asset"} execution rejected.`
    });

  });

}

/**
 * Create Notification
 */
export function createNotification(notification) {

  const entry = {
    id: crypto.randomUUID?.() ||
      `ntf_${Date.now()}`,
    timestamp: Date.now(),
    read: false,
    ...notification
  };

  notificationState.notifications.unshift(entry);

  notificationState.lastNotification = entry;

  notificationState.unreadCount++;

  trimHistory();

  emit("NOTIFICATION_CREATED", entry);

  emit("NOTIFICATIONS_UPDATED", {
    ...notificationState
  });

  return entry;

}

/**
 * Mark Notification Read
 */
export function markAsRead(notificationId) {

  const notification =
    notificationState.notifications.find(
      item => item.id === notificationId
    );

  if (!notification || notification.read) return;

  notification.read = true;

  notificationState.unreadCount =
    Math.max(
      0,
      notificationState.unreadCount - 1
    );

  emit("NOTIFICATIONS_UPDATED", {
    ...notificationState
  });

}

/**
 * Mark All Read
 */
export function markAllAsRead() {

  notificationState.notifications.forEach(
    item => {
      item.read = true;
    }
  );

  notificationState.unreadCount = 0;

  emit("NOTIFICATIONS_UPDATED", {
    ...notificationState
  });

}

/**
 * Trim Notification History
 */
function trimHistory() {

  if (
    notificationState.notifications.length >
    MAX_HISTORY
  ) {
    notificationState.notifications =
      notificationState.notifications.slice(
        0,
        MAX_HISTORY
      );
  }

}

/**
 * Notification State Accessor
 */
export function getNotificationState() {

  return {
    ...notificationState
  };

}

/**
 * Clear Notification History
 */
export function clearNotifications() {

  notificationState.notifications = [];

  notificationState.unreadCount = 0;

  notificationState.lastNotification = null;

  emit("NOTIFICATIONS_UPDATED", {
    ...notificationState
  });

      }
