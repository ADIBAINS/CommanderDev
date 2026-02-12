/** Normalizes timestamp to ISO, level to uppercase, trims strings */

import type { LogLevel } from "../types";

const VALID_LEVELS = ["DEBUG", "INFO", "WARN", "ERROR"] as const;

function isValidLevel(s: string): s is LogLevel {
  return VALID_LEVELS.includes(s as LogLevel);
}

/**
 * Converts a timestamp string to ISO 8601 format.
 */
function toIsoTimestamp(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return new Date().toISOString();

  // Already ISO-like
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
    try {
      const d = new Date(trimmed);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  // "YYYY-MM-DD HH:mm:ss" format
  const spaceMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}(?:\.\d+)?)/);
  if (spaceMatch) {
    const d = new Date(`${spaceMatch[1]}T${spaceMatch[2]}Z`);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  // Unix epoch
  const epoch = parseInt(trimmed, 10);
  if (!isNaN(epoch)) {
    const d = new Date(epoch < 1e10 ? epoch * 1000 : epoch);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  try {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Standardizes parsed log fields: ISO timestamp, uppercase level, trimmed strings.
 */
export function standardize(
  timestamp: string,
  level: string,
  service: string,
  message: string
): { timestamp: string; level: LogLevel; service: string; message: string } {
  const upper = level.toUpperCase();
  const normalizedLevel: LogLevel = isValidLevel(upper) ? upper : "INFO";

  return {
    timestamp: toIsoTimestamp(timestamp),
    level: normalizedLevel,
    service: service.trim(),
    message: message.trim(),
  };
}
