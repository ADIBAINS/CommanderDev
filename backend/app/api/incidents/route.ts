/** GET /api/incidents - list all incidents from database */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformSignals } from "@/lib/transformSignals";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
    });
    const formatted = incidents.map((i) => ({
      id: i.id,
      type: i.type,
      severity: i.severity,
      riskScore: i.riskScore,
      signals: transformSignals(i.signals),
      explanation: i.explanation,
      createdAt: i.createdAt.toISOString(),
    }));
    return NextResponse.json(formatted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
