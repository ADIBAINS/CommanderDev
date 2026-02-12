"use client"

import { useState } from "react"
import { UploadCloud, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UploadPanelProps {
    onAnalyze: (logs: string) => Promise<void>
    isAnalyzing: boolean
}

export function UploadPanel({ onAnalyze, isAnalyzing }: UploadPanelProps) {
    const [logs, setLogs] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!logs.trim()) {
            setError("Please enter logs to analyze.")
            return
        }
        setError(null)
        try {
            await onAnalyze(logs)
            setLogs("") // Clear on success
        } catch (e) {
            // Error handling is usually done by parent or toast, but we can set local error too
            console.error(e)
        }
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-indigo-500" />
                    Log Analysis
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Paste your raw application logs below. AI will detect patterns and anomalies.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Paste logs here (e.g. [ERROR] Connection timed out...)"
                    className="min-h-[150px] font-mono text-sm bg-zinc-950/50 border-zinc-800 text-zinc-300 resize-none focus-visible:ring-indigo-500/50"
                    value={logs}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLogs(e.target.value)}
                />

                {error && (
                    <Alert variant="destructive" className="bg-red-900/10 border-red-900/20 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end">
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !logs.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            "Analyze Logs"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
