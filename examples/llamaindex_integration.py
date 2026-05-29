"""
Kairos + LlamaIndex Integration

Records every LlamaIndex agent query, tool call, and response.

pip install kairos-sdk llama-index
"""

import time
from llama_index.core.callbacks import CallbackManager, BaseCallbackHandler, CBEventType
from llama_index.core import Settings
from kairos import create_kairos
from typing import Any, Dict, List, Optional


class KairosCallbackHandler(BaseCallbackHandler):
    """
    LlamaIndex callback handler that records execution to Kairos.

    Usage:
        from llama_index.core import Settings
        from llama_index.core.callbacks import CallbackManager

        handler = KairosCallbackHandler(workflow_name="my-agent")
        Settings.callback_manager = CallbackManager([handler])

        # All queries and agent runs are now recorded in Kairos.
    """

    def __init__(self, workflow_name: str = "llamaindex-agent"):
        super().__init__(event_starts_to_ignore=[], event_ends_to_ignore=[])
        self._kairos = create_kairos()
        self._workflow_name = workflow_name
        self._exec = None
        self._event_times: Dict[str, float] = {}

    def on_event_start(self, event_type: CBEventType, payload: Optional[Dict] = None,
                       event_id: str = "", **kwargs) -> str:
        self._event_times[event_id] = time.time()

        if event_type == CBEventType.QUERY:
            self._exec = self._kairos.execution(workflow_name=self._workflow_name)
            if payload:
                query = payload.get("query_str", "")
                self._exec.set_prompt(str(query)[:500])

        elif event_type == CBEventType.LLM:
            if self._exec and payload:
                messages = payload.get("messages", [])
                if messages:
                    self._exec.event("llm.started", {"messages": len(messages)})

        elif event_type in (CBEventType.FUNCTION_CALL, CBEventType.AGENT_STEP):
            if self._exec and payload:
                tool_name = payload.get("function_call", payload.get("name", "tool"))
                self._exec.event("tool.starting", {"tool": str(tool_name)[:100]})

        return event_id

    def on_event_end(self, event_type: CBEventType, payload: Optional[Dict] = None,
                     event_id: str = "", **kwargs) -> None:
        latency = int((time.time() - self._event_times.pop(event_id, time.time())) * 1000)

        if not self._exec:
            return

        if event_type == CBEventType.QUERY:
            response = payload.get("response", "") if payload else ""
            self._exec.complete(str(response)[:500])
            self._exec = None

        elif event_type in (CBEventType.FUNCTION_CALL, CBEventType.AGENT_STEP):
            if payload:
                tool_name = payload.get("function_call", payload.get("name", "tool"))
                output = payload.get("function_call_response", payload.get("output", ""))
                self._exec.tool_call(
                    str(tool_name)[:100],
                    input=payload.get("function_call_args", {}),
                    output={"result": str(output)[:300]},
                    latency_ms=latency,
                )

        elif event_type == CBEventType.LLM:
            if payload:
                usage = payload.get("usage", {})
                if hasattr(usage, "prompt_tokens"):
                    self._exec.set_tokens(usage.prompt_tokens, usage.completion_tokens)

    def start_trace(self, trace_id: Optional[str] = None) -> None:
        pass

    def end_trace(self, trace_id: Optional[str] = None,
                  trace_map: Optional[Dict[str, List[str]]] = None) -> None:
        pass


# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import tempfile, os
    from llama_index.core import VectorStoreIndex, Document
    from llama_index.core.callbacks import CallbackManager

    handler = KairosCallbackHandler(workflow_name="rag-agent")
    Settings.callback_manager = CallbackManager([handler])

    # Create a minimal in-memory document to query
    documents = [
        Document(text="The EU AI Act is a comprehensive regulation that classifies AI systems by risk level. High-risk systems require conformity assessments before deployment.")
    ]
    index = VectorStoreIndex.from_documents(documents)
    query_engine = index.as_query_engine()
    response = query_engine.query("What is the EU AI Act?")
    print(response)

    print("\nReplay at: https://withkairos.dev/app")
