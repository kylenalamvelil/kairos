from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Optional
from datetime import datetime, timezone

try:
    import httpx
    _HAS_HTTPX = True
except ImportError:
    _HAS_HTTPX = False

try:
    import urllib.request
    import json as _json
    _HAS_URLLIB = True
except ImportError:
    _HAS_URLLIB = False

_DEFAULT_BASE = "https://kairos-production-64c5.up.railway.app"


@dataclass
class KairosExecution:
    _client: "KairosClient"
    _workflow_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    _trace_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    _seq: int = 0
    _workflow_name: Optional[str] = None
    _model: Optional[str] = None
    _started_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def __post_init__(self) -> None:
        self._emit("workflow_started", {"workflow_id": self._workflow_id})

    def _emit(self, event_type: str, payload: dict[str, Any] | None = None, latency_ms: int | None = None) -> "KairosExecution":
        self._seq += 1
        self._client._post("/v1/events", {
            "workflow_id": self._workflow_id,
            "trace_id": self._trace_id,
            "event_type": event_type,
            "sequence": self._seq,
            "payload": payload or {},
            "latency_ms": latency_ms,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        return self

    def set_prompt(self, prompt: str, model: str | None = None) -> "KairosExecution":
        self._model = model
        return self._emit("prompt_sent", {"prompt": prompt[:500], "model": model})

    def set_model(self, model: str) -> "KairosExecution":
        self._model = model
        return self

    def set_tokens(self, prompt_tokens: int, completion_tokens: int) -> "KairosExecution":
        return self._emit("tokens_recorded", {"prompt_tokens": prompt_tokens, "completion_tokens": completion_tokens})

    def set_cost(self, usd: float) -> "KairosExecution":
        return self._emit("cost_recorded", {"cost_usd": usd})

    def tool_call(self, name: str, input: Any = None, output: Any = None, latency_ms: int | None = None) -> "KairosExecution":
        self._emit("tool_called", {"name": name, "input": input}, latency_ms=None)
        self._emit("tool_completed", {"name": name, "output": output}, latency_ms=latency_ms)
        return self

    def decision(self, reasoning: str, confidence: float | None = None) -> "KairosExecution":
        return self._emit("decision_made", {"reasoning": reasoning, "confidence": confidence})

    def policy_check(self, policy: str, result: str) -> "KairosExecution":
        return self._emit("policy_checked", {"policy": policy, "result": result})

    def memory_write(self, key: str, value: Any = None) -> "KairosExecution":
        return self._emit("memory_written", {"key": key, "value": value})

    def memory_read(self, key: str, value: Any = None) -> "KairosExecution":
        return self._emit("memory_read", {"key": key, "value": value})

    def retry(self, attempt: int, reason: str | None = None) -> "KairosExecution":
        return self._emit("retry_triggered", {"attempt": attempt, "reason": reason})

    def event(self, event_type: str, payload: dict[str, Any] | None = None) -> "KairosExecution":
        return self._emit(event_type, payload)

    def complete(self, output: Any = None) -> "KairosExecution":
        self._emit("execution_completed", {"output": str(output)[:1000] if output else None})
        self._client._post("/v1/workflows", {
            "id": self._workflow_id,
            "name": self._workflow_name,
            "status": "completed",
            "started_at": self._started_at,
            "total_tokens": 0,
            "total_cost_usd": 0.0,
        })
        return self

    def fail(self, error: str) -> "KairosExecution":
        self._emit("execution_failed", {"error": error})
        return self


@dataclass
class KairosClient:
    base_url: str = _DEFAULT_BASE
    debug: bool = False

    def execution(
        self,
        workflow_name: str | None = None,
        agent_id: str | None = None,
    ) -> KairosExecution:
        exec_ = KairosExecution(_client=self)
        exec_._workflow_name = workflow_name
        if workflow_name or agent_id:
            self._post("/v1/workflows", {
                "id": exec_._workflow_id,
                "name": workflow_name,
                "agent_id": agent_id,
                "status": "running",
                "started_at": exec_._started_at,
                "total_tokens": 0,
                "total_cost_usd": 0.0,
            })
        return exec_

    def _post(self, path: str, body: dict) -> None:
        url = self._base_url.rstrip("/") + path
        data = _json.dumps(body).encode()
        try:
            if _HAS_HTTPX:
                import httpx
                httpx.post(url, content=data, headers={"Content-Type": "application/json"}, timeout=5)
            else:
                req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
                with urllib.request.urlopen(req, timeout=5):
                    pass
        except Exception as exc:
            if self.debug:
                print(f"[kairos] {exc}")

    @property
    def _base_url(self) -> str:
        return self.base_url


def create_kairos(base_url: str = _DEFAULT_BASE, debug: bool = False) -> KairosClient:
    return KairosClient(base_url=base_url, debug=debug)
