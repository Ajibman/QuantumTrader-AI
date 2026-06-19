/**

* =====================================================
* QuantumTrader-AI
* STAGE 39B — NOTIFICATION ENGINE
* =====================================================
* 
* Purpose:
* Handles all real-time alerts:
* - trade executions
* - risk warnings
* - system health
* - signal updates
* 
* This is UI-level event processing only.
* =====================================================
  */

export class NotificationEngine {

constructor() {
this.notifications = [];
}

// ---------------------------------------------
// PUSH NOTIFICATION
// ---------------------------------------------

push(event) {

const notification = {

  id: "ntf_" + Date.now(),

  type: event.type,

  message: event.message,

  severity: event.severity ?? "INFO",

  timestamp: Date.now()
};

this.notifications.push(notification);

return notification;

}

// ---------------------------------------------
// GET RECENT NOTIFICATIONS
// ---------------------------------------------

getRecent(limit = 20) {

return this.notifications.slice(-limit);

}

// ---------------------------------------------
// CLEAR NOTIFICATIONS
// ---------------------------------------------

clear() {
this.notifications = [];
}
}
