# Kairos — User Outreach Pack

Goal: Get 10 developers to install Kairos Trace and let you watch.
Not: "Please use my startup."
Ask: "Can I watch you install this and give me feedback?"

---

## RULE: What you are asking for

Every outreach message has ONE ask:

"Would you be open to a 20-minute call where I watch you install Kairos Trace?"

Not: "Check out my product."
Not: "Sign up."
Not: "Give me feedback on my landing page."

You want to watch someone install it. That's it.

---

## WHO TO TARGET

Find developers actively building agents. Search on Twitter/X, LinkedIn, Reddit, Discord.

Search terms:
- "building with LangChain"
- "CrewAI agent"
- "LangGraph workflow"
- "AutoGen multi-agent"
- "AI agent debugging"
- "agent failing"
- "my agent keeps"

Priority targets:
1. Someone who just posted about an agent failing or being hard to debug
2. Someone who just shipped an agent project
3. Someone asking about agent observability
4. Someone building with LangChain/LangGraph/CrewAI

---

## TWITTER / X — DM TEMPLATES

### Template A — They posted about an agent failing

```
Hey — saw your tweet about [specific thing they said].

I built something that might actually help with this. Kairos Trace records every step your agent takes — prompt, tool calls, decisions, failures — and lets you replay the execution.

Would you be open to a 20-minute call where I just watch you try it? No pitch. I want to see where it breaks.

pip install kairos-trace
```

### Template B — They're building agents (general)

```
Hey — I see you're building with [LangChain/CrewAI/LangGraph].

I built Kairos Trace — records every step an agent takes and lets you replay it after the fact. Like a flight recorder for your agent.

Would you spend 20 minutes on a call with me and just try installing it while I watch? I'm trying to figure out what breaks. No pitch, just learning.
```

### Template C — They asked about debugging agents

```
Hey — saw you're trying to debug agent behaviour.

I built exactly this. Kairos Trace records everything: prompt, tool calls, decisions, failures. You can replay the execution step by step after it runs.

Two lines:
pip install kairos-trace
from kairos import create_kairos

Would you be open to trying it with me on a 15-minute call? I just want to watch you go through it.
```

---

## LINKEDIN — CONNECTION MESSAGE

```
Hi [name] — I see you're building AI agents at [company].

I built Kairos Trace — it records every prompt, tool call, and decision your agent makes, then lets you replay the execution. Built for teams who need to understand what their agents actually did.

Would you be open to a quick call where I watch you try the install? I'm looking for early feedback from people actually building this stuff.
```

---

## LINKEDIN — DM (after connecting)

```
Thanks for connecting.

Quick context: I'm building Kairos, operational memory for autonomous systems. Kairos Trace is the first product — records and replays agent execution.

I'm not trying to sell you anything. I'm looking for 10 developers who'll let me watch them install it and tell me what breaks. 20 minutes, no pitch.

Are you building anything with agents right now? If so, would you be up for it?
```

---

## DISCORD — Communities to join and post in

