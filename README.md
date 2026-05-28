# Kairos

**The control layer for autonomous operations.**

Operational infrastructure for autonomous systems. Telemetry, replay, governance, and runtime visibility — for AI agents and beyond.

---

## Production

| Service | Platform | Status |
|---------|----------|--------|
| kairos-core API | Railway | `railway up` from `kairos-core/` |
| kairos-web | Vercel | `vercel --prod` from `kairos-web/` |

Full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Running Locally (end-to-end in 3 minutes)

### Terminal 1 — Start the backend

```bash
cd kairos-core
docker-compose up
```

API is live at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Terminal 2 — Seed demo data

```bash
cd kairos-core
pip install httpx   # one time
python seed.py
```

This creates 4 demo executions with real events, tool calls, and an approval.

### Terminal 3 — Start the dashboard

```bash
cd kairos-web
npm install
npm run dev
```

Open:
- `http://localhost:3000` — Landing page
- `http://localhost:3000/app` — Execution dashboard (live data from API)

---

## SDK — Instrument any agent

```bash
npm install @kairos/sdk   # coming to npm registry
```

```typescript
import { createKairos } from '@kairos/sdk'

const kairos = createKairos({
  baseUrl: 'http://localhost:8000',
})

const exec = kairos.execution({ workflowName: 'my-agent' })

exec.setPrompt(userInput).setModel('claude-sonnet-4-6')

// ... run your agent ...

exec.toolCall({ name: 'web_search', input: query, output: results, latencyMs: 1200 })
exec.decision('Selected most relevant source', 0.94)
exec.memoryWrite('summary', result)

await exec.complete(finalOutput)
// → Execution fully captured in Kairos
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/ingest | Single-call ingestion (SDK) |
| GET | /v1/workflows | List executions |
| GET | /v1/workflows/:id | Get execution |
| PATCH | /v1/workflows/:id | Update status |
| GET | /v1/traces?workflow_id= | Get traces |
| POST | /v1/events/batch | Batch events |
| GET | /v1/events?workflow_id= | Get timeline |
| POST | /v1/approvals | Request approval |
| POST | /v1/approvals/:id/resolve | Grant or deny |
| POST | /v1/replay | Create replay session |
| GET | /v1/replay/:id/events | Replay events |
| GET | /health | API health check |

---

## Architecture

```
Kairos Trace     Observability, replay, governance, operational memory   [Building now]
Kairos Control   Runtime policy enforcement, approvals, escalation       [Phase 2]
Kairos Grid      Multi-agent coordination, distributed orchestration     [Phase 3]
Kairos Sim       Simulation, adversarial testing, execution forecasting  [Phase 4]
Kairos Runtime   Autonomous execution environments, operational runtimes [Phase 5]
```

---

## Repo Structure

```
kairos/
├── kairos-core/     FastAPI backend — event ingestion, trace storage, replay, governance
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py      8 tables: Workflow, Trace, Event, ToolCall, Approval, MemoryState, ReplaySession, Agent
│   │   ├── schemas.py
│   │   └── routers/       ingest, workflows, traces, events, approvals, replay
│   ├── docker-compose.yml
│   └── seed.py            demo data
│
├── kairos-web/      Next.js — landing page + execution dashboard
│   └── src/
│       ├── app/
│       │   ├── page.tsx          landing page
│       │   └── app/page.tsx      execution dashboard
│       └── lib/
│           └── api.ts            typed API client
│
├── kairos-sdk/      TypeScript SDK — instrument agents in 3 lines
│   └── src/index.ts
│
└── packages/
    └── types/       shared TypeScript types
```

---

## Kairos is NOT

- An AI assistant
- A workflow SaaS tool
- A no-code automation platform
- A productivity wrapper

## Kairos IS

- Operational infrastructure
- The control layer for autonomous systems
- Execution telemetry + replay + governance + orchestration
- Infrastructure that future autonomous systems depend on
