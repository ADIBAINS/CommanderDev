import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface RiskMeterProps {
    score: number // 0 to 100
    className?: string
}

export function RiskMeter({ score, className }: RiskMeterProps) {
    // Dynamic color based on score
    let colorClass = "bg-green-500"
    if (score > 30) colorClass = "bg-yellow-500"
    if (score > 60) colorClass = "bg-orange-500"
    if (score > 80) colorClass = "bg-red-500"

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Risk Score</span>
                <span className={cn("font-bold", colorClass.replace("bg-", "text-"))}>
                    {score}/100
                </span>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={colorClass} />
        </div>
    )
}
