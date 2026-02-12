/** Orchestrates normalization pipeline into a structured Log with eventType */

import { parseLogLine } from "./parser";
import { extractFields } from "./extractor";
import { standardize } from "./standardizer";
import { classifyEventType } from "./classifier";
import type { Log } from "../types";

/**
 * Normalizes a raw log line into a structured Log with eventType.
 */
export function normalizeLogLine(rawLine: string): Log {
  const raw = parseLogLine(rawLine);
  const extracted = extractFields(raw);
  const std = standardize(
    extracted.timestamp,
    extracted.level,
    extracted.service,
    extracted.message
  );
  const eventType = classifyEventType(std.message);
  return {
    timestamp: std.timestamp,
    level: std.level,
    service: std.service,
    message: std.message,
    eventType,
  };
}

/**
 * Normalizes an array of raw log lines.
 */
export function normalizeLogs(rawLines: string[]): Log[] {
  return rawLines.map(normalizeLogLine);
}

export { parseLogLine } from "./parser";
export { extractFields } from "./extractor";
export { standardize } from "./standardizer";
export { classifyEventType } from "./classifier";
