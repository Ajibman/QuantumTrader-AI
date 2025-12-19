// core/xt_canonical_events.js

export const XT_EVENT = Object.freeze({
  type: "XT_ACTIVATION",
  layer: "SocialResponsibility",
  timestamp: null, // runtime-injected
  source: "XT Logical Module",
  trigger: {
    institution: "WEMA BANK Plc, NIGERIA",
    account: "0299134895",
    threshold: 100_000_000,
    status: "REACHED"
  }
});
