import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    description?: string
    className?: string
    children?: React.ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between pb-6", className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{title}</h1>
                {description && (
                    <p className="text-sm text-zinc-400">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}
