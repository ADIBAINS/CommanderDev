/** Maps log messages to event types based on keywords and patterns */

import type { EventType } from "../types";

type Pattern = { pattern: RegExp | string; eventType: EventType };

const PATTERNS: Pattern[] = [
  { pattern: /\bdatabase\s+(?:connection\s+)?timeout\b/i, eventType: "DB_TIMEOUT" },
  { pattern: /\bquery\s+timeout\b/i, eventType: "DB_TIMEOUT" },
  { pattern: /\bdb\s+timeout\b/i, eventType: "DB_TIMEOUT" },
  { pattern: /\bpg\s+timeout\b/i, eventType: "DB_TIMEOUT" },
  { pattern: /\bconnection\s+timeout\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\btimeout\b/i, eventType: "DB_TIMEOUT" },
  { pattern: /\bECONNREFUSED\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bECONNRESET\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bconnection\s+refused\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bconnection\s+reset\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bconnect\s+ETIMEDOUT\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bnetwork\s+error\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\bsocket\s+(?:hang\s+up|closed)\b/i, eventType: "CONNECTION_ERROR" },
  { pattern: /\binvalid\s+token\b/i, eventType: "AUTH_FAILURE" },
  { pattern: /\bauth(?:entication)?\s+failed\b/i, eventType: "AUTH_FAILURE" },
  { pattern: /\bunauthorized\b/i, eventType: "AUTH_FAILURE" },
  { pattern: /\b401\b/i, eventType: "AUTH_FAILURE" },
  { pattern: /\bjwt\s+(?:expired|invalid)\b/i, eventType: "AUTH_FAILURE" },
  { pattern: /\brate\s+limit/i, eventType: "RATE_LIMIT" },
  { pattern: /\b429\b/i, eventType: "RATE_LIMIT" },
  { pattern: /\btoo\s+many\s+requests\b/i, eventType: "RATE_LIMIT" },
  { pattern: /\bthrottl/i, eventType: "RATE_LIMIT" },
  { pattern: /\bvalidation\s+(?:error|failed)\b/i, eventType: "VALIDATION_ERROR" },
  { pattern: /\binvalid\s+(?:request|input|data)\b/i, eventType: "VALIDATION_ERROR" },
  { pattern: /\b400\b/i, eventType: "VALIDATION_ERROR" },
  { pattern: /\b500\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\b502\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\b503\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\b504\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\binternal\s+server\s+error\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\bcrash\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\bunhandled\s+exception\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\b(?:uncaught\s+)?exception\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\bfatal\s+error\b/i, eventType: "SERVER_ERROR" },
  { pattern: /\bout\s+of\s+memory\b/i, eventType: "SERVER_ERROR" },
];

/**
 * Classifies a log message into an event type.
 */
export function classifyEventType(message: string): EventType {
  const lower = message.toLowerCase();
  for (const { pattern, eventType } of PATTERNS) {
    const regex = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
    if (regex.test(lower)) return eventType;
  }
  return "UNKNOWN";
}
