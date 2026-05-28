from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timezone
from app.database import get_db
from app.models import Workflow, WorkflowStatus
from app.schemas import WorkflowCreate, WorkflowUpdate, WorkflowOut

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.post("", response_model=WorkflowOut)
async def create_workflow(body: WorkflowCreate, db: AsyncSession = Depends(get_db)):
    wf = Workflow(
        agent_id=body.agent_id,
        name=body.name,
        input=body.input,
        metadata=body.metadata,
        status=WorkflowStatus.RUNNING,
    )
    db.add(wf)
    await db.commit()
    await db.refresh(wf)
    return wf


@router.get("", response_model=list[WorkflowOut])
async def list_workflows(
    limit: int = 50,
    offset: int = 0,
    status: WorkflowStatus | None = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(Workflow).order_by(desc(Workflow.started_at)).limit(limit).offset(offset)
    if status:
        q = q.where(Workflow.status == status)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{workflow_id}", response_model=WorkflowOut)
async def get_workflow(workflow_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    wf = result.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf


@router.patch("/{workflow_id}", response_model=WorkflowOut)
async def update_workflow(workflow_id: str, body: WorkflowUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    wf = result.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(wf, field, value)
    if body.status in (WorkflowStatus.COMPLETED, WorkflowStatus.FAILED):
        wf.completed_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(wf)
    return wf
