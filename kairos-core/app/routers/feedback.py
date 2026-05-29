from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import logging

router = APIRouter(prefix="/feedback", tags=["feedback"])
logger = logging.getLogger(__name__)


class FeedbackBody(BaseModel):
    page: str
    rating: Optional[str] = None
    text: Optional[str] = None
    ts: Optional[str] = None


@router.post("")
async def submit_feedback(body: FeedbackBody):
    logger.info(f"[feedback] page={body.page} rating={body.rating} text={body.text!r}")
    return {"ok": True}
