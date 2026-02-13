/** POST /api/analyze - run incident intelligence engine and persist incident */

import { NextResponse } from "next/server";
import { runEngine } from "@/lib/engine";
import { generateIncidentExplanation } from "@/lib/llm/explainer";
import { prisma } from "@/lib/prisma";
import { transformSignals } from "@/lib/transformSignals";

export interface AnalyzeRequestBody {
  logs: string[];
}

export interface AnalyzeResponse {
  incidentId: string;
  id?: string;
  normalizedLogs: unknown[];
  signals: unknown;
  incidentType: string;
  type?: string;
  riskScore: number;
  severity: string;
  explanation: string | null;
  createdAt: string;
}

/** GET not allowed; use POST with body { logs: string[] } */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST with body: { logs: string[] }" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    const rawLogs = body?.logs;

    if (!Array.isArray(rawLogs)) {
      return NextResponse.json(
        { error: "Body must include 'logs' as an array of strings" },
        { status: 400 }
      );
    }

    const result = runEngine(rawLogs);
    let explanation: string | null = null;

    try {
      explanation = await generateIncidentExplanation(result);
    } catch (llmErr) {
      console.error("[CommanderD] OpenAI explanation failed:", llmErr);
      explanation = null;
    }

    const incident = await prisma.incident.create({
      data: {
        type: result.incidentType,
        severity: result.severity,
        riskScore: result.riskScore,
        signals: result.signals as object,
        explanation: explanation ?? result.explanation,
      },
    });

    return NextResponse.json({
      incidentId: incident.id,
      id: incident.id,
      normalizedLogs: result.normalizedLogs,
      signals: transformSignals(result.signals),
      incidentType: result.incidentType,
      type: result.incidentType,
      riskScore: result.riskScore,
      severity: result.severity,
      explanation: explanation ?? result.explanation,
      createdAt: incident.createdAt.toISOString(),
    } satisfies AnalyzeResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
