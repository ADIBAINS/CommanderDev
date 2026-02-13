"use client"

import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SeverityBadge } from "@/components/SeverityBadge"
import { Incident } from "@/lib/types" // Ensure this path is correct
import { formatDistanceToNow } from "date-fns" // We need date-fns or native Intl
import { Badge } from "@/components/ui/badge"

interface IncidentsTableProps {
    incidents: Incident[]
}

export function IncidentsTable({ incidents }: IncidentsTableProps) {
    const router = useRouter()

    return (
        <div className="rounded-md border border-zinc-800 bg-zinc-900">
            <Table>
                <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Incident Type</TableHead>
                        <TableHead className="text-zinc-400">Severity</TableHead>
                        <TableHead className="text-zinc-400">Risk Score</TableHead>
                        <TableHead className="text-zinc-400">Signals</TableHead>
                        <TableHead className="text-right text-zinc-400">Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incidents.map((incident) => (
                        <TableRow
                            key={incident.id}
                            className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                            onClick={() => router.push(`/incidents/${incident.id}`)}
                        >
                            <TableCell className="font-medium text-zinc-200">
                                {incident.type}
                            </TableCell>
                            <TableCell>
                                <SeverityBadge severity={incident.severity} />
                            </TableCell>
                            <TableCell className="text-zinc-300">
                                {incident.riskScore}/100
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-200 font-medium tabular-nums min-w-[2rem] justify-center">
                                    {incident.signals.reduce((acc, curr) => acc + curr.count, 0)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-zinc-500">
                                {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
