/**
 * CommanderD engine test script.
 * Run: npx ts-node scripts/testEngine.ts
 */

import { runEngine } from "../lib/engine";

const EXAMPLE_LOGS: { label: string; logs: string[] }[] = [
  {
    label: "JSON format batch",
    logs: [
      '{"timestamp":"2024-01-15T10:30:00Z","level":"error","service":"api","message":"Connection refused"}',
      '{"timestamp":"2024-01-15T10:30:01Z","level":"error","service":"db","message":"Connection timeout"}',
    ],
  },
  {
    label: "Syslog-style with multiple event types",
    logs: [
      "2024-01-15T10:30:00Z ERROR [api] Connection refused to db:5432",
      "2024-01-15T10:30:01Z ERROR [auth] Invalid token provided",
      "2024-01-15T10:30:02Z WARN [api] Rate limit approaching",
    ],
  },
  {
    label: "Mixed formats",
    logs: [
      "2024-01-15T10:30:00Z error [db] Query timeout after 5s",
      '{"level":"ERROR","message":"Database timeout","service":"api"}',
      "info [worker] Processing completed",
    ],
  },
  {
    label: "Edge case: empty input array",
    logs: [],
  },
  {
    label: "Single malformed line",
    logs: ["garbage text without structure"],
  },
  {
    label: "Missing timestamp + lowercase level",
    logs: ["info [cache] Cache hit", "warn [auth] Invalid token"],
  },
];

function main(): void {
  console.log("CommanderD Engine Tests");
  console.log("======================\n");

  for (const { label, logs } of EXAMPLE_LOGS) {
    console.log(`--- ${label} ---\n`);
    try {
      const result = runEngine(logs);
      console.log("=== ENGINE RESULT ===\n");
      console.log(JSON.stringify(result, null, 2));
      console.log("");
    } catch (err) {
      console.error("ERROR:", err instanceof Error ? err.message : String(err));
      if (err instanceof Error && err.stack) {
        console.error(err.stack);
      }
      console.log("");
    }
  }
}

main();
