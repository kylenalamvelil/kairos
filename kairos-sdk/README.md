# kairos-sdk

The flight recorder for autonomous operations.

Instrument any AI agent in 3 lines. Every prompt, decision, tool call, and failure — captured, replayable, and governable.

## Install

```bash
npm install kairos-sdk
```

## Quickstart

```typescript
import { createKairos } from 'kairos-sdk'

const kairos = createKairos()

const exec = kairos.execution({ workflowName: 'research-agent' })

exec.setPrompt(userPrompt)
exec.setModel('claude-sonnet-4-6')
exec.toolCall({ name: 'web_search', input: { query }, output: results, latencyMs: 1200 })
exec.decision('Selected most credible source', 0.91)

await exec.complete(output)
```

That's it. Open [kairos-web-lyart.vercel.app/app](https://kairos-web-lyart.vercel.app/app) to see the execution.

## API

### `createKairos(config?)`

```typescript
const kairos = createKairos({
  baseUrl: 'https://kairos-production-64c5.up.railway.app', // default
  debug: false,
})
```

### `kairos.execution(init?)`

Returns a `KairosExecution` builder. All methods are chainable.

| Method | Description |
|--------|-------------|
| `.setPrompt(prompt)` | Record the prompt sent to the model |
| `.setModel(model)` | Set the model name |
| `.setTokens(prompt, completion)` | Set token counts |
| `.setCost(usd)` | Set cost in USD |
| `.toolCall({ name, input, output, latencyMs })` | Record a tool call (auto-emits tool_called + tool_completed) |
| `.decision(reasoning, confidence?)` | Record a model decision |
| `.policyCheck(policy, result)` | Record a policy/governance check |
| `.memoryWrite(key, value?)` | Record a memory write |
| `.memoryRead(key, value?)` | Record a memory read |
| `.retry(attempt, reason?)` | Record a retry |
| `.event(type, payload?)` | Emit any custom event |
| `.complete(output?)` | Finish execution as completed |
| `.fail(error)` | Finish execution as failed |

## Events

All standard event types are supported with full autocomplete:

`workflow_started` · `prompt_sent` · `tool_called` · `tool_completed` · `tool_failed` · `decision_made` · `policy_checked` · `memory_written` · `memory_read` · `approval_requested` · `retry_triggered` · `execution_completed` · `execution_failed`

## License

MIT
