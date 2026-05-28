"""
Seed Kairos with demo execution data.
Run: python seed.py
Requires the API to be running: docker-compose up
"""
import httpx
import time

BASE = "http://localhost:8000/v1"


def post(path, body):
    r = httpx.post(f"{BASE}{path}", json=body)
    r.raise_for_status()
    return r.json()


def patch(path, body):
    r = httpx.patch(f"{BASE}{path}", json=body)
    r.raise_for_status()
    return r.json()


print("Seeding Kairos with demo executions...\n")

# ── Demo 1: Research agent (completed) ──────────────────────────────────────

ingest = post("/ingest", {
    "workflow_name": "research-agent",
    "trace_name": "Research: AI governance regulations",
    "model": "claude-sonnet-4-6",
    "prompt": "Research the latest AI governance regulations in the EU and summarise key obligations for AI developers.",
    "output": "The EU AI Act (effective August 2024) classifies AI systems by risk level. High-risk systems require conformity assessments, transparency obligations, and human oversight. Developers must maintain technical documentation and implement risk management systems.",
    "prompt_tokens": 312,
    "completion_tokens": 1840,
    "latency_ms": 8420,
    "cost_usd": 0.0118,
    "status": "completed",
    "tool_calls": [
        {"name": "web_search", "input": {"query": "EU AI Act obligations developers 2024"}, "output": {"results": 8, "top_result": "ec.europa.eu"}, "latency_ms": 1640, "status": "completed"},
        {"name": "web_fetch", "input": {"url": "https://ec.europa.eu/ai-act"}, "output": {"bytes": 82000, "status": 200}, "latency_ms": 1850, "status": "completed"},
        {"name": "summarise", "input": {"text_length": 82000}, "output": {"summary_tokens": 420}, "latency_ms": 2100, "status": "completed"},
    ],
    "events": [
        {"type": "workflow_started", "payload": {"agent": "research-agent"}},
        {"type": "prompt_sent", "payload": {"model": "claude-sonnet-4-6", "tokens": 312}},
        {"type": "tool_called", "payload": {"name": "web_search", "query": "EU AI Act obligations developers 2024"}},
        {"type": "tool_completed", "payload": {"name": "web_search", "results": 8}, "latency_ms": 1640},
        {"type": "memory_written", "payload": {"key": "search_results", "bytes": 4200}},
        {"type": "decision_made", "payload": {"reasoning": "EU AI Act most relevant source", "confidence": 0.91}},
        {"type": "tool_called", "payload": {"name": "web_fetch", "url": "https://ec.europa.eu/ai-act"}},
        {"type": "tool_completed", "payload": {"name": "web_fetch", "bytes": 82000}, "latency_ms": 1850},
        {"type": "memory_written", "payload": {"key": "fetched_content", "bytes": 82000}},
        {"type": "output_received", "payload": {"tokens": 1840, "model": "claude-sonnet-4-6"}, "latency_ms": 3480},
        {"type": "execution_completed", "payload": {"duration_ms": 8420}},
    ],
    "metadata": {"source": "demo_seed"}
})
print(f"✓ Research agent  workflow_id={ingest['workflow_id']}")

# ── Demo 2: Code review agent (failed) ──────────────────────────────────────

ingest2 = post("/ingest", {
    "workflow_name": "code-review-agent",
    "trace_name": "Review: authentication module",
    "model": "claude-sonnet-4-6",
    "prompt": "Review the authentication module for security vulnerabilities.",
    "output": None,
    "prompt_tokens": 820,
    "completion_tokens": 0,
    "latency_ms": 3100,
    "cost_usd": 0.0024,
    "status": "failed",
    "error": "Tool call timeout: static_analysis exceeded 30s limit",
    "tool_calls": [
        {"name": "read_file", "input": {"path": "src/auth/jwt.py"}, "output": {"lines": 240}, "latency_ms": 210, "status": "completed"},
        {"name": "static_analysis", "input": {"file": "src/auth/jwt.py"}, "output": None, "error": "Timeout after 30000ms", "latency_ms": 30000, "status": "failed", "retry_count": 2},
    ],
    "events": [
        {"type": "workflow_started", "payload": {"agent": "code-review-agent"}},
        {"type": "prompt_sent", "payload": {"model": "claude-sonnet-4-6", "tokens": 820}},
        {"type": "tool_called", "payload": {"name": "read_file", "path": "src/auth/jwt.py"}},
        {"type": "tool_completed", "payload": {"name": "read_file", "lines": 240}, "latency_ms": 210},
        {"type": "tool_called", "payload": {"name": "static_analysis", "file": "src/auth/jwt.py"}},
        {"type": "retry_triggered", "payload": {"attempt": 1, "reason": "timeout", "tool": "static_analysis"}},
        {"type": "retry_triggered", "payload": {"attempt": 2, "reason": "timeout", "tool": "static_analysis"}},
        {"type": "tool_failed", "payload": {"name": "static_analysis", "error": "Timeout after 30000ms"}, "latency_ms": 30000},
        {"type": "execution_failed", "payload": {"error": "Tool call timeout", "duration_ms": 3100}},
    ],
    "metadata": {"source": "demo_seed"}
})
print(f"✓ Code review (failed)  workflow_id={ingest2['workflow_id']}")

# ── Demo 3: Ops agent with approval checkpoint ───────────────────────────────

