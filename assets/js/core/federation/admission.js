 // assets/js/core/federation/admission.js
// Operational gate for admitting external AIs into QuantumTrader-AI

import { likeMindCompatibilityFilter } from '../constitution/lmc_filter.js';
import { validateAIProfile } from './validate_ai_profile.js'; // your runtime validator
import aiSchema from '../constitution/external_ai_profile.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validateSchema = ajv.compile(aiSchema);

/**
 * Admit an external AI profile according to schema, serials, and runtime rules
 * @param {Object} profile - External AI profile
 * @returns {Object} admission result with status and role/reason
 */
export function admitExternalAI(profile) {
  // --- Step 1: Schema validation ---
  if (!validateSchema(profile)) {
    return { status: "rejected", reason: "invalid schema" };
  }

  // --- Step 2: Like-Mind Serial Check (Serials 1–5) ---
  if (!likeMindCompatibilityFilter(profile)) {
    return { status: "rejected", reason: "failed serial check" };
  }

  // --- Step 3: Runtime eligibility check ---
  if (!validateAIProfile(profile)) {
    return { status: "rejected", reason: "runtime validation failed" };
  }

  // --- Step 4: All checks passed ---
  return { status: "admitted", role: "advisory_only" };
}
