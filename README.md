# Kairos

**Operational infrastructure for autonomous systems.**

Kairos captures every prompt, decision, tool call, approval, and failure from your AI agents — and lets you replay, govern, and control them in production.

Not a logger. Not an observability dashboard. A control layer.

```
Trace → Replay → Control → Runtime
```

---

## Quickstart (TypeScript)

```bash
npm install kairos-sdk
```

```typescript
import { createKairos } from 'kairos-sdk'

const kairos = createKairos()
const exec = kairos.execution({ workflowName: 'research-agent' })

exec.setPrompt(userPrompt)
exec.setModel('claude-sonnet-4-6')
exec.toolCall({ name: 'web_search', input: { query }, output: results, latencyMs: 1200 })
exec.decision('Selected most credible source', 0.91)

await exec.complete(output)
// → Open the dashboard to replay every step
```

## Quickstart (Python)

```bash
pip install kairos-sdk
```

```python
from kairos import create_kairos

kairos = create_kairos()
exec = kairos.execution(workflow_name="research-agent")

exec.set_prompt(user_prompt, model="claude-sonnet-4-6")
exec.tool_call("web_search", input={"query": query}, output=results, latency_ms=1200)
exec.decision("Selected most credible source", confidence=0.91)

exec.complete(output)
```

**[Open the live dashboard →](https://kairos-web-lyart.vercel.app/app)**

---

## What you get

| Capability | Description |
|---|---|
| **Trace** | Every event — prompts, tool calls, decisions, memory ops, retries, failures |
| **Replay** | Step-by-step playback. Scrub forward/backward. Inspect every payload. |
| **Approvals** | Human-in-the-loop checkpoints before the agent takes the next action |
| **Control** | *(Coming)* Policies, rollback, intervention, escalation routing |
| **Runtime** | *(Coming)* Execution environments, orchestration, scheduling |

---

## Why not just use logging?

Logs tell you what happened. Replay tells you why.

When an autonomous agent fails in production — after 40 tool calls, 6 decisions, and 3 retries — you can't debug that from logs. You step through it.

That's what Kairos does.

---

## Architecture

```
kairos-core/        FastAPI backend · PostgreSQL · trace ingestion, replay, approvals
kairos-web/         Next.js dashboard · execution viewer, replay UI, approval console
kairos-sdk/         TypeScript SDK · npm install kairos-sdk
kairos-sdk-python/  Python SDK · pip install kairos-sdk
```

## Self-hosted

```bash
# Backend
cd kairos-core
pip install -r requirements.txt
DATABASE_URL=postgresql://... uvicorn app.main:app

# Seed demo data
python seed.py

# Dashboard
cd kairos-web
npm install && npm run dev
```

---

## Roadmap

- [x] Execution tracing
- [x] Step-by-step replay with scrubber
- [x] Approval checkpoints
- [x] TypeScript SDK (`kairos-sdk` on npm)
- [x] Python SDK (`kairos-sdk` on PyPI)
- [ ] Kairos Control — policies, rollback, intervention
- [ ] LangChain / CrewAI / OpenAI Agents SDK integrations
- [ ] Kairos Runtime — orchestration, execution environments
- [ ] Kairos Grid — multi-agent coordination

---

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | /v1/events | Ingest events |
| GET  | /v1/workflows | List executions |
| GET  | /v1/events?workflow_id= | Get event timeline |
| POST | /v1/replay | Create replay session |
| GET  | /v1/replay/:id/events | Get replay events |
| POST | /v1/approvals/:id/resolve | Grant or deny approval |
| GET  | /health | Health check |

Full API docs: [kairos-production-64c5.up.railway.app/docs](https://kairos-production-64c5.up.railway.app/docs)

---

**Live dashboard:** [kairos-web-lyart.vercel.app/app](https://kairos-web-lyart.vercel.app/app)  
**TypeScript SDK:** [npmjs.com/package/kairos-sdk](https://www.npmjs.com/package/kairos-sdk)  
**Python SDK:** PyPI — `pip install kairos-sdk`

MIT License
