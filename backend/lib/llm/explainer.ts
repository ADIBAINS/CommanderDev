// /**
//  * AI Explanation Layer for CommanderD incidents.
//  * Uses OpenAI gpt-4o-mini to generate professional incident analysis.
//  */

// import OpenAI from "openai";
// import type { IncidentResult } from "../types";

// const MODEL = "gpt-4o-mini";

// const SYSTEM_PROMPT = `You are an incident response analyst. Given structured incident data (type, severity, risk score, signals, log excerpts), produce a concise professional analysis in Markdown.

// Include:
// 1. **Summary** - One-line incident summary
// 2. **Root Cause** - Likely cause based on signals and event types
// 3. **Impact** - Potential impact given severity
// 4. **Recommendations** - 2-3 actionable next steps

// Be concise. Use bullet points where appropriate. Return only Markdown, no preamble.`;

// function buildUserMessage(incident: IncidentResult): string {
//   const { incidentType, severity, riskScore, signals } = incident;
//   const eventFreq = JSON.stringify(signals.eventTypeFrequencies, null, 2);
//   const sampleLogs = incident.normalizedLogs
//     .slice(0, 5)
//     .map((l) => `- [${l.level}] ${l.service}: ${l.message}`)
//     .join("\n");

//   return `Analyze this incident:

// **Type:** ${incidentType}
// **Severity:** ${severity}
// **Risk Score:** ${riskScore}/100
// **Error Spike Count:** ${signals.errorSpikeCount}
// **Event Type Frequencies:**
// \`\`\`json
// ${eventFreq}
// \`\`\`

// **Sample Logs:**
// ${sampleLogs || "(none)"}

// Provide the incident analysis in Markdown.`;
// }

// /**
//  * Generates an AI-powered incident explanation using OpenAI.
//  * @throws Error if OPENAI_API_KEY is missing
//  */
// export async function generateIncidentExplanation(
//   incident: IncidentResult
// ): Promise<string> {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey || apiKey.trim() === "") {
//     throw new Error("OPENAI_API_KEY is required but not set in environment");
//   }

//   const client = new OpenAI({ apiKey });
//   const completion = await client.chat.completions.create({
//     model: MODEL,
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       { role: "user", content: buildUserMessage(incident) },
//     ],
//   });

//   const content = completion.choices[0]?.message?.content?.trim();
//   if (!content) {
//     throw new Error("OpenAI returned empty response");
//   }
//   return content;
// }
/**
 * AI Explanation Layer for CommanderD incidents.
 * Uses local Ollama model (llama3 or mistral).
 */

import type { IncidentResult } from "../types";

const MODEL = "llama3"; // or "mistral"

const SYSTEM_PROMPT = `You are an incident response analyst. You must base your analysis strictly on the provided incident data. Do not invent causes or use vague language.

Rules:
- Use the exact incident type and event type names provided (e.g. DATABASE_DEGRADATION, DB_TIMEOUT, AUTH_FAILURE, CONNECTION_ERROR, RATE_LIMIT, SERVER_ERROR). Never call the incident an "unknown error" when specific event types are listed.
- Root cause must cite at least one concrete signal from the data (event type names and counts, or log messages). Do not say "one-time mistake" or "incorrect configuration" without tying it to a specific event type or log.
- Summary must name the incident type and the main observed event(s). Impact and recommendations must follow from the given severity and signals.

Output format (Markdown only, no preamble):
1. **Summary** - One sentence naming the incident type and key observed events.
2. **Root Cause** - Cause inferred from the listed event types and/or sample logs (cite them).
3. **Impact** - Based on the stated severity and signal counts.
4. **Recommendations** - 2–3 concrete next steps (refer to specific event types or logs where relevant).

Be concise. Use **bold** for section labels. Return only Markdown.`;

function buildUserMessage(incident: IncidentResult): string {
  const { incidentType, severity, riskScore, signals } = incident;
  const observed = (Object.entries(signals.eventTypeFrequencies) as [keyof typeof signals.eventTypeFrequencies, number][])
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${type}: ${count}`)
    .join(", ");
  const sampleLogs = incident.normalizedLogs
    .slice(0, 8)
    .map((l) => `- [${l.level}] ${l.service}: ${l.message}`)
    .join("\n");

  const hasSpecificEvents = observed && observed !== "none" && !/^UNKNOWN: \d+$/i.test(observed.trim());
  const dataNote = !hasSpecificEvents && sampleLogs !== "(none)"
    ? " Event types are uncategorized; infer root cause from the sample log messages below and cite specific log content (e.g. timeout, connection, auth) in your analysis."
    : "";

  return `Analyze this incident. Use the exact incident type and event names below in your Summary and Root Cause. Do not describe this as an "unknown error" when event types or sample logs are provided.${dataNote}

**Incident type:** ${incidentType}
**Severity:** ${severity}
**Risk score:** ${riskScore}/100
**Error spike count:** ${signals.errorSpikeCount}
**Observed event types (use these names):** ${observed || "none"}

**Sample logs:**
${sampleLogs || "(none)"}

Provide the analysis in Markdown (Summary, Root Cause, Impact, Recommendations).`;
}

export async function generateIncidentExplanation(
  incident: IncidentResult
): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: `${SYSTEM_PROMPT}\n\n${buildUserMessage(incident)}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Ollama returned empty response");
    }

    return data.response.trim();
  } catch (error) {
    console.error("[CommanderD] Local LLM failed:", error);
    return "AI explanation unavailable (local model error).";
  }
}
