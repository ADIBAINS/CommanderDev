/** Shared types for CommanderD incident intelligence engine */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export type EventType =
  | "DB_TIMEOUT"
  | "AUTH_FAILURE"
  | "CONNECTION_ERROR"
  | "RATE_LIMIT"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface RawLogFields {
  timestamp?: string;
  level?: string;
  service?: string;
  message?: string;
}

export interface Log {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  eventType: EventType;
}

export interface Signal {
  errorSpikeCount: number;
  eventTypeFrequencies: Record<EventType, number>;
}

export type IncidentType =
  | "DATABASE_DEGRADATION"
  | "AUTHENTICATION_BREACH"
  | "CONNECTIVITY_ISSUE"
  | "SERVICE_OVERLOAD"
  | "DATA_INTEGRITY"
  | "INFRASTRUCTURE_FAILURE"
  | "UNKNOWN_INCIDENT";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface IncidentResult {
  normalizedLogs: Log[];
  signals: Signal;
  incidentType: IncidentType;
  riskScore: number;
  severity: Severity;
  explanation: string;
}
