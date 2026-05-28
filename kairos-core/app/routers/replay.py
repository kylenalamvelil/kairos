from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timezone
from app.database import get_db
from app.models import ReplaySession, Event, Trace
from app.schemas import ReplaySessionCreate, ReplaySessionOut, EventOut

router = APIRouter(prefix="/replay", tags=["replay"])


@router.post("", response_model=ReplaySessionOut)
async def create_replay_session(body: ReplaySessionCreate, db: AsyncSession = Depends(get_db)):
    # Count total events for this workflow
    count_result = await db.execute(
        select(func.count(Event.id)).where(Event.workflow_id == body.workflow_id)
    )
    total_events = count_result.scalar() or 0

    session = ReplaySession(
        workflow_id=body.workflow_id,
        name=body.name or f"Replay {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}",
        notes=body.notes,
        extra=body.metadata,
        status="created",
        total_events=total_events,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/{session_id}", response_model=ReplaySessionOut)
async def get_replay_session(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReplaySession).where(ReplaySession.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Replay session not found")
    return session


@router.get("/{session_id}/events", response_model=list[EventOut])
async def get_replay_events(
    session_id: str,
    from_index: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ReplaySession).where(ReplaySession.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Replay session not found")

    events_result = await db.execute(
        select(Event)
        .where(Event.workflow_id == session.workflow_id)
        .order_by(Event.sequence)
        .offset(from_index)
        .limit(limit)
    )
    return events_result.scalars().all()


@router.post("/{session_id}/start", response_model=ReplaySessionOut)
async def start_replay(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReplaySession).where(ReplaySession.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Replay session not found")
    session.status = "running"
    session.started_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(session)
    return session
