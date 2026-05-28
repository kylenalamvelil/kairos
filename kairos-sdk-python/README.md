# kairos-sdk (Python)

The flight recorder for autonomous operations.

Instrument any AI agent in 3 lines. Every prompt, decision, tool call, and failure — captured, replayable, and governable.

## Install

```bash
pip install kairos-sdk
```

Optional — faster HTTP (recommended):

```bash
pip install kairos-sdk[http]
```

## Quickstart

```python
from kairos import create_kairos

kairos = create_kairos()

exec = kairos.execution(workflow_name="research-agent")

exec.set_prompt(user_prompt, model="claude-sonnet-4-6")
exec.tool_call("web_search", input={"query": query}, output=results, latency_ms=1200)
exec.decision("Selected most credible source", confidence=0.91)

exec.complete(output)
```

Open your [Kairos dashboard](https://kairos-web-lyart.vercel.app/app) to see the execution replay.

## LangChain integration

```python
from kairos import create_kairos

kairos = create_kairos()

class KairosCallbackHandler(BaseCallbackHandler):
    def __init__(self, exec):
        self.exec = exec

    def on_llm_start(self, serialized, prompts, **kwargs):
        self.exec.set_prompt(prompts[0])

    def on_tool_start(self, serialized, input_str, **kwargs):
        self._tool_start = time.time()
        self._tool_name = serialized.get("name", "tool")
        self.exec._emit("tool_called", {"name": self._tool_name, "input": input_str})

    def on_tool_end(self, output, **kwargs):
        latency = int((time.time() - self._tool_start) * 1000)
        self.exec._emit("tool_completed", {"name": self._tool_name, "output": str(output)}, latency_ms=latency)

    def on_chain_end(self, outputs, **kwargs):
        self.exec.complete(outputs.get("output"))

exec = kairos.execution(workflow_name="langchain-agent")
handler = KairosCallbackHandler(exec)
agent.run(query, callbacks=[handler])
```

## API

### `create_kairos(base_url?, debug?)`

```python
kairos = create_kairos(
    base_url="https://kairos-production-64c5.up.railway.app",  # default
    debug=False,
)
```

### `kairos.execution(workflow_name?, agent_id?)`

Returns a `KairosExecution` builder.

| Method | Description |
|--------|-------------|
| `.set_prompt(prompt, model?)` | Record the prompt sent to the model |
| `.set_model(model)` | Set the model name |
| `.set_tokens(prompt_tokens, completion_tokens)` | Set token counts |
| `.set_cost(usd)` | Set cost in USD |
| `.tool_call(name, input?, output?, latency_ms?)` | Record a tool call |
| `.decision(reasoning, confidence?)` | Record a model decision |
| `.policy_check(policy, result)` | Record a policy check |
| `.memory_write(key, value?)` | Record a memory write |
| `.memory_read(key, value?)` | Record a memory read |
| `.retry(attempt, reason?)` | Record a retry |
| `.event(type, payload?)` | Emit any custom event |
| `.complete(output?)` | Finish execution as completed |
| `.fail(error)` | Finish execution as failed |

## License

MIT
