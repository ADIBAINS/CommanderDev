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

const SYSTEM_PROMPT = `You are an incident response analyst. Given structured incident data (type, severity, risk score, signals, log excerpts), produce a concise professional analysis in Markdown.

Include:
1. **Summary** - One-line incident summary
2. **Root Cause** - Likely cause based on signals and event types
3. **Impact** - Potential impact given severity
4. **Recommendations** - 2-3 actionable next steps

Be concise. Use bullet points where appropriate. Return only Markdown, no preamble.`;

function buildUserMessage(incident: IncidentResult): string {
  const { incidentType, severity, riskScore, signals } = incident;
  const eventFreq = JSON.stringify(signals.eventTypeFrequencies, null, 2);
  const sampleLogs = incident.normalizedLogs
    .slice(0, 5)
    .map((l) => `- [${l.level}] ${l.service}: ${l.message}`)
    .join("\n");

  return `Analyze this incident:

Type: ${incidentType}
Severity: ${severity}
Risk Score: ${riskScore}/100
Error Spike Count: ${signals.errorSpikeCount}

Event Type Frequencies:
${eventFreq}

Sample Logs:
${sampleLogs || "(none)"}
`;
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
