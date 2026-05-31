# The EU AI Act just made audit trails mandatory. Most agent stacks can't produce them.

Article 12 of the EU AI Act requires that high-risk AI systems automatically generate logs sufficient to ensure traceability of the system's operation throughout its lifecycle. If you're deploying AI agents in hiring, credit, healthcare, critical infrastructure, or legal contexts, this applies to you. The regulation is in force. Compliance dates for high-risk systems are already live or imminent.

The problem is that most teams deploying agents have no infrastructure capable of producing a compliant audit trail. They have LLM call logs, maybe some application-level logging, but nothing that captures what the regulation actually requires.

## What Article 12 actually requires

The regulation specifies that logs must capture: the period of each use of the system, the reference database against which input data was checked, the input data, and where relevant, the identity of the natural persons involved in verification.

Read that carefully. It's not asking for application logs. It's asking for:

- Timestamps with enough granularity to reconstruct the sequence of events
- What data sources the system accessed during execution
- The actual inputs that produced each output
- Human touchpoints in the loop

For a simple model inference endpoint, you could probably satisfy this with careful logging. For an agent system — one that reasons across multiple steps, accesses external tools and databases, reformulates its own queries, and potentially operates over minutes or hours — satisfying this requires something fundamentally different.

## The agent complexity problem

Consider a typical document processing agent: it receives a document, decides which sections are relevant, queries a vector database for context, potentially calls external APIs, synthesizes a response, and in some configurations takes downstream actions.

A compliant audit trail for that workflow needs to capture:

**The full execution graph.** Not just the inputs and outputs, but every intermediate step. Which tool was called, with what parameters, at what time, in response to what reasoning. If the agent retried a tool call with different parameters, both attempts need to be in the log.

**Data provenance.** When the agent retrieved context from a vector database, which documents were returned? With what similarity scores? Which ones were actually used in the final reasoning? If the system made a decision that affected a person, and that decision was influenced by a retrieved document, regulators need to be able to trace that chain.

**State at each decision point.** What was in the model's context window at each reasoning step? If the agent made an error, the trail needs to show whether it was caused by incorrect input data, incorrect retrieval, or a reasoning failure — and those have very different remediation paths.

**Human-in-the-loop events.** When did a human review the agent's output? What did they approve or reject? If an agent output went to a human for verification before taking effect, that verification event needs to be part of the record.

## What a compliant audit trail looks like in practice

A compliant trail for a high-risk agent system is essentially an append-only, tamper-evident log of execution events. Each event has:

- A unique execution ID linking it to the broader task
- A step ID and parent step ID (to reconstruct the tree structure)
- A timestamp in UTC with millisecond precision
- An event type (tool call, retrieval, model invocation, human review, decision, action)
- The full input state at that step
- The full output
- Any external data sources accessed and their identifiers
- The identity of any human participants

The "tamper-evident" requirement matters. If you're storing these logs in a system where your engineering team can modify them, that's not compliant. The logs need to be write-once or stored with cryptographic integrity guarantees.

## What most teams are missing

The gap isn't usually in wanting to comply — it's in the fact that agents weren't instrumented with compliance in mind. Teams used LangChain or a custom orchestrator, added some application-level logging, and shipped. The logs they have are:

- Inconsistent (different formats across different tools in the chain)
- Incomplete (intermediate steps were never captured)
- Mutable (stored in databases that can be updated)
- Unstructured (prose logs rather than structured event records)

Retrofitting compliance onto this is harder than building it right from the start, but it's not impossible. The first step is identifying every point in your agent's execution where a decision is made or external data is accessed and ensuring that a structured event is emitted at that point.

## The risk calculus

Non-compliance with the EU AI Act for high-risk systems carries fines up to €30M or 6% of global annual turnover. More practically, if your system causes harm and you can't produce an audit trail, your legal exposure in any subsequent proceeding is significantly worse.

The teams that will handle this well are the ones that treat the audit trail as an engineering requirement from the start, not a compliance box to check later.

---

Kairos Trace captures the full execution graph of agent workflows as structured, immutable trace events. Every tool call, retrieval, model invocation, and human review is recorded with full input/output state. The schema was designed with Article 12 traceability requirements in mind — so when a compliance question comes up, the data is already there.
