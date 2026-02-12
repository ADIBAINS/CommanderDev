# CommanderD Test & Validation Guide

## Test Scripts

```bash
npx ts-node scripts/testNormalization.ts
npx ts-node scripts/testEngine.ts
```

Or via npm scripts:

```bash
npm run test:normalization
npm run test:engine
```

---

## API Testing

Start the dev server:

```bash
npm run dev
```

Set `OPENAI_API_KEY` in `.env`, then run:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"logs": ["2024-01-15T10:30:00Z ERROR [api] Connection refused", "2024-01-15T10:30:01Z ERROR [db] Query timeout after 5s", "2024-01-15T10:30:02Z WARN [auth] Invalid token provided"]}'
```

Response includes `explanation` (AI-generated Markdown or `null` if OpenAI fails).

---

## Database Validation

### Prisma Studio

```bash
npx prisma studio
```

Opens a web UI at `http://localhost:5555` to inspect and edit records.

### Sample Prisma Query (fetch incidents)

```typescript
import { prisma } from "@/lib/prisma";

// Fetch all incidents ordered by creation time
const incidents = await prisma.incident.findMany({
  orderBy: { createdAt: "desc" },
});

// Fetch incidents by severity
const critical = await prisma.incident.findMany({
  where: { severity: "CRITICAL" },
});

// Fetch latest incident with signals
const latest = await prisma.incident.findFirst({
  orderBy: { createdAt: "desc" },
});
```
