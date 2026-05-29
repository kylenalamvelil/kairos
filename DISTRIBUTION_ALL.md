# Kairos — Complete Distribution Playbook

Everything is written. You just copy, paste, and submit.

---

## 1. HACKER NEWS — Post this today

URL: news.ycombinator.com/submit

**Title:**
```
Show HN: Kairos Trace – replay and inspect every AI agent execution
```

**URL:**
```
https://kairos-web-lyart.vercel.app
```

**Text (optional):**
```
When an AI agent fails, you have no idea what happened. Which tool? Which decision? Why?

Kairos Trace records every prompt, tool call, decision, and failure — then lets you replay the entire execution step by step.

Two lines to instrument an agent:

  npm install kairos-sdk

  const exec = createKairos().execution({ workflowName: 'my-agent' })
  exec.toolCall({ name: 'search', input: {}, output: {}, latencyMs: 800 })
  await exec.complete('done')

Works with LangChain, OpenAI Agents SDK, CrewAI, and LlamaIndex out of the box.

Open source. Early. Looking for feedback from developers building agents.

GitHub: https://github.com/withkairos/kairos
Docs: https://kairos-web-lyart.vercel.app/docs
```

---

## 2. TWITTER / X — Post this thread

**Tweet 1:**
```
When your AI agent does something wrong, you have no idea what happened.

Which tool failed? Which decision was wrong? What did it actually do?

We built Kairos Trace to answer that.
```

**Tweet 2:**
```
Kairos Trace records every autonomous action — prompts, tool calls, decisions, failures — and lets you replay the entire execution.

Like scrubbing through a video of your agent's run.

npm install kairos-sdk
pip install kairos-sdk
```

**Tweet 3:**
```
Works with:
→ LangChain (callback handler)
→ OpenAI Agents SDK
→ CrewAI
→ LlamaIndex

Two lines to add to any existing agent.

Open source. Early. Looking for feedback.

github.com/withkairos/kairos
```

---

## 3. REDDIT — Post in these subreddits

Subreddits to post in:
- r/LocalLLaMA
- r/MachineLearning
- r/artificial
- r/AIAssistants
- r/LangChain

**Title:**
```
Built a replay system for AI agents – see every prompt, tool call, and decision after the fact
```

**Body:**
```
Debugging AI agents is painful. When something goes wrong you get a final output and no real way to understand what the agent was actually doing.

I built Kairos Trace to fix this. It records every event during agent execution and lets you replay the run step-by-step afterward.

Works with any model or framework. Two lines to add:

Python:
  from kairos import create_kairos
  exec = create_kairos().execution(workflow_name='my-agent')
  exec.tool_call('search', input={...}, output={...})
  exec.complete('done')

TypeScript:
  import { createKairos } from 'kairos-sdk'
  const exec = createKairos().execution({ workflowName: 'my-agent' })
  exec.toolCall({ name: 'search', input: {}, output: {}, latencyMs: 800 })
  await exec.complete('done')

LangChain integration included. Dashboard with replay UI is live.

GitHub: https://github.com/withkairos/kairos
Docs: https://kairos-web-lyart.vercel.app/docs

Looking for feedback — what would make this useful for the agents you're building?
```

---

## 4. DISCORD COMMUNITIES — Post this message

Communities to join and post in:
- LangChain Discord
- OpenAI Developers Discord
- Anthropic Discord
- AI Engineer Discord
- Hugging Face Discord
- Elixir/ML community Discords

**Message:**
```
Hey — built something that might be useful here.

When your AI agent does something unexpected, it's almost impossible to understand why after the fact. Kairos Trace records every prompt, tool call, decision, and failure — and lets you replay it step by step.

Works with LangChain out of the box (callback handler included):

  from langchain_openai import ChatOpenAI
  from kairos import KairosCallbackHandler

  handler = KairosCallbackHandler(workflow_name="my-agent")
  llm = ChatOpenAI(callbacks=[handler])
  # Every run is now recorded and replayable

Two lines. No other changes needed.

Open source: github.com/withkairos/kairos
Docs: kairos-web-lyart.vercel.app/docs

Would genuinely love feedback if you try it.
```

---

## 5. PRODUCT HUNT — Launch here

URL: producthunt.com/posts/new

**Name:**
```
Kairos Trace
```

**Tagline:**
```
Replay and inspect every AI agent execution
```

