from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from app.database import get_db
from app.models import Workflow, Trace, Event, ToolCall, WorkflowStatus, EventType
from app.schemas import IngestRequest, IngestResponse

router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("", response_model=IngestResponse)
async def ingest(body: IngestRequest, db: AsyncSession = Depends(get_db)):
    """
    Single-call trace ingestion. The SDK calls this once per execution unit.
    Creates or updates the workflow, trace, events, and tool calls atomically.
    """
    now = datetime.now(timezone.utc)

    # Workflow
    if body.workflow_id:
        from sqlalchemy import select
        result = await db.execute(select(Workflow).where(Workflow.id == body.workflow_id))
        wf = result.scalar_one_or_none()
    else:
        wf = None

    if not wf:
        wf = Workflow(
            agent_id=body.agent_id,
            name=body.workflow_name,
            input=None,
            status=body.status,
            metadata=body.metadata,
        )
        if body.status in (WorkflowStatus.COMPLETED, WorkflowStatus.FAILED):
            wf.completed_at = now
        if body.latency_ms:
            wf.duration_ms = body.latency_ms
        wf.total_tokens = body.prompt_tokens + body.completion_tokens
        wf.total_cost_usd = body.cost_usd
        db.add(wf)
        await db.flush()
    else:
        if body.status in (WorkflowStatus.COMPLETED, WorkflowStatus.FAILED):
            wf.status = body.status
            wf.completed_at = now
        wf.total_tokens = (wf.total_tokens or 0) + body.prompt_tokens + body.completion_tokens
        wf.total_cost_usd = (wf.total_cost_usd or 0.0) + body.cost_usd

    # Trace
    trace = Trace(
        workflow_id=wf.id,
        name=body.trace_name,
        model=body.model,
        prompt=body.prompt,
        output=body.output,
        prompt_tokens=body.prompt_tokens,
        completion_tokens=body.completion_tokens,
        latency_ms=body.latency_ms,
        cost_usd=body.cost_usd,
        completed_at=now if body.output else None,
        metadata=body.metadata,
    )
    db.add(trace)
    await db.flush()

    # Events
    events_created = 0
    for i, ev in enumerate(body.events):
        event = Event(
            trace_id=trace.id,
            workflow_id=wf.id,
            event_type=ev.get("type", EventType.CUSTOM),
            sequence=i,
            payload=ev.get("payload", ev),
            latency_ms=ev.get("latency_ms"),
            metadata=ev.get("metadata", {}),
        )
        db.add(event)
        events_created += 1

    # Tool calls
    tool_calls_created = 0
    for tc in body.tool_calls:
        tool_call = ToolCall(
            trace_id=trace.id,
            tool_name=tc.get("name", "unknown"),
            input=tc.get("input"),
            output=tc.get("output"),
            error=tc.get("error"),
            status=tc.get("status", "completed"),
            latency_ms=tc.get("latency_ms"),
            retry_count=tc.get("retry_count", 0),
            metadata=tc.get("metadata", {}),
        )
        db.add(tool_call)
        tool_calls_created += 1

    await db.commit()

    return IngestResponse(
        workflow_id=str(wf.id),
        trace_id=str(trace.id),
        events_ingested=events_created,
        tool_calls_ingested=tool_calls_created,
    )
