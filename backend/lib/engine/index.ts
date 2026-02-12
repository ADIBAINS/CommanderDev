/** Engine: normalization + signals + rules + risk assessment */

import { normalizeLogs } from "../normalization";
import { extractSignals } from "./signalExtractor";
import { applyRules, explainIncident } from "./ruleEngine";
import { calculateRiskScore, assessSeverity } from "./riskAssessor";
import type { IncidentResult } from "../types";

/**
 * Runs the full pipeline: normalize logs, extract signals, apply rules,
 * assess risk, and return an IncidentResult.
 */
export function runEngine(rawLogs: string[]): IncidentResult {
  const normalizedLogs = normalizeLogs(rawLogs);
  const signals = extractSignals(normalizedLogs);
  const incidentType = applyRules(signals);
  const riskScore = calculateRiskScore(signals, incidentType);
  const severity = assessSeverity(riskScore);
  const explanation = explainIncident(signals, incidentType);

  return {
    normalizedLogs,
    signals,
    incidentType,
    riskScore,
    severity,
    explanation,
  };
}

export { extractSignals } from "./signalExtractor";
export { applyRules, explainIncident } from "./ruleEngine";
export { calculateRiskScore, assessSeverity } from "./riskAssessor";
