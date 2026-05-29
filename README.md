<div align="center">

# KAIROS

**The operational infrastructure for autonomous systems.**

[kairos-web-lyart.vercel.app](https://kairos-web-lyart.vercel.app) · [Docs](https://kairos-web-lyart.vercel.app/docs) · [npm](https://www.npmjs.com/package/kairos-sdk) · [PyPI](https://pypi.org/project/kairos-sdk)

</div>

---

## Kairos Trace

**Operational memory for autonomous systems.**

When an AI agent fails, you have no idea what happened. Which tool? Which decision? Why?

Kairos Trace records every prompt, tool call, decision, and failure — then lets you **replay the entire execution** step by step.

## Install

```bash
npm install kairos-sdk
# or
pip install kairos-sdk
```

## Quick Start

```typescript
import { createKairos } from 'kairos-sdk'

const exec = createKairos().execution({ workflowName: 'my-agent' })

exec.setPrompt('Research the EU AI Act', 'gpt-4o')
exec.toolCall({ name: 'web_search', input: { q: 'EU AI Act' }, output: { results: [] }, latencyMs: 840 })
exec.decision('EUR-Lex is most authoritative', 0.93)

await exec.complete('Summary: ...')
```

```python
from kairos import create_kairos

exec = create_kairos().execution(workflow_name='my-agent')
exec.set_prompt('Research the EU AI Act', model='gpt-4o')
exec.tool_call('web_search', input={'q': 'EU AI Act'}, output={'results': []}, latency_ms=840)
exec.decision('EUR-Lex is most authoritative', confidence=0.93)
exec.complete('Summary: ...')
```

Open the [dashboard](https://kairos-web-lyart.vercel.app/app) to replay your execution.

---

## Framework Integrations

| Framework | Integration |
|---|---|
| LangChain | `examples/langchain_integration.py` |
| OpenAI Agents SDK | `examples/openai_agents_integration.py` |
| CrewAI | `examples/crewai_integration.py` |
| LlamaIndex | `examples/llamaindex_integration.py` |

---

## What Gets Recorded

Every event during autonomous execution:

- **Prompts** — model, token count, content
- **Tool calls** — name, input, output, latency
- **Decisions** — reasoning, confidence score
- **Policy checks** — policy name, result
- **Memory operations** — reads and writes
- **Failures** — error, stack trace, retry attempts
- **Costs** — tokens, USD per execution

---

## Platform

Kairos is built as a layered platform. Today, Trace is live.

```
Kairos Trace    →  Operational memory          [Live]
Kairos Control  →  Governance and approval     [Next]
Kairos Runtime  →  Execution environments      [Planned]
Kairos Grid     →  Multi-agent coordination    [Planned]
Kairos Sim      →  Adversarial simulation      [Future]
```

---

## Self-Hosting

```bash
git clone https://github.com/withkairos/kairos
cd kairos/kairos-core
pip install -r requirements.txt
# Set DATABASE_URL
uvicorn main:app --reload
```

```typescript
// Point SDK at your instance
const kairos = createKairos({ baseUrl: 'http://localhost:8000' })
```

---

## API

- Hosted: `https://kairos-production-64c5.up.railway.app`
- Interactive docs: `https://kairos-production-64c5.up.railway.app/docs`

---

*Kairos — Operational infrastructure for autonomous systems.*
