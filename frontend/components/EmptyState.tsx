import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    title: string
    description: string
    icon?: LucideIcon
    children?: React.ReactNode
    className?: string
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    children,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-zinc-800 rounded-lg bg-zinc-900/50",
            className
        )}>
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 mb-4">
                    <Icon className="h-6 w-6 text-zinc-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mb-4">
                {description}
            </p>
            {children}
        </div>
    )
}
