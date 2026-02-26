 // assets/js/core/federation/roles.js
// Defines immutable cognitive roles within the federation

export const FederationRoles = Object.freeze({
  OBSERVER: Object.freeze({
    id: "observer",
    privileges: ["read", "monitor"],
    canExecute: false
  }),

  ANALYST: Object.freeze({
    id: "analyst",
    privileges: ["read", "analyze"],
    canExecute: false
  }),

  SIMULATOR: Object.freeze({
    id: "simulator",
    privileges: ["read", "simulate"],
    canExecute: false
  }),

  EXECUTOR: Object.freeze({
    id: "executor",
    privileges: ["read", "analyze", "simulate", "execute"],
    canExecute: true
  })
});
