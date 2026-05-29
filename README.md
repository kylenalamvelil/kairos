# Kairos

**Operational memory for autonomous systems.**

When an AI agent fails, you have no idea what happened. Which tool? Which decision? Why?

Kairos records every prompt, tool call, decision, and failure — then lets you **replay the entire execution** step by step.

[Dashboard](https://kairos-web-lyart.vercel.app/app) · [Docs](https://kairos-web-lyart.vercel.app/docs) · [npm](https://www.npmjs.com/package/kairos-sdk) · [PyPI](https://pypi.org/project/kairos-sdk)

---

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
// Open dashboard to replay this execution
```

```python
from kairos import create_kairos

exec = create_kairos().execution(workflow_name='my-agent')
exec.set_prompt('Research the EU AI Act', model='gpt-4o')
exec.tool_call('web_search', input={'q': 'EU AI Act'}, output={'results': []}, latency_ms=840)
exec.decision('EUR-Lex is most authoritative', confidence=0.93)
exec.complete('Summary: ...')
```

---

## Framework Integrations

### LangChain

```python
from examples.langchain_integration import KairosCallbackHandler

handler = KairosCallbackHandler(workflow_name='my-agent')
llm = ChatOpenAI(callbacks=[handler])
# Every run is automatically recorded
```

### OpenAI Agents SDK

```python
from examples.openai_agents_integration import kairos_trace

Tracer = kairos_trace()
with Tracer(runner, workflow_name='my-agent') as tracer:
    result = tracer.run('Research the EU AI Act')
```

### LlamaIndex

```python
from examples.llamaindex_integration import KairosCallbackHandler
from llama_index.core.callbacks import CallbackManager

Settings.callback_manager = CallbackManager([KairosCallbackHandler()])
# All queries and agent runs are now recorded
```

### CrewAI

```python
from examples.crewai_integration import KairosCrewCallback

crew = Crew(agents=[...], tasks=[...], callbacks=[KairosCrewCallback()])
```

---

## What Gets Recorded

| Event | Description |
|---|---|
| `workflow.started` | Agent started, run_id assigned |
| `prompt.sent` | Model, token count |
| `tool.called` | Tool name, input, latency |
| `tool.completed` | Output, latency |
| `decision.scored` | Reasoning, confidence |
| `memory.written` | Key, size |
| `policy.checked` | Policy, result |
| `run.completed` | Total time, cost |

---

## Platform

```
Kairos Trace    →  Record and replay every autonomous action     [Live]
Kairos Control  →  Govern operations with policy and approval    [Next]
Kairos Runtime  →  Operate execution environments at scale       [Future]
Kairos Grid     →  Coordinate thousands of systems               [Future]
Kairos Sim      →  Predict outcomes before they happen           [Future]
```

---

## Self-Hosting

```bash
git clone https://github.com/kylenalamvelil/kairos
cd kairos/kairos-core
pip install -r requirements.txt
# Set DATABASE_URL in .env
uvicorn main:app --reload
```

Point the SDK at your local server:

```typescript
const kairos = createKairos({ baseUrl: 'http://localhost:8000' })
```

---

## API

- Backend: `https://kairos-production-64c5.up.railway.app`
- Interactive docs: `https://kairos-production-64c5.up.railway.app/docs`

---

## License

MIT
