/** Ensures fields exist and fills missing values with sensible defaults */

import type { RawLogFields } from "../types";

const DEFAULT_TIMESTAMP = () => new Date().toISOString();
const DEFAULT_LEVEL = "INFO";
const DEFAULT_SERVICE = "unknown";
const DEFAULT_MESSAGE = "(no message)";

/**
 * Extracts and validates fields from raw parsed output.
 * Fills any missing fields with defaults.
 */
export function extractFields(raw: RawLogFields): Required<RawLogFields> {
  return {
    timestamp: raw.timestamp?.trim() || DEFAULT_TIMESTAMP(),
    level: raw.level?.trim() || DEFAULT_LEVEL,
    service: raw.service?.trim() || DEFAULT_SERVICE,
    message: raw.message?.trim() || DEFAULT_MESSAGE,
  };
}
