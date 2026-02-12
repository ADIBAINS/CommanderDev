import { Badge } from "@/components/ui/badge"
import { Severity } from "@/lib/types"

interface SeverityBadgeProps {
    severity: Severity
}

// Map severity to color variants
// We use custom classes because standard badge variants might not cover all specific needs
const severityStyles: Record<Severity, string> = {
    LOW: "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20",
    MEDIUM: "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20",
    HIGH: "bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 border-orange-500/20",
    CRITICAL: "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20",
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
    return (
        <Badge variant="outline" className={severityStyles[severity]}>
            {severity}
        </Badge>
    )
}
