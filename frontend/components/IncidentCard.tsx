import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface IncidentCardProps {
    explanation: string
}

export function IncidentCard({ explanation }: IncidentCardProps) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-lg font-medium text-zinc-100">
                    AI Analysis & Root Cause
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-zinc prose-invert max-w-none text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                    {explanation}
                </div>
            </CardContent>
        </Card>
    )
}
