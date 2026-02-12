import { Badge } from "@/components/ui/badge"
import { Signal } from "@/lib/types"

interface SignalListProps {
    signals: Signal[]
}

export function SignalList({ signals }: SignalListProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {signals.map((signal, index) => (
                <Badge
                    key={index}
                    variant="secondary"
                    className="flex justify-between items-center py-1.5 px-3 bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700 text-zinc-300"
                >
                    <span className="font-mono text-xs truncate mr-2" title={signal.type}>
                        {signal.type}
                    </span>
                    <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] text-zinc-500 font-bold min-w-[20px] text-center">
                        {signal.count}
                    </span>
                </Badge>
            ))}
        </div>
    )
}