Communities:
- LangChain Discord (#help, #showcase, #agents)
- Anthropic Discord
- OpenAI Developers Discord
- AI Engineer Discord
- Hugging Face Discord
- CrewAI Discord

### Post template (general channels):

```
Hey — I'm looking for 5 developers to help me test something.

I built Kairos Trace — records every step your AI agent takes (prompt, tool calls, decisions, failures) and lets you replay the execution. Think flight recorder for agents.

I'm not doing a pitch. I want to watch you install it live on a 20-minute call and see where it breaks.

If you're building agents with LangChain, CrewAI, or OpenAI Agents SDK — DM me. Takes 5 minutes to install and I'll give you a free year of whatever we build.

withkairos.dev/docs
```

### Post template (after someone asks about debugging):

```
This might help — I built Kairos Trace for exactly this. Records every prompt, tool call, and decision your agent makes, then lets you replay step by step.

pip install kairos-trace

No config required for basic usage. If you try it and hit issues DM me — I'm actively looking for feedback.

Docs: withkairos.dev/docs
```

---

## HACKER NEWS — Show HN (post today)

URL: news.ycombinator.com/submit

**Title:**
```
Show HN: Kairos Trace – replay and inspect every AI agent execution
```

**URL:**
```
https://withkairos.dev
```

**Text:**
```
When an AI agent fails, you have no idea what happened. Which tool? Which decision? Why?

Kairos Trace records every prompt, tool call, decision, and failure — then lets you replay the entire execution step by step.

Two lines to instrument an agent:

  pip install kairos-trace
  npm install kairos-sdk

  from kairos import create_kairos
  exec = create_kairos().execution(workflow_name='my-agent')
  exec.tool_call('search', input={}, output={})
  exec.complete('done')

Works with LangChain, LangGraph, OpenAI Agents SDK, CrewAI, LlamaIndex, and AutoGen.

Open source. Early. Looking for feedback from developers building agents.

I'm specifically looking for 10 developers who'll let me watch them install it on a call. If you're building agents and want to try it — email me: kylenalamvelil@icloud.com

GitHub: https://github.com/withkairos/kairos
Docs: https://withkairos.dev/docs
```

---

## REDDIT — Posts

### r/LocalLLaMA

**Title:**
```
Built a replay system for AI agents – see every prompt, tool call, and decision after the fact
```

**Body:**
```
Debugging AI agents is painful. When something goes wrong you get a final output and no real way to understand what the agent was actually doing step by step.

I built Kairos Trace to fix this. Records every event during agent execution and lets you replay the run afterward.

Python:
  pip install kairos-trace
  from kairos import create_kairos
  exec = create_kairos().execution(workflow_name='my-agent')
  exec.tool_call('search', input={...}, output={...})
  exec.complete('done')

Works with LangChain, LangGraph, CrewAI, AutoGen, and OpenAI Agents SDK out of the box.

Looking for feedback — especially from anyone who's hit real debugging pain with agents. What would make this useful for you?

GitHub: https://github.com/withkairos/kairos
Docs: https://withkairos.dev/docs
```

### r/MachineLearning, r/LangChain, r/artificial

Same post, same body. Post separately in each.

---

## EMAIL — Cold outreach to developers

Find: developers who've open-sourced agent projects on GitHub.
Find them via: recently starred LangChain/CrewAI repos, recently pushed agent code.

**Subject:**
```
Can I watch you install something? (AI agent tool, 20 min)
```

**Body:**
```
Hi [name],

I saw your [project/repo/post about agents]. Figured you'd be a good person to ask.

I built Kairos Trace — it records every prompt, tool call, and decision your agent makes, then lets you replay the entire execution step by step. Like a flight recorder for agents.

I'm looking for 10 developers who'll spend 20 minutes on a call letting me watch them install it. Not a pitch — I just want to see where it breaks and what's confusing.

Would you be up for it? I can work around your schedule.

pip install kairos-trace
withkairos.dev/docs

— Kyle
```

---

## TWITTER — Launch thread (post today)

**Tweet 1:**
```
When your AI agent does something wrong, you have no idea what happened.

Which tool failed? Which decision was wrong? What did it actually do?

I built Kairos Trace to answer that. 🧵
```

**Tweet 2:**
```
Kairos Trace records every autonomous action — prompts, tool calls, decisions, failures — and lets you replay the entire execution.

Like scrubbing through a video of your agent's run.

pip install kairos-trace
npm install kairos-sdk
```

**Tweet 3:**
```
Works with:
→ LangChain / LangGraph
→ OpenAI Agents SDK
→ CrewAI
→ AutoGen
→ LlamaIndex

Two lines to add to any existing agent. Open source.

github.com/withkairos/kairos

I'm looking for 10 developers to try it and tell me what breaks. DM me.
```

---

## PRIORITY ORDER

Do these today, in order:

1. Post Show HN
2. Post Twitter thread
3. Post r/LocalLLaMA
4. DM 10 developers who posted about agents in the last 48 hours
5. Post in LangChain Discord
6. Post in OpenAI Developers Discord
