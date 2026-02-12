/** Calculates risk score and severity from signals and incident type */

import type { Signal, IncidentType, Severity } from "../types";

const INCIDENT_WEIGHTS: Record<IncidentType, number> = {
  DATABASE_DEGRADATION: 0.8,
  AUTHENTICATION_BREACH: 1.0,
  CONNECTIVITY_ISSUE: 0.7,
  SERVICE_OVERLOAD: 0.6,
  DATA_INTEGRITY: 0.5,
  INFRASTRUCTURE_FAILURE: 0.9,
  UNKNOWN_INCIDENT: 0.2,
};

/**
 * Calculates a risk score (0–100) from signals and incident type.
 */
export function calculateRiskScore(
  signals: Signal,
  incidentType: IncidentType
): number {
  const weight = INCIDENT_WEIGHTS[incidentType];
  const errorSpikeContrib = Math.min(signals.errorSpikeCount * 15, 40);
  const eventContrib = Object.values(signals.eventTypeFrequencies).reduce(
    (a, b) => a + b,
    0
  );
  const eventContribNorm = Math.min(eventContrib * 5, 50);
  const raw = (errorSpikeContrib + eventContribNorm) * weight;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Maps risk score to severity.
 */
export function assessSeverity(riskScore: number): Severity {
  if (riskScore >= 80) return "CRITICAL";
  if (riskScore >= 60) return "HIGH";
  if (riskScore >= 30) return "MEDIUM";
  return "LOW";
}
