from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Event
from app.schemas import EventCreate, EventOut

router = APIRouter(prefix="/events", tags=["events"])


@router.post("", response_model=EventOut)
async def create_event(body: EventCreate, db: AsyncSession = Depends(get_db)):
    event = Event(**body.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


@router.post("/batch", response_model=list[EventOut])
async def create_events_batch(events: list[EventCreate], db: AsyncSession = Depends(get_db)):
    objs = [Event(**e.model_dump()) for e in events]
    db.add_all(objs)
    await db.commit()
    for obj in objs:
        await db.refresh(obj)
    return objs


@router.get("", response_model=list[EventOut])
async def list_events(
    trace_id: str | None = None,
    workflow_id: str | None = None,
    limit: int = 500,
    db: AsyncSession = Depends(get_db),
):
    q = select(Event).order_by(Event.sequence).limit(limit)
    if trace_id:
        q = q.where(Event.trace_id == trace_id)
    elif workflow_id:
        q = q.where(Event.workflow_id == workflow_id)
    result = await db.execute(q)
    return result.scalars().all()
