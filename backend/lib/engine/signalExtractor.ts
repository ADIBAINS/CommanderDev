/** Extracts signals: error spike counts and eventType frequencies */

import type { Log, Signal, EventType } from "../types";

const EVENT_TYPES: EventType[] = [
  "DB_TIMEOUT",
  "AUTH_FAILURE",
  "CONNECTION_ERROR",
  "RATE_LIMIT",
  "VALIDATION_ERROR",
  "SERVER_ERROR",
  "UNKNOWN",
];

function initFrequencies(): Record<EventType, number> {
  return EVENT_TYPES.reduce(
    (acc, et) => {
      acc[et] = 0;
      return acc;
    },
    {} as Record<EventType, number>
  );
}

/**
 * Detects error spikes: consecutive or clustered ERROR-level logs.
 * A spike is defined as 2+ ERROR logs within a short window (by index proximity).
 */
function countErrorSpikes(logs: Log[]): number {
  const WINDOW = 5; // max distance between errors to count as same spike
  let spikeCount = 0;
  let lastErrorIdx = -WINDOW - 1;

  logs.forEach((log, i) => {
    if (log.level === "ERROR") {
      if (i - lastErrorIdx > WINDOW) spikeCount++;
      lastErrorIdx = i;
    }
  });

  return spikeCount;
}

/**
 * Extracts signals from normalized logs.
 */
export function extractSignals(logs: Log[]): Signal {
  const eventTypeFrequencies = initFrequencies();
  for (const log of logs) {
    eventTypeFrequencies[log.eventType]++;
  }
  const errorSpikeCount = countErrorSpikes(logs);
  return {
    errorSpikeCount,
    eventTypeFrequencies,
  };
}
