# Commander Dev

Incident intelligence dashboard with a Next.js frontend and backend.

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** – local or hosted (e.g. [Neon](https://neon.tech))
- **Ollama** (optional) – for AI-generated incident explanations using Llama

## Setup

1. **Install dependencies** (from project root):

   ```bash
   npm install
   ```

2. **Backend database**: Copy the example env and set your PostgreSQL URL:

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your DATABASE_URL
   ```

3. **Create database tables** (one-time):

   ```bash
   cd backend && npx prisma migrate dev
   ```

   Prisma is a library – no separate process. It connects to your database when the backend runs.

4. **Ollama (optional, for AI explanations)**: Install and pull the model:

   ```bash
   # Install Ollama: https://ollama.ai
   ollama pull llama3
   ollama serve   # run in a separate terminal, or: ollama run llama3
   ```

   Without Ollama, log analysis still works, but incident explanations will show a fallback message.

## Development

Run both apps:

```bash
npm run dev
```

- **Frontend**: http://localhost:3000 (UI, dashboard, incidents)
- **Backend**: http://localhost:3001 (API: `/api/analyze`, `/api/incidents`)

The frontend proxies `/api/*` to the backend, so use the frontend URL for the full app.

**For AI explanations**, ensure Ollama is running (`ollama serve` or `ollama run llama3`) before analyzing logs.

### Run individually

- `npm run dev:backend` – backend only (port 3001)
- `npm run dev:frontend` – frontend only (port 3000; needs backend running for API)

## What runs where

| Component   | Separate process? | Notes                                      |
|-------------|-------------------|--------------------------------------------|
| Prisma      | No                | Library; used by backend at runtime        |
| PostgreSQL  | Yes               | Hosted DB (e.g. Neon); set via DATABASE_URL |
| Ollama/Llama| Yes               | `ollama serve` – required for AI explanations |

## Project structure

| Folder     | Description                                                       |
|------------|-------------------------------------------------------------------|
| `frontend/`| Next.js UI – dashboard, incident list/detail, log upload          |
| `backend/` | Next.js API – engine, Prisma, `/api/analyze`, `/api/incidents`    |
