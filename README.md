# Kairos

**Operational memory for autonomous systems.**

Record, replay, govern, and understand every autonomous action before trust breaks.

---

## What is Kairos?

When an AI agent executes code, moves capital, or coordinates operations — something happens. Kairos records exactly what happened, why it happened, and makes it replayable.

Every prompt. Every tool call. Every decision. Every outcome. Recorded. Replayable. Queryable.

---

## Quick Start

### TypeScript

```bash
npm install kairos-sdk
```

```typescript
import { createKairos } from 'kairos-sdk'

const kairos = createKairos()
const exec = kairos.execution({ workflowName: 'my-agent' })

exec.setPrompt('Research the EU AI Act', 'claude-sonnet-4-6')
exec.toolCall({ name: 'web_search', input: { query: 'EU AI Act' }, output: { results: [] }, latencyMs: 840 })
exec.decision('EUR-Lex is most authoritative', 0.93)

await exec.complete('Summary: ...')
// Open dashboard to replay this execution
```

### Python

```bash
pip install kairos-sdk
```

```python
from kairos import create_kairos

kairos = create_kairos()
exec = kairos.execution(workflow_name='my-agent')

exec.set_prompt('Research the EU AI Act', model='claude-sonnet-4-6')
exec.tool_call('web_search', input={'query': 'EU AI Act'}, output={'results': []}, latency_ms=840)
exec.decision('EUR-Lex is most authoritative', confidence=0.93)

exec.complete('Summary: ...')
```

---

## Dashboard

View executions and replay agent runs:
**https://kairos-web-lyart.vercel.app/app**

---

## Architecture

```
Kairos Trace    →  Record and replay every autonomous action     [Live]
Kairos Control  →  Govern operations with policy and approval    [Next]
Kairos Runtime  →  Operate execution environments at scale       [Q3 2026]
Kairos Grid     →  Coordinate across thousands of systems        [Q4 2026]
Kairos Sim      →  Predict outcomes before they happen           [Future]
```

---

## Events recorded

| Event | Description |
|---|---|
| `workflow.started` | Agent started, run_id assigned |
| `prompt.sent` | Model, token count, content |
| `tool.called` | Tool name, input, latency |
| `tool.completed` | Output, latency |
| `decision.scored` | Reasoning, confidence score |
| `memory.written` | Key, size stored |
| `policy.checked` | Policy name, result |
| `run.completed` | Total time, total cost |

---

## API

- Backend: `https://kairos-production-64c5.up.railway.app`
- Docs: `https://kairos-production-64c5.up.railway.app/docs`

---

## License

MIT
