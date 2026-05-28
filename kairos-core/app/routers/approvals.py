from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timezone
from app.database import get_db
from app.models import Approval, ApprovalStatus
from app.schemas import ApprovalCreate, ApprovalResolve, ApprovalOut

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.post("", response_model=ApprovalOut)
async def request_approval(body: ApprovalCreate, db: AsyncSession = Depends(get_db)):
    approval = Approval(**body.model_dump(), status=ApprovalStatus.PENDING)
    db.add(approval)
    await db.commit()
    await db.refresh(approval)
    return approval


@router.get("", response_model=list[ApprovalOut])
async def list_approvals(
    status: ApprovalStatus | None = None,
    workflow_id: str | None = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    q = select(Approval).order_by(desc(Approval.requested_at)).limit(limit)
    if status:
        q = q.where(Approval.status == status)
    if workflow_id:
        q = q.where(Approval.workflow_id == workflow_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{approval_id}", response_model=ApprovalOut)
async def get_approval(approval_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    return approval


@router.post("/{approval_id}/resolve", response_model=ApprovalOut)
async def resolve_approval(approval_id: str, body: ApprovalResolve, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(status_code=400, detail=f"Approval already {approval.status}")
    approval.status = body.status
    approval.resolved_at = datetime.now(timezone.utc)
    approval.resolved_by = body.resolved_by
    approval.resolution_note = body.resolution_note
    await db.commit()
    await db.refresh(approval)
    return approval
