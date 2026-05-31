# Why AI agent failures are invisible — and what to do about it

Traditional observability was designed for a world with clear failure states. A service either returns a 200 or it doesn't. A database query either succeeds or throws. The signal is binary, and the tooling we've built — metrics, traces, alerts — is optimized for detecting that signal.

AI agents don't fail that way.

## The confident wrong answer problem

When a language model agent fails, it rarely throws an exception. It returns something. That something looks structured, sounds reasonable, and passes any schema validation you've put in front of it. The agent completed. From your observability stack's perspective, everything is fine.

The failure is semantic. The agent misunderstood the task, lost track of context across a multi-step workflow, called the wrong tool with subtly incorrect parameters, or hallucinated a piece of state that didn't exist. None of this shows up in your error rates. Your p99 latency looks normal. Your success metrics are green.

This is the core problem: we've inherited an observability model built for deterministic systems and dropped it on top of probabilistic ones without changing the assumptions.

## Why the gap is structural

Deterministic systems fail at boundaries. You can instrument those boundaries — HTTP responses, DB calls, queue consumers — and get high coverage of the failure surface. When something breaks, there's usually a traceable chain of causality you can follow backwards.

Agent systems fail inside reasoning. The boundaries are fuzzy. A single "tool call" might involve a prompt that gets reformulated mid-stream, a retrieval step that returns subtly irrelevant context, and a decision that looks locally coherent but is globally wrong given the task history. None of that is visible in a standard trace.

Worse, agents are often designed to recover from failures — they retry, reformulate, try a different tool. So by the time you observe an outcome, the agent may have already encountered and "handled" several failure modes in ways you never intended. The recovery behavior is itself invisible.

## What actually needs to be captured

Real agent observability requires capturing things that traditional tooling doesn't track:

**Prompt state at each step.** Not just the final prompt — every intermediate state. When an agent reformulates a query between attempts, you need to see both versions. Context drift across long runs is often the root cause, and you can't debug it without the full history.

**Tool call intent vs. execution.** The agent deciding to call a tool and the tool actually executing are two distinct events that need to be recorded separately. The gap between them — parameter construction, schema coercion, retry logic — is where a significant class of failures lives.

**Branching and backtracking.** Agents that retry don't just fail and succeed — they explore paths. An audit of what paths were taken, what triggered backtracking, and what the agent chose to ignore is essential for understanding behavior.

**Confidence signals.** Where the model expressed uncertainty (hedging language, low-confidence outputs) vs. where it was certain and wrong. These have completely different failure profiles and require different mitigations.

**Cross-turn state.** For multi-turn or long-horizon agents, how state evolved across turns. What was in context at turn 7 that wasn't at turn 3. Why the agent's behavior shifted.

## The replay requirement

Logs give you data points. What you need for agents is the ability to reconstruct execution. Not just "what happened" but "what was the agent's full state at each decision point, and can I step through it."

This is what replay means in practice: given an execution ID, you can rerun it with the same inputs — or modified inputs — and compare the outcomes. You can pause at any step and inspect the full context. You can identify exactly where the execution diverged from expected behavior.

Without replay, debugging agent failures is archaeology. You're piecing together what might have happened from fragments. With replay, it's surgery — you go directly to the problem.

## Alerting on things that aren't errors

A byproduct of getting this right is that your alerting model changes. You stop alerting only on exceptions and start alerting on behavioral signatures: unexpected tool sequences, unusually long reasoning chains, outputs that don't match the task category, sudden shifts in agent behavior that might indicate prompt injection or context corruption.

These alerts are harder to write, but they're the ones that matter. The exceptions your current stack catches are mostly recoverable infrastructure problems. The behavioral anomalies are where the real risk lives.

---

This is the problem Kairos Trace was built to address. Traditional APM tools give you infrastructure visibility. Kairos captures execution state — every prompt, every tool call, every branch — so when something goes wrong in a way that doesn't throw an error, you can still find it, understand it, and prevent it from happening again.
