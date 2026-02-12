export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Signal {
    type: string
    count: number
}

export interface Incident {
    id: string
    type: string
    severity: Severity
    riskScore: number
    signals: Signal[]
    explanation: string
    createdAt: string
}
