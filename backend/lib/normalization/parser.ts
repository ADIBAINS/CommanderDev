/** Parses raw log lines into structured fields (timestamp, level, service, message) */

import type { RawLogFields } from "../types";

const ISO_REGEX =
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:?\d{2})?/;
const LEVEL_REGEX =
  /\b(DEBUG|INFO|WARN|ERROR|debug|info|warn|error)\b/i;
const SERVICE_REGEX =
  /\[([^\]]+)\]|service[=:]\s*["']?([^"'\s,]+)|"service"\s*:\s*"([^"]+)"/i;

/**
 * Attempts to parse a raw log line into structured fields.
 * Supports multiple formats: JSON, key=value, and common syslog-like patterns.
 */
export function parseLogLine(line: string): RawLogFields {
  const trimmed = line.trim();
  const fields: RawLogFields = {};

  // 1. Try JSON parse first
  if (trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed) as Record<string, unknown>;
      fields.timestamp = extractString(obj, "timestamp", "time", "ts", "@timestamp");
      fields.level = extractString(obj, "level", "lvl", "severity", "log_level");
      fields.service = extractString(obj, "service", "serviceName", "app", "logger");
      fields.message = extractString(obj, "message", "msg", "log", "text");
      return fields;
    } catch {
      // Fall through to regex parsing
    }
  }

  // 2. Extract timestamp (ISO format)
  const tsMatch = trimmed.match(ISO_REGEX);
  if (tsMatch) fields.timestamp = tsMatch[0];

  // Also try common formats: "2024-01-15 10:30:00" or Unix epoch
  const altTsMatch = trimmed.match(
    /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?)/
  );
  if (!fields.timestamp && altTsMatch) fields.timestamp = altTsMatch[1];

  const epochMatch = trimmed.match(/\b(\d{10})(?:\.\d+)?\b/);
  if (!fields.timestamp && epochMatch) {
    const epoch = parseInt(epochMatch[1], 10);
    fields.timestamp = new Date(epoch * 1000).toISOString();
  }

  // 3. Extract level
  const levelMatch = trimmed.match(LEVEL_REGEX);
  if (levelMatch) fields.level = levelMatch[1];

  // 4. Extract service
  const svcMatch = trimmed.match(SERVICE_REGEX);
  if (svcMatch) fields.service = (svcMatch[1] ?? svcMatch[2] ?? svcMatch[3]) ?? undefined;

  // 5. Extract message - everything after level or between quotes, or last segment
  const msgFromJson = extractMessageFromKeyValue(trimmed);
  if (msgFromJson) fields.message = msgFromJson;
  else if (!fields.message) {
    const quoteMatch = trimmed.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (quoteMatch) fields.message = quoteMatch[1];
    else {
      const msgMatch = trimmed.match(/message[=:]\s*["']?([^"'\n]+)/i);
      if (msgMatch) fields.message = msgMatch[1];
    }
  }

  // Fallback: use remainder after known parts as message
  if (!fields.message) {
    let remainder = trimmed;
    if (fields.timestamp) remainder = remainder.replace(fields.timestamp, "").trim();
    if (fields.level) remainder = remainder.replace(new RegExp(fields.level, "i"), "").trim();
    if (fields.service) remainder = remainder.replace(fields.service, "").replace(/[\[\]]/g, "").trim();
    const cleaned = remainder.replace(/^\s*[-:]\s*/, "").trim();
    if (cleaned.length > 0) fields.message = cleaned;
  }

  return fields;
}

function extractString(
  obj: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return undefined;
}

function extractMessageFromKeyValue(line: string): string | undefined {
  const match = line.match(/message\s*=\s*"([^"]*)"/);
  if (match) return match[1];
  const match2 = line.match(/msg\s*=\s*"([^"]*)"/);
  if (match2) return match2[1];
  return undefined;
}
