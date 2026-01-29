// assets/js/core/utils/freeze.js
// Utility to deep-freeze objects for immutable state

export function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (obj[prop] !== null && typeof obj[prop] === "object") {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}
