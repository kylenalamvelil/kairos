"""
Kairos Quickstart — Python

pip install kairos-sdk
python quickstart.py

Then open: https://withkairos.dev/app
"""

import time
from kairos import create_kairos

kairos = create_kairos()

print("Sending execution to Kairos...")

exec = kairos.execution(workflow_name="research-agent")

# Simulate a real agent run
exec.set_prompt("Research the EU AI Act and summarize key obligations for 2025.", model="claude-sonnet-4-6")

time.sleep(0.1)
exec.tool_call(
    "web_search",
    input={"query": "EU AI Act 2025 obligations"},
    output={"results": ["EUR-Lex article", "Linklaters summary", "EU official FAQ"]},
    latency_ms=1240,
)

exec.decision("EUR-Lex source is most authoritative", confidence=0.93)

exec.tool_call(
    "fetch_page",
    input={"url": "https://eur-lex.europa.eu/..."},
    output={"content": "The EU AI Act establishes..."},
    latency_ms=870,
)

exec.memory_write("eu_act_summary", "High-risk AI systems require conformity assessment...")

exec.set_tokens(prompt_tokens=312, completion_tokens=840)
exec.set_cost(0.0118)

exec.complete("Summary: The EU AI Act requires high-risk AI providers to...")

print("Done.")
print("Open your dashboard: https://withkairos.dev/app")
print("You should see 'research-agent' in the execution list with full replay.")
