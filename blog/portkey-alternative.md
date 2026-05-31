# Looking for a Portkey alternative? Here's what to consider.

Portkey was acquired by Palo Alto Networks in early 2025. If you were using Portkey for LLM gateway or observability, you're now dealing with the standard post-acquisition uncertainty: roadmap changes, pricing changes, eventual product sunsetting or absorption into a broader enterprise platform that may not fit your use case.

This happens. The question is what to replace it with, and more importantly, what to actually look for when evaluating alternatives given what you're building now vs. what you were building when you first adopted Portkey.

## What Portkey was good at

Portkey's core value was LLM gateway functionality: unified API access across providers, fallback routing, caching, and basic request/response logging. For teams that needed to call multiple LLM providers through a single interface and get basic cost tracking, it solved that problem reasonably well.

Its observability features were essentially LLM call logging. You could see what prompts were sent, what responses came back, latency per call, and cost estimates. For simple prompt-in / response-out applications, this is sufficient.

## What it didn't cover

The gap Portkey never filled was agent observability. This wasn't a design failure — the tool was built before agentic workflows were the primary architecture. But if you're running agents now, Portkey's model of "log LLM calls" doesn't map to your actual failure surface.

Agent observability requires capturing execution graphs, not call sequences. The difference matters:

A call sequence tells you: step 1, model was called with X, returned Y. Step 2, tool was called with Y, returned Z. Step 3, model was called with Z, returned output.

An execution graph tells you: at step 1, the model had context C1 and made decision D1. D1 caused step 2 with parameters derived from D1. The tool at step 2 returned a result that the model incorporated into C2 (not all of it — it selectively used the result). At step 3, the model's behavior was shaped by both the tool result and the original task framing from step 1, which was still in context.

The second representation is what you need to debug real agent failures. Portkey gave you the first.

## What a production agent stack actually needs

When evaluating alternatives, these are the capabilities that matter for teams running agents in production:

**Structured execution tracing.** Every step of agent execution captured as a typed event — model invocations, tool calls, retrieval operations, branching decisions — with parent/child relationships that reconstruct the execution tree.

**Prompt snapshot storage.** Not templates. The actual rendered prompts at each step. Context drift, injection, and truncation bugs are invisible without this.

**Execution replay.** The ability to reconstruct any past execution and step through it. This is not "playback the logs" — it's having the full agent state available at each decision point so you can inspect it.

**Audit trail integrity.** If you're in any regulated space (financial services, healthcare, HR), you need logs that are tamper-evident and exportable in formats that satisfy compliance requirements. LLM call logs in a mutable database don't satisfy Article 12 of the EU AI Act.

**Behavioral alerting.** Alerts that fire on agent behavior patterns, not just infrastructure failures. Unexpected tool call sequences, unusually long chains, outputs that don't match expected task categories.

**Multi-turn session tracking.** If your agents operate across multiple turns or long-horizon tasks, you need to see how state evolved across the full session, not just individual calls.

## The alternatives worth looking at

For pure LLM gateway (the routing/fallback/caching layer), options include LiteLLM (open source, self-hostable), OpenRouter for cloud-based routing, and rolling your own thin gateway layer — which is less work than it sounds for most teams.

The gateway problem is largely solved and relatively commoditized. What's not commoditized is agent observability.

For agent observability specifically, LangSmith covers LangChain-native workflows well. Langfuse is open source and has decent multi-framework support. Both are primarily trace log viewers — they capture events but replay and structured audit trails are limited.

The honest answer is that purpose-built agent observability tooling is still early. Most of the existing tools were built when LLM applications meant simple chains, not complex autonomous agents making decisions across extended execution windows.

## What to evaluate for

When you evaluate alternatives, run this test: take a real failure from your agent system — one where the agent completed but produced a wrong output — and ask whether the tool would have let you identify the root cause in under 15 minutes.

If the answer is "maybe, if we'd added more logging," that's not good enough for a production system. You want tooling where the data is already there because the instrumentation is comprehensive by default, not something you bolt on after failures occur.

---

Kairos Trace is what we built after running into these gaps ourselves. It covers the agent observability layer — structured execution graphs, prompt snapshots, replay, and tamper-evident audit trails. If the gateway layer is your primary need, combine it with LiteLLM. If agent observability is the gap, that's what Kairos is for.
