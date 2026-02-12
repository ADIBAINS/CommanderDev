/**
 * CommanderD normalization test script.
 * Run: npx ts-node scripts/testNormalization.ts
 */

import { normalizeLogLine, normalizeLogs } from "../lib/normalization";

const EXAMPLE_LOGS: { label: string; input: string }[] = [
  {
    label: "JSON format",
    input: '{"timestamp":"2024-01-15T10:30:00Z","level":"error","service":"api","message":"Connection refused"}',
  },
  {
    label: "Syslog-style with ISO timestamp",
    input: "2024-01-15T10:30:00Z ERROR [api] Connection refused to db:5432",
  },
  {
    label: "Key-value style",
    input: 'time=2024-01-15T10:30:00Z level=warn service=gateway message="Invalid token"',
  },
  {
    label: "Missing timestamp (uses default)",
    input: "info [worker] Processing batch completed",
  },
  {
    label: "Lowercase level",
    input: "2024-01-15T10:30:00Z debug [cache] Hit ratio 0.95",
  },
  {
    label: "Malformed / minimal",
    input: "garbage text without structure",
  },
  {
    label: "DB timeout pattern",
    input: "2024-01-15T10:30:00Z ERROR [db] Query timeout after 5s",
  },
  {
    label: "Auth failure pattern",
    input: "2024-01-15T10:30:01Z ERROR [auth] Invalid token provided",
  },
];

function runSingleTests(): void {
  console.log("\n--- Single-line normalization tests ---\n");
  for (const { label, input } of EXAMPLE_LOGS) {
    try {
      const result = normalizeLogLine(input);
      console.log(`[${label}]`);
      console.log(`  Input:  ${input.slice(0, 80)}${input.length > 80 ? "..." : ""}`);
      console.log(`  Output: ${JSON.stringify(result, null, 2).split("\n").join("\n  ")}`);
      console.log("");
    } catch (err) {
      console.error(`[${label}] ERROR:`, err instanceof Error ? err.message : String(err));
      console.log("");
    }
  }
}

function runBatchTest(): void {
  const rawLines = EXAMPLE_LOGS.map((e) => e.input);
  try {
    const results = normalizeLogs(rawLines);
    console.log("\n=== NORMALIZATION RESULT ===\n");
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("Batch normalization ERROR:", err instanceof Error ? err.message : String(err));
  }
}

function runEdgeCases(): void {
  console.log("\n--- Edge case: empty input array ---\n");
  try {
    const results = normalizeLogs([]);
    console.log("Input: []");
    console.log("Output:", JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("Empty array ERROR:", err instanceof Error ? err.message : String(err));
  }
}

function main(): void {
  console.log("CommanderD Normalization Tests");
  console.log("==============================");
  runSingleTests();
  runEdgeCases();
  runBatchTest();
}

main();
