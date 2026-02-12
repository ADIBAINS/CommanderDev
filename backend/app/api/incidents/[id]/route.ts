/** GET /api/incidents/[id] - get a single incident by id */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformSignals } from "@/lib/transformSignals";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: incident.id,
      type: incident.type,
      severity: incident.severity,
      riskScore: incident.riskScore,
      signals: transformSignals(incident.signals),
      explanation: incident.explanation,
      createdAt: incident.createdAt.toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
