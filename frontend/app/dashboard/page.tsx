"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { UploadPanel } from "@/components/UploadPanel"
import { StatsCard } from "@/components/StatsCard"
import { IncidentsTable } from "@/components/IncidentsTable"
import { Incident } from "@/lib/types"
import { Activity, ShieldAlert, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function DashboardPage() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [loading, setLoading] = useState(true)
    const [analyzing, setAnalyzing] = useState(false)
    const { toast } = useToast()

    const fetchIncidents = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/incidents")
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setIncidents(data)
        } catch {
            toast({
                title: "Error",
                description: "Failed to load incidents. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIncidents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAnalyze = async (logs: string) => {
        setAnalyzing(true)
        try {
            const logLines = logs.split("\n").map((l) => l.trim()).filter(Boolean)
            if (logLines.length === 0) throw new Error("No valid log lines")

            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logs: logLines })
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.error || "Analysis failed")
            }

            const data = await res.json()
            const newIncident: Incident = {
                id: data.incidentId || data.id,
                type: data.incidentType || data.type,
                severity: data.severity,
                riskScore: data.riskScore,
                signals: data.signals ?? [],
                explanation: data.explanation || "",
                createdAt: data.createdAt
            }

            toast({
                title: "Analysis Complete",
                description: "New incident report generated successfully.",
            })

            setIncidents(prev => [newIncident, ...prev])

        } catch (e) {
            const msg = e instanceof Error ? e.message : "Could not process logs. Please check format."
            toast({
                title: "Analysis Failed",
                description: msg,
                variant: "destructive"
            })
        } finally {
            setAnalyzing(false)
        }
    }

    // Computed Stats
    const totalIncidents = incidents.length
    const criticalCount = incidents.filter(i => i.severity === "CRITICAL").length
    const avgRisk = totalIncidents > 0
        ? Math.round(incidents.reduce((acc, curr) => acc + curr.riskScore, 0) / totalIncidents)
        : 0

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
            <PageHeader
                title="Incident Dashboard"
                description="Monitor production health and analyze real-time signals."
            >
                <Button variant="outline" size="sm" onClick={fetchIncidents} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </PageHeader>

            <UploadPanel onAnalyze={handleAnalyze} isAnalyzing={analyzing} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Incidents"
                    value={totalIncidents}
                    icon={Activity}
                    description="Last 24 hours"
                />
                <StatsCard
                    title="Critical Alerts"
                    value={criticalCount}
                    icon={AlertTriangle}
                    description="Requires immediate attention"
                />
                <StatsCard
                    title="Avg Risk Score"
                    value={avgRisk}
                    icon={ShieldAlert}
                    description="Overall system health impact"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Recent Incidents</h2>
                {loading && incidents.length === 0 ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-zinc-900 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : incidents.length > 0 ? (
                    <IncidentsTable incidents={incidents} />
                ) : (
                    <EmptyState
                        title="No Incidents Detected"
                        description="Your systems appear to be healthy. Upload logs to start analysis."
                        icon={ShieldAlert}
                    />
                )}
            </div>
        </div>
    )
}
