const ERROR_POLICIES = {

  INVALID_SESSION: {
    retryable: false,
    action: "REAUTHENTICATE"
  },

  REQUEST_TIMEOUT: {
    retryable: true,
    retries: 3,
    action: "RETRY"
  },

  GATEWAY_UNAVAILABLE: {
    retryable: true,
    retries: 5,
    action: "RECONNECT"
  },

  INTERNAL_SYSTEM_ERROR: {
    retryable: false,
    action: "ESCALATE"
  }
};
