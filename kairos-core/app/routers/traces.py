from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timezone
from app.database import get_db
from app.models import Trace
from app.schemas import TraceCreate, TraceUpdate, TraceOut

router = APIRouter(prefix="/traces", tags=["traces"])


@router.post("", response_model=TraceOut)
async def create_trace(body: TraceCreate, db: AsyncSession = Depends(get_db)):
    trace = Trace(**body.model_dump())
    db.add(trace)
    await db.commit()
    await db.refresh(trace)
    return trace


@router.get("", response_model=list[TraceOut])
async def list_traces(
    workflow_id: str | None = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    q = select(Trace).order_by(desc(Trace.started_at)).limit(limit).offset(offset)
    if workflow_id:
        q = q.where(Trace.workflow_id == workflow_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{trace_id}", response_model=TraceOut)
async def get_trace(trace_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trace).where(Trace.id == trace_id))
    trace = result.scalar_one_or_none()
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    return trace


@router.patch("/{trace_id}", response_model=TraceOut)
async def update_trace(trace_id: str, body: TraceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trace).where(Trace.id == trace_id))
    trace = result.scalar_one_or_none()
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(trace, field, value)
    if not trace.completed_at:
        trace.completed_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(trace)
    return trace
