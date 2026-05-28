import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import (
    Column, String, Text, DateTime, Float, Integer,
    ForeignKey, Enum, JSON, Boolean, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


def now_utc():
    return datetime.now(timezone.utc)


def new_uuid():
    return str(uuid.uuid4())


class EventType(str, PyEnum):
    WORKFLOW_STARTED = "workflow_started"
    WORKFLOW_COMPLETED = "workflow_completed"
    WORKFLOW_FAILED = "workflow_failed"
    PROMPT_SENT = "prompt_sent"
    OUTPUT_RECEIVED = "output_received"
    TOOL_CALLED = "tool_called"
    TOOL_COMPLETED = "tool_completed"
    TOOL_FAILED = "tool_failed"
    APPROVAL_REQUESTED = "approval_requested"
    APPROVAL_GRANTED = "approval_granted"
    APPROVAL_DENIED = "approval_denied"
    MEMORY_READ = "memory_read"
    MEMORY_WRITTEN = "memory_written"
    RETRY_TRIGGERED = "retry_triggered"
    EXECUTION_FAILED = "execution_failed"
    EXECUTION_COMPLETED = "execution_completed"
    AGENT_STARTED = "agent_started"
    AGENT_STOPPED = "agent_stopped"
    DECISION_MADE = "decision_made"
    POLICY_CHECKED = "policy_checked"
    CUSTOM = "custom"


class ApprovalStatus(str, PyEnum):
    PENDING = "pending"
    GRANTED = "granted"
    DENIED = "denied"
    EXPIRED = "expired"


class WorkflowStatus(str, PyEnum):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    agent_type = Column(String(100))
    extra = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    workflows = relationship("Workflow", back_populates="agent")


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    agent_id = Column(UUID(as_uuid=False), ForeignKey("agents.id"), nullable=True)
    name = Column(String(255))
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.RUNNING, nullable=False)
    input = Column(JSON)
    output = Column(JSON)
    error = Column(Text)
    started_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    completed_at = Column(DateTime(timezone=True))
    duration_ms = Column(Integer)
    total_tokens = Column(Integer, default=0)
    total_cost_usd = Column(Float, default=0.0)
    extra = Column("metadata", JSON, default=dict)

    agent = relationship("Agent", back_populates="workflows")
    traces = relationship("Trace", back_populates="workflow", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_workflows_agent_id", "agent_id"),
        Index("ix_workflows_status", "status"),
        Index("ix_workflows_started_at", "started_at"),
    )


class Trace(Base):
    __tablename__ = "traces"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    workflow_id = Column(UUID(as_uuid=False), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    parent_trace_id = Column(UUID(as_uuid=False), ForeignKey("traces.id"), nullable=True)
    name = Column(String(255))
    model = Column(String(100))
    prompt = Column(Text)
    output = Column(Text)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    latency_ms = Column(Integer)
    cost_usd = Column(Float, default=0.0)
    started_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    completed_at = Column(DateTime(timezone=True))
    extra = Column("metadata", JSON, default=dict)

    workflow = relationship("Workflow", back_populates="traces")
    events = relationship("Event", back_populates="trace", cascade="all, delete-orphan")
    tool_calls = relationship("ToolCall", back_populates="trace", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_traces_workflow_id", "workflow_id"),
        Index("ix_traces_started_at", "started_at"),
    )


class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    trace_id = Column(UUID(as_uuid=False), ForeignKey("traces.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(UUID(as_uuid=False), nullable=False)
    event_type = Column(String(100), nullable=False)
    sequence = Column(Integer, nullable=False)
    payload = Column(JSON, default=dict)
    error = Column(Text)
    latency_ms = Column(Integer)
    timestamp = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    extra = Column("metadata", JSON, default=dict)

    trace = relationship("Trace", back_populates="events")

    __table_args__ = (
        Index("ix_events_trace_id", "trace_id"),
        Index("ix_events_workflow_id", "workflow_id"),
        Index("ix_events_event_type", "event_type"),
        Index("ix_events_timestamp", "timestamp"),
    )


class ToolCall(Base):
    __tablename__ = "tool_calls"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    trace_id = Column(UUID(as_uuid=False), ForeignKey("traces.id", ondelete="CASCADE"), nullable=False)
    tool_name = Column(String(255), nullable=False)
    input = Column(JSON)
    output = Column(JSON)
    error = Column(Text)
    status = Column(String(50), default="completed")
    latency_ms = Column(Integer)
    retry_count = Column(Integer, default=0)
    called_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    completed_at = Column(DateTime(timezone=True))
    extra = Column("metadata", JSON, default=dict)

    trace = relationship("Trace", back_populates="tool_calls")

    __table_args__ = (
        Index("ix_tool_calls_trace_id", "trace_id"),
        Index("ix_tool_calls_tool_name", "tool_name"),
    )


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    workflow_id = Column(UUID(as_uuid=False), nullable=False)
    trace_id = Column(UUID(as_uuid=False), nullable=True)
    action = Column(String(255), nullable=False)
    reason = Column(Text)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING, nullable=False)
    policy = Column(String(255))
    requested_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(String(255))
    resolution_note = Column(Text)
    expires_at = Column(DateTime(timezone=True))
    extra = Column("metadata", JSON, default=dict)

    __table_args__ = (
        Index("ix_approvals_workflow_id", "workflow_id"),
        Index("ix_approvals_status", "status"),
    )


class MemoryState(Base):
    __tablename__ = "memory_state"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    workflow_id = Column(UUID(as_uuid=False), nullable=False)
    agent_id = Column(UUID(as_uuid=False), nullable=True)
    key = Column(String(500), nullable=False)
    value = Column(JSON)
    operation = Column(String(50), nullable=False)  # read, write, delete
    timestamp = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    extra = Column("metadata", JSON, default=dict)

    __table_args__ = (
        Index("ix_memory_state_workflow_id", "workflow_id"),
        Index("ix_memory_state_key", "key"),
    )


class ReplaySession(Base):
    __tablename__ = "replay_sessions"

    id = Column(UUID(as_uuid=False), primary_key=True, default=new_uuid)
    workflow_id = Column(UUID(as_uuid=False), nullable=False)
    name = Column(String(255))
    status = Column(String(50), default="created")
    current_event_index = Column(Integer, default=0)
    total_events = Column(Integer, default=0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=now_utc, nullable=False)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    extra = Column("metadata", JSON, default=dict)

    __table_args__ = (
        Index("ix_replay_sessions_workflow_id", "workflow_id"),
    )
