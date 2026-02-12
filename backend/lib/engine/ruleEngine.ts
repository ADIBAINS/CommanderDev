/** Maps signal patterns to incident types */

import type { Signal, IncidentType } from "../types";

type Rule = {
  name: IncidentType;
  condition: (s: Signal) => boolean;
};

const RULES: Rule[] = [
  {
    name: "DATABASE_DEGRADATION",
    condition: (s) =>
      s.eventTypeFrequencies.DB_TIMEOUT >= 2 || s.errorSpikeCount >= 3,
  },
  {
    name: "AUTHENTICATION_BREACH",
    condition: (s) => s.eventTypeFrequencies.AUTH_FAILURE >= 2,
  },
  {
    name: "CONNECTIVITY_ISSUE",
    condition: (s) =>
      s.eventTypeFrequencies.CONNECTION_ERROR >= 2 || s.errorSpikeCount >= 2,
  },
  {
    name: "SERVICE_OVERLOAD",
    condition: (s) =>
      s.eventTypeFrequencies.RATE_LIMIT >= 2 ||
      (s.eventTypeFrequencies.SERVER_ERROR >= 2 && s.errorSpikeCount >= 1),
  },
  {
    name: "DATA_INTEGRITY",
    condition: (s) => s.eventTypeFrequencies.VALIDATION_ERROR >= 3,
  },
  {
    name: "INFRASTRUCTURE_FAILURE",
    condition: (s) =>
      s.eventTypeFrequencies.SERVER_ERROR >= 3 || s.errorSpikeCount >= 5,
  },
];

/**
 * Applies rules to signals and returns the first matching incident type.
 */
export function applyRules(signals: Signal): IncidentType {
  for (const rule of RULES) {
    if (rule.condition(signals)) return rule.name;
  }
  return "UNKNOWN_INCIDENT";
}

/**
 * Builds a short explanation of which signals contributed.
 */
export function explainIncident(signals: Signal, incidentType: IncidentType): string {
  const parts: string[] = [];
  if (signals.errorSpikeCount > 0) {
    parts.push(`${signals.errorSpikeCount} error spike(s)`);
  }
  const freq = signals.eventTypeFrequencies;
  const nonzero = (Object.entries(freq) as [keyof typeof freq, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
  if (nonzero) parts.push(`event types: ${nonzero}`);
  return `Incident: ${incidentType}. Signals: ${parts.join("; ")}.`;
}
