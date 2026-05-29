# Distribution — Post These Now

## Hacker News — Show HN

Title:
Show HN: Kairos – Replay and operational memory for AI agents

Body:
When an AI agent fails, you have no idea what happened. Which tool? Which decision? Why?

We built Kairos to fix that. It records every prompt, tool call, decision, and failure — then lets you replay the execution step-by-step, like scrubbing through a video.

Two lines to instrument an agent:

  npm install kairos-sdk
  const exec = kairos.execution({ workflowName: 'my-agent' })
  exec.toolCall({ name: 'search', input: { q: '...' }, output: { results: [...] }, latencyMs: 800 })
  await exec.complete('done')

Dashboard with replay is live. Python SDK available too.

We're early (v0.1) and genuinely want feedback from developers building agents. What would make this useful for you?

https://withkairos.dev
https://github.com/withkairos/kairos

---

## Twitter / X — Thread

Tweet 1:
When your AI agent does something wrong, you have no idea what happened.

Which tool failed? Which decision was wrong? What did it actually do?

We built Kairos to answer that.

Tweet 2:
Kairos records every autonomous action — prompts, tool calls, decisions, failures — and lets you replay the entire execution.

Like scrubbing through a video of your agent's mind.

npm install kairos-sdk
pip install kairos-trace

Tweet 3:
It's early. It's open source. We're looking for developers building agents who want to try it.

Dashboard: withkairos.dev
GitHub: github.com/withkairos/kairos
Docs: withkairos.dev/docs

What are you building?

---

## Reddit — r/LocalLLaMA, r/MachineLearning

Title:
Built a replay system for AI agents – see every prompt, tool call, and decision after the fact

Body:
Debugging AI agents is painful. When something goes wrong you get a final output, maybe some logs, and no real way to understand what the agent was thinking.

I built Kairos to solve this. It records every event during agent execution (prompts, tool calls, decisions, memory ops, policy checks) and stores them so you can replay the run step-by-step afterward.

Works with any model or framework. Two lines to add to an existing agent:

Python:
  from kairos import create_kairos
  exec = create_kairos().execution(workflow_name='my-agent')
  exec.tool_call('search', input={...}, output={...})
  exec.complete('done')

TypeScript:
  import { createKairos } from 'kairos-sdk'
  const exec = createKairos().execution({ workflowName: 'my-agent' })
  exec.toolCall({ name: 'search', input: {...}, output: {...}, latencyMs: 800 })
  await exec.complete('done')

Replay UI, LangChain integration, and self-hosting all work.

Looking for feedback — what would make this useful for the agents you're building?

GitHub: https://github.com/withkairos/kairos

---

## Discord — LangChain / OpenAI Dev servers

Message:
Hey — built a replay system for AI agents that might be useful here.

When your agent does something unexpected, Kairos lets you see exactly what happened: every prompt sent, every tool called, every decision made. You can replay the run step-by-step.

Works with LangChain out of the box (callback handler included). Two lines to add to any existing agent.

npm install kairos-sdk / pip install kairos-trace

Open source: github.com/withkairos/kairos
Docs: withkairos.dev/docs

Would love feedback if you try it.

---

## Direct DM (for agent developers you find on Twitter)

Hey — I saw you're building agents with [framework]. 

I'm working on a replay system that records every prompt, tool call, and decision your agent makes so you can debug and understand what happened after the fact.

Would you be open to trying it? Takes ~5 minutes to install. Genuinely want feedback from people actually building this stuff.

withkairos.dev
