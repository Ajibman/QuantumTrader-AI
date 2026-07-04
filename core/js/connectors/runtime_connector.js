/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 36 — RUNTIME CONNECTOR
 * Production Version 2.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Runtime Integration Layer.
 *
 * The Runtime Connector is the official bridge between the
 * application runtime and every external consumer.
 *
 * It does NOT:
 *
 * • Trade
 * • Learn
 * • Allocate capital
 * • Evaluate strategies
 * • Execute orders
 *
 * Those responsibilities belong to the
 * MetaSystemOrchestrator.
 *
 * Responsibilities
 * ----------------
 * • Runtime synchronization
 * • Runtime snapshots
 * • Runtime state broadcasting
 * • Runtime subscriptions
 * • Runtime health exposure
 * • Event forwarding
 *
 * ============================================================
 */

import eventHub from "../event_hub.js";

import orchestrator, {
    initializeSystem,
    getSystemStatus
} from "../bootstrap.js";

/* ============================================================
 * CONNECTOR STATE
 * ============================================================
 */

const connectorState = {

    initialized: false,

    connected: false,

    subscribers: new Set(),

    lastSnapshot: null,

    startedAt: null

};

/* ============================================================
 * INITIALIZE CONNECTOR
 * ============================================================
 */

export function initializeConnector() {

    if (connectorState.initialized) {

        return connectorState.lastSnapshot;

    }

    initializeSystem();

  attachRuntimeEvents();

  if (!orchestrator.isHealthy()) {

    throw new Error(
        "Runtime Connector initialization failed."
    );

  }

    connectorState.initialized = true;

    connectorState.connected = true;

    connectorState.startedAt = Date.now();

    eventHub?.emit?.(

        "runtime:connector:ready",

        {

            timestamp: connectorState.startedAt

        }

    );

    connectorState.lastSnapshot = getRuntimeSnapshot();

    return connectorState.lastSnapshot;

}

/* ============================================================
 * SNAPSHOT
 * ============================================================
 */

export function getRuntimeSnapshot() {

    const system = getSystemStatus();

    return {

        initialized:

            connectorState.initialized,

        connected:

            connectorState.connected,

        timestamp:

            Date.now(),

      version: "2.0.0",

        system,

        healthy:

            orchestrator.isHealthy()

    };

}

/* ============================================================
 * BROADCAST
 * ============================================================
 */

export function broadcast() {

    connectorState.lastSnapshot =

        getRuntimeSnapshot();

    connectorState.subscribers.forEach(

        listener => {

            try {

                listener(

                    connectorState.lastSnapshot

                );

            }

            catch (error) {

                console.error(

                    "[RuntimeConnector]",

                    error

                );

            }

        }

    );

}

/* ============================================================
 * SUBSCRIPTIONS
 * ============================================================
 */

export function subscribe(listener) {

    if (

        typeof listener !== "function"

    ) {

        return false;

    }

    connectorState.subscribers.add(listener);

    return true;

}

export function unsubscribe(listener) {

    connectorState.subscribers.delete(listener);

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function isConnected() {

    return (

        connectorState.connected &&

        orchestrator.isHealthy()

    );

}

/* ============================================================
 * SHUTDOWN
 * ============================================================
 */

export function shutdownConnector() {

    connectorState.connected = false;

    connectorState.initialized = false;

    connectorState.subscribers.clear();

    eventHub?.emit?.(

        "runtime:connector:shutdown",

        {

            timestamp: Date.now()

        }

    );

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    initializeConnector,

    shutdownConnector,

    getRuntimeSnapshot,

    broadcast,

    subscribe,

    unsubscribe,

    isConnected

};

/* ============================================================
 * STATUS
 * ============================================================
 */

function attachRuntimeEvents() {

    if (!eventHub?.on) return;

    const runtimeEvents = [

        "app:ready",

        "app:error",

        "app:shutdown",

        "orchestrator:cycle:start",

        "orchestrator:cycle:complete"

    ];

    runtimeEvents.forEach(eventName => {

        eventHub.on(eventName, () => {

            broadcast();

        });

    });

}

