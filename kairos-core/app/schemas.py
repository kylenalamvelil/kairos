from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models import EventType, ApprovalStatus, WorkflowStatus


# ── Agents ──────────────────────────────────────────────────────────────────

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    agent_type: Optional[str] = None
    metadata: dict = {}


class AgentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str]
    agent_type: Optional[str]
    metadata: dict = Field(default_factory=dict, validation_alias='extra')
    created_at: datetime


# ── Workflows ────────────────────────────────────────────────────────────────

class WorkflowCreate(BaseModel):
    agent_id: Optional[str] = None
    name: Optional[str] = None
    input: Optional[Any] = None
    metadata: dict = {}


class WorkflowUpdate(BaseModel):
    status: Optional[WorkflowStatus] = None
    output: Optional[Any] = None
    error: Optional[str] = None
    duration_ms: Optional[int] = None
    total_tokens: Optional[int] = None
    total_cost_usd: Optional[float] = None


class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    agent_id: Optional[str]
    name: Optional[str]
    status: WorkflowStatus
    input: Optional[Any]
    output: Optional[Any]
    error: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    total_tokens: int
    total_cost_usd: float
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Traces ───────────────────────────────────────────────────────────────────

class TraceCreate(BaseModel):
    workflow_id: str
    parent_trace_id: Optional[str] = None
    name: Optional[str] = None
    model: Optional[str] = None
    prompt: Optional[str] = None
    metadata: dict = {}


class TraceUpdate(BaseModel):
    output: Optional[str] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    latency_ms: Optional[int] = None
    cost_usd: Optional[float] = None
    completed_at: Optional[datetime] = None


class TraceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    workflow_id: str
    parent_trace_id: Optional[str]
    name: Optional[str]
    model: Optional[str]
    prompt: Optional[str]
    output: Optional[str]
    prompt_tokens: int
    completion_tokens: int
    latency_ms: Optional[int]
    cost_usd: float
    started_at: datetime
    completed_at: Optional[datetime]
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Events ───────────────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    trace_id: str
    workflow_id: str
    event_type: EventType
    sequence: int
    payload: dict = {}
    error: Optional[str] = None
    latency_ms: Optional[int] = None
    metadata: dict = {}


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    trace_id: str
    workflow_id: str
    event_type: EventType
    sequence: int
    payload: dict
    error: Optional[str]
    latency_ms: Optional[int]
    timestamp: datetime
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Tool Calls ───────────────────────────────────────────────────────────────

class ToolCallCreate(BaseModel):
    trace_id: str
    tool_name: str
    input: Optional[Any] = None
    metadata: dict = {}


class ToolCallUpdate(BaseModel):
    output: Optional[Any] = None
    error: Optional[str] = None
    status: Optional[str] = None
    latency_ms: Optional[int] = None
    retry_count: Optional[int] = None
    completed_at: Optional[datetime] = None


class ToolCallOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    trace_id: str
    tool_name: str
    input: Optional[Any]
    output: Optional[Any]
    error: Optional[str]
    status: str
    latency_ms: Optional[int]
    retry_count: int
    called_at: datetime
    completed_at: Optional[datetime]
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Approvals ────────────────────────────────────────────────────────────────

class ApprovalCreate(BaseModel):
    workflow_id: str
    trace_id: Optional[str] = None
    action: str
    reason: Optional[str] = None
    policy: Optional[str] = None
    expires_at: Optional[datetime] = None
    metadata: dict = {}


class ApprovalResolve(BaseModel):
    status: ApprovalStatus
    resolved_by: Optional[str] = None
    resolution_note: Optional[str] = None


class ApprovalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    workflow_id: str
    trace_id: Optional[str]
    action: str
    reason: Optional[str]
    status: ApprovalStatus
    policy: Optional[str]
    requested_at: datetime
    resolved_at: Optional[datetime]
    resolved_by: Optional[str]
    resolution_note: Optional[str]
    expires_at: Optional[datetime]
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Memory State ─────────────────────────────────────────────────────────────

class MemoryStateCreate(BaseModel):
    workflow_id: str
    agent_id: Optional[str] = None
    key: str
    value: Optional[Any] = None
    operation: str = "write"
    metadata: dict = {}


class MemoryStateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    workflow_id: str
    agent_id: Optional[str]
    key: str
    value: Optional[Any]
    operation: str
    timestamp: datetime
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Replay Sessions ──────────────────────────────────────────────────────────

class ReplaySessionCreate(BaseModel):
    workflow_id: str
    name: Optional[str] = None
    notes: Optional[str] = None
    metadata: dict = {}


class ReplaySessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    workflow_id: str
    name: Optional[str]
    status: str
    current_event_index: int
    total_events: int
    notes: Optional[str]
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    metadata: dict = Field(default_factory=dict, validation_alias='extra')


# ── Ingest (single-call trace submission) ────────────────────────────────────

class IngestRequest(BaseModel):
    """Single-call ingestion for SDK use. Captures a complete execution unit."""
    workflow_id: Optional[str] = None
    agent_id: Optional[str] = None
    workflow_name: Optional[str] = None
    trace_name: Optional[str] = None
    model: Optional[str] = None
    prompt: Optional[str] = None
    output: Optional[str] = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    latency_ms: Optional[int] = None
    cost_usd: float = 0.0
    tool_calls: list[dict] = []
    events: list[dict] = []
    status: WorkflowStatus = WorkflowStatus.COMPLETED
    error: Optional[str] = None
    metadata: dict = {}


class IngestResponse(BaseModel):
    workflow_id: str
    trace_id: str
    events_ingested: int
    tool_calls_ingested: int
