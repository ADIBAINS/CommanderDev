import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"

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
                <div className="prose prose-invert prose-headings:font-bold prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-strong:font-semibold prose-li:text-zinc-300 max-w-none text-sm leading-relaxed">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h1 className="text-lg font-bold text-zinc-100 mt-4 mb-2 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold text-zinc-100 mt-3 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-200 mt-2 mb-1">{children}</h3>,
                            p: ({ children }) => <p className="text-zinc-300 mb-2">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
                            em: ({ children }) => <em className="text-zinc-300 italic">{children}</em>,
                            ul: ({ children }) => <ul className="list-disc list-inside text-zinc-300 mb-2 space-y-0.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-300 mb-2 space-y-0.5">{children}</ol>,
                            li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                        }}
                    >
                        {explanation || "No analysis available."}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    )
}