ingest3 = post("/ingest", {
    "workflow_name": "ops-agent",
    "trace_name": "Deploy: production release v2.4.1",
    "model": "claude-sonnet-4-6",
    "prompt": "Deploy version 2.4.1 to the production environment.",
    "output": "Deployment initiated. Awaiting human approval before proceeding to production rollout.",
    "prompt_tokens": 180,
    "completion_tokens": 220,
    "latency_ms": 4200,
    "cost_usd": 0.0012,
    "status": "paused",
    "tool_calls": [
        {"name": "run_tests", "input": {"suite": "integration"}, "output": {"passed": 142, "failed": 0}, "latency_ms": 2800, "status": "completed"},
        {"name": "check_staging", "input": {"env": "staging"}, "output": {"health": "healthy", "version": "2.4.1"}, "latency_ms": 380, "status": "completed"},
    ],
    "events": [
        {"type": "workflow_started", "payload": {"agent": "ops-agent", "target": "production"}},
        {"type": "prompt_sent", "payload": {"model": "claude-sonnet-4-6", "tokens": 180}},
        {"type": "tool_called", "payload": {"name": "run_tests", "suite": "integration"}},
        {"type": "tool_completed", "payload": {"name": "run_tests", "passed": 142, "failed": 0}, "latency_ms": 2800},
        {"type": "tool_called", "payload": {"name": "check_staging", "env": "staging"}},
        {"type": "tool_completed", "payload": {"name": "check_staging", "health": "healthy"}, "latency_ms": 380},
        {"type": "policy_checked", "payload": {"policy": "require_human_approval_production", "result": "requires_approval"}},
        {"type": "approval_requested", "payload": {"action": "deploy_to_production", "version": "2.4.1", "risk": "high"}},
    ],
    "metadata": {"source": "demo_seed"}
})
print(f"✓ Ops agent (paused, awaiting approval)  workflow_id={ingest3['workflow_id']}")

# Add the approval request
approval = post("/approvals", {
    "workflow_id": ingest3["workflow_id"],
    "action": "Deploy v2.4.1 to production",
    "reason": "Production deployment requires operator sign-off. All tests passed. Staging healthy.",
    "policy": "require_human_approval_production",
    "metadata": {"version": "2.4.1", "risk_level": "high"}
})
print(f"  └─ Approval requested  approval_id={approval['id']} (status=pending)")

# ── Demo 4: Data pipeline (large execution) ──────────────────────────────────

ingest4 = post("/ingest", {
    "workflow_name": "data-pipeline-agent",
    "trace_name": "ETL: process Q4 analytics dataset",
    "model": "claude-opus-4-7",
    "prompt": "Process the Q4 analytics dataset: clean, transform, and load into the reporting warehouse.",
    "output": "ETL complete. 2.4M records processed. 12,400 anomalies flagged. Report generated.",
    "prompt_tokens": 2800,
    "completion_tokens": 9600,
    "latency_ms": 24100,
    "cost_usd": 0.038,
    "status": "completed",
    "tool_calls": [
        {"name": "fetch_dataset", "input": {"source": "s3://analytics/q4"}, "output": {"records": 2400000, "size_mb": 840}, "latency_ms": 3200, "status": "completed"},
        {"name": "validate_schema", "input": {"records": 2400000}, "output": {"valid": True, "anomalies": 12400}, "latency_ms": 8100, "status": "completed"},
        {"name": "transform_data", "input": {"records": 2400000}, "output": {"transformed": 2387600}, "latency_ms": 9800, "status": "completed"},
        {"name": "load_warehouse", "input": {"records": 2387600, "target": "reporting_db"}, "output": {"loaded": 2387600, "duration_ms": 2900}, "latency_ms": 2900, "status": "completed"},
        {"name": "generate_report", "input": {"anomalies": 12400}, "output": {"report_id": "rpt_q4_2025", "pages": 24}, "latency_ms": 1800, "status": "completed"},
    ],
    "events": [
        {"type": "workflow_started", "payload": {"agent": "data-pipeline-agent", "dataset": "Q4 analytics"}},
        {"type": "prompt_sent", "payload": {"model": "claude-opus-4-7", "tokens": 2800}},
        {"type": "tool_called", "payload": {"name": "fetch_dataset", "source": "s3://analytics/q4"}},
        {"type": "tool_completed", "payload": {"name": "fetch_dataset", "records": 2400000, "size_mb": 840}, "latency_ms": 3200},
        {"type": "memory_written", "payload": {"key": "raw_dataset_ref", "records": 2400000}},
        {"type": "tool_called", "payload": {"name": "validate_schema", "records": 2400000}},
        {"type": "tool_completed", "payload": {"name": "validate_schema", "anomalies": 12400}, "latency_ms": 8100},
        {"type": "decision_made", "payload": {"reasoning": "Anomaly rate 0.5% within tolerance, proceed with transform", "confidence": 0.98}},
        {"type": "tool_called", "payload": {"name": "transform_data"}},
        {"type": "tool_completed", "payload": {"name": "transform_data", "transformed": 2387600}, "latency_ms": 9800},
        {"type": "tool_called", "payload": {"name": "load_warehouse", "target": "reporting_db"}},
        {"type": "tool_completed", "payload": {"name": "load_warehouse", "loaded": 2387600}, "latency_ms": 2900},
        {"type": "memory_written", "payload": {"key": "etl_complete", "records_loaded": 2387600}},
        {"type": "tool_called", "payload": {"name": "generate_report"}},
        {"type": "tool_completed", "payload": {"name": "generate_report", "report_id": "rpt_q4_2025"}, "latency_ms": 1800},
        {"type": "output_received", "payload": {"tokens": 9600}, "latency_ms": 3200},
        {"type": "execution_completed", "payload": {"duration_ms": 24100, "records_processed": 2387600}},
    ],
    "metadata": {"source": "demo_seed", "dataset": "q4_2025"}
})
print(f"✓ Data pipeline (31 events)  workflow_id={ingest4['workflow_id']}")

print(f"\n✓ Seed complete. 4 executions created.")
print(f"\nOpen the dashboard: http://localhost:3000/app")
print(f"View API docs:      http://localhost:8000/docs")
