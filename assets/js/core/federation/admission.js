 // assets/js/core/federation/admission.js

import { likeMindCompatibilityFilter } from '../constitution/lmc_filter.js';
import { validateAIProfile } from './validate_ai_profile.js'; // your runtime validator
import aiSchema from '../constitution/external_ai_profile.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validateSchema = ajv.compile(aiSchema);

export function admitExternalAI(profile) {
  // schema check first
  if (!validateSchema(profile)) return { status: "rejected", reason: "invalid schema" };

  // serial check
  if (!likeMindCompatibilityFilter(profile)) return { status: "rejected", reason: "failed serial check" };

  // runtime eligibility
  if (!validateAIProfile(profile)) return { status: "rejected", reason: "runtime validation failed" };

  // if all pass
  return { status: "admitted", role: "advisory_only" };
}