**Description:**
```
When an AI agent fails, you have no idea what happened.

Kairos Trace records every prompt, tool call, decision, and failure during autonomous agent execution — and lets you replay it step by step, like scrubbing through a video.

Works with LangChain, OpenAI Agents SDK, CrewAI, and LlamaIndex. Two lines to instrument any existing agent.

npm install kairos-sdk / pip install kairos-sdk

Open source. Dashboard live. Replay UI included.
```

**Topics:** Developer Tools, Artificial Intelligence, Open Source

---

## 6. DEV.TO — Write this article

URL: dev.to/new

**Title:**
```
How to replay and debug AI agent executions with Kairos Trace
```

**Tags:** ai, agents, devtools, opensource

**Content:**
```markdown
# How to replay and debug AI agent executions

When an AI agent does something unexpected, debugging it is almost impossible. You have the final output. Maybe some print statements. No real way to understand what the agent was thinking at each step.

I built Kairos Trace to fix this.

## What is Kairos Trace?

Kairos Trace records every event during an AI agent execution:
- Every prompt sent to a model
- Every tool call and its output
- Every decision made and its confidence
- Every policy check
- Every failure

Then it lets you replay the entire execution step by step — like scrubbing through a video.

## Quick Start

```bash
npm install kairos-sdk
```

```typescript
import { createKairos } from 'kairos-sdk'

const exec = createKairos().execution({ workflowName: 'research-agent' })

exec.setPrompt('Research the EU AI Act', 'gpt-4o')
exec.toolCall({ 
  name: 'web_search', 
  input: { query: 'EU AI Act 2025' }, 
  output: { results: [...] }, 
  latencyMs: 840 
})
exec.decision('EUR-Lex is most authoritative', 0.93)

await exec.complete('Summary: ...')
// Open dashboard to replay this execution
```

## LangChain Integration

If you're already using LangChain, add Kairos in two lines:

```python
from langchain_openai import ChatOpenAI
handler = KairosCallbackHandler(workflow_name="my-agent")
llm = ChatOpenAI(callbacks=[handler])
# Every run is now recorded and replayable
```

## Dashboard

The dashboard shows every execution with a timeline view and a replay scrubber. Click any event to see the full payload.

[Open Dashboard](https://kairos-web-lyart.vercel.app/app)

## Open Source

GitHub: https://github.com/withkairos/kairos

Would love feedback — what would make this useful for you?
```
```

---

## 7. GITHUB PERSONAL PROFILE — Update settings

Go to: github.com/settings/profile

**Bio:**
```
Founder, Kairos. Building operational infrastructure for autonomous systems.
```

**Company:**
```
Kairos
```

**Website:**
```
https://kairos-web-lyart.vercel.app
```

---

## 8. GITHUB ORG PROFILE — Create .github repo

Go to: github.com/organizations/withkairos → New repository

**Repository name:** `.github`
**Description:** Kairos org profile
**Public:** Yes

Then create file: `profile/README.md`
Copy content from: `.github/profile/README.md` in the kairos repo

---

## 9. TWITTER PROFILE — Update bio

**Display name:**
```
Kyle Nalamvelil | Kairos
```

**Bio:**
```
Founder, Kairos.
Building the operational infrastructure for autonomous systems.
Kairos Trace — operational memory for autonomous systems.
```

**Website:**
```
https://kairos-web-lyart.vercel.app
```

---

## 10. LINKEDIN — Update profile

**Headline:**
```
Founder & CEO, Kairos — Operational infrastructure for autonomous systems
```

**About:**
```
Building Kairos — the operational infrastructure for autonomous systems.

Autonomous systems increasingly act on behalf of people and organizations. When they fail, most teams have no reliable way to understand what happened, why it happened, or how to prevent it.

Kairos Trace records every prompt, tool call, decision, and failure in autonomous agent execution — and makes it replayable.

Open source: github.com/withkairos
```

---

## 11. DIRECT DM TARGETS

Find developers on Twitter posting about:
- LangChain
- AI agents
- "agent debugging"
- CrewAI
- AutoGen
- OpenAI Assistants

**DM template:**
```
Hey — saw you're building agents with [framework].

I built a replay system that records every prompt, tool call, and decision your agent makes so you can understand what happened after the fact.

Would you be open to trying it? Takes 5 minutes. I'm genuinely looking for feedback from people actually building this stuff.

kairos-web-lyart.vercel.app
```

---

## Priority order

1. HN — today (highest quality traffic)
2. Twitter thread — today
3. r/LocalLLaMA — today
4. Discord communities — this week
5. Profile updates — this week
6. Product Hunt — this week
7. Dev.to article — this week
8. DM 10 developers — this week
