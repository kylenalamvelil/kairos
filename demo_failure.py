"""
Run this to create a realistic agent failure trace in Kairos.
Then go to withkairos.dev/app and screenshot the replay.
"""
from kairos import create_kairos
import time

kairos = create_kairos()

exec = kairos.execution(workflow_name="research-agent")

exec.set_prompt(
    "Find the latest EU AI Act compliance requirements and summarise obligations for high-risk AI systems.",
    model="gpt-4o"
)

time.sleep(0.1)
exec.tool_call(
    "web_search",
    input={"query": "EU AI Act 2025 compliance requirements"},
    output={"results": ["EUR-Lex Article 13", "GDPR overlap guidance", "Commission FAQ"]},
    latency_ms=1240
)

time.sleep(0.1)
exec.tool_call(
    "fetch_url",
    input={"url": "https://eur-lex.europa.eu/ai-act"},
    output={"status": 200, "content_length": 48200},
    latency_ms=2100
)

time.sleep(0.1)
exec.decision(
    "EUR-Lex is the most authoritative source. Proceeding with full document parse.",
    confidence=0.94
)

time.sleep(0.1)
exec.memory_write("source", "EUR-Lex Article 13 — transparency obligations")

time.sleep(0.1)
exec.tool_call(
    "parse_document",
    input={"content_length": 48200, "format": "pdf"},
    output=None,
    latency_ms=340
)

time.sleep(0.1)
exec.retry(attempt=1, reason="parse_document returned null — retrying with plain text extractor")

time.sleep(0.1)
exec.tool_call(
    "parse_document",
    input={"content_length": 48200, "format": "txt"},
    output=None,
    latency_ms=290
)

time.sleep(0.1)
exec.retry(attempt=2, reason="plain text extractor also failed — document encoding issue")

time.sleep(0.1)
exec.tool_call(
    "parse_document",
    input={"content_length": 48200, "format": "raw"},
    output=None,
    latency_ms=310
)

time.sleep(0.1)
exec.fail(
    "MaxRetriesExceeded: parse_document failed 3 times. "
    "Document could not be extracted in any format. "
    "Agent terminated without producing output."
)

print("\n✓ Demo trace sent.")
print("→ Go to withkairos.dev/app")
print("→ Click the execution 'research-agent'")
print("→ Go to Replay tab")
print("→ Screenshot it")
