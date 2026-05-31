# Logs tell you what happened. Replay shows you why.

There's a debugging pattern that works well for deterministic services: something breaks, you look at the logs, you find the error, you fix it. Logs capture the sequence of events. With enough instrumentation, you can usually reconstruct what happened.

For AI agents, this pattern breaks. Not because logs are useless — they're not — but because "what happened" is insufficient for understanding agent failures. You need to know *why* the agent made a particular decision at a particular step, and that requires more than a sequence of events. It requires execution state.

## What logs give you

Even well-instrumented agent logs tell you things like:

- The agent called `search_documents` with query "Q4 revenue figures"
- The tool returned 4 results
- The agent called `generate_summary` with the results
- The final output was X

This is useful. If the agent called the wrong tool entirely, or if a tool threw an error, you'll see it. If latency spiked on a particular step, you'll see it. If an error propagated and caused a downstream failure, you'll see that chain.

What you won't see: what was in the model's context window when it decided to call `search_documents` with that specific query. You won't see what reasoning led it to select those 4 results as sufficient, or ignore a 5th result that was actually more relevant. You won't see what the model's intermediate reasoning was before it generated the summary, or whether it expressed uncertainty that got lost in the final output.

Logs capture events. They don't capture state.

## The retry problem

This becomes critical when agents encounter failures and recover — which they're often designed to do.

Suppose an agent calls a tool, gets a malformed response, reformulates its approach, and eventually produces a correct-looking answer. In the logs, you see: tool call, error, retry, success, output. You know recovery happened.

What you don't know: what reformulation strategy the agent chose, whether the reformulation was actually valid or just happened to produce something that passed validation, and whether the same failure mode will cause different (worse) behavior in a slightly different context.

The retry was logged. The reasoning behind the retry was not.

When agents retry and recover incorrectly — producing outputs that look successful but are semantically wrong — this is almost never visible in logs. The failure is buried under a successful-looking execution. The only way to find it is to inspect what the agent actually had in context at each step.

## What replay adds

Replay is the ability to reconstruct a full execution, not just its events. Given an execution ID, you can step through the agent's state at each decision point — seeing exactly what was in the context window, what the model's output was before tool calls were made, what the agent was "thinking" when it chose to branch or retry.

Concretely, replay captures:

**Prompt snapshots.** The exact prompt sent to the model at each step — not a template, the rendered string with all substitutions applied. This is the single most important thing logs don't capture. Context drift, prompt injection, and truncation failures are all invisible without it.

**Full model outputs before post-processing.** If your pipeline does any extraction, validation, or transformation on model outputs before logging them, you're losing signal. Replay captures the raw completion before any processing.

**Branch points.** Where the agent could have gone multiple directions and chose one. This is the difference between understanding a decision and reconstructing it. With branching captured, you can counterfactually test: what if the agent had taken the other branch?

**Context accumulation over turns.** For multi-turn agents, how context was added to and pruned from the window over time. Context window management bugs — where the agent drops critical information or over-saturates the window with irrelevant history — are nearly impossible to debug from logs alone.

## The debugging workflow this enables

With replay, the debugging workflow looks like this:

An agent produces a wrong output. You pull up the execution in Kairos. You step through it chronologically. At step 3, you see the model was given a truncated context that dropped a key constraint. The agent's subsequent behavior was rational given what it saw — the problem wasn't its reasoning, it was what it was given to reason about.

Without replay: you spend hours trying to reproduce the issue, tweaking inputs, guessing at what state the agent might have been in. Sometimes you find it. Often you don't, and the failure stays latent until it manifests again under production conditions.

With replay: you go to the execution, step to the point of failure, inspect the state, and have your root cause in minutes.

This is the difference in debugging velocity. It compounds over a team. The engineers who can debug agent failures in minutes rather than hours ship faster, break less, and understand their systems at a depth that translates into better design decisions.

## The implementation requirement

Replay requires that you're emitting structured trace events at every step, not just logging strings. Each event needs: a step ID, a parent step ID for tree reconstruction, the full input state, the full output, and a timestamp. Prompt snapshots need to be stored with the trace, not just referenced.

This is more storage than log-level instrumentation, but the storage costs are marginal relative to the debugging value. An execution with 50 steps and full prompt snapshots at each step is typically a few hundred kilobytes.

---

Kairos Trace stores full execution state alongside structured events, so you can step through any agent run exactly as it happened. When something goes wrong, you don't start from the logs and work backwards — you start from the execution and step forward to the failure.
