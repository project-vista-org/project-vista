from typing import List

from apps.backend.app.auth import get_current_user
from apps.backend.app.database import get_session
from apps.backend.app.logging_config import logger
from apps.backend.app.models.track import PublicTrackResponse
from apps.backend.app.models.user import User
from apps.backend.app.services.explore_service import ExploreService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/explore", tags=["explore"])

# Create service instance
explore_service = ExploreService()


@router.get("/tracks", response_model=List[PublicTrackResponse])
async def get_public_tracks(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get public tracks for the explore page (excluding current user's tracks)"""
    logger.info(f"Fetching public tracks for user: {current_user.id}")
    return await explore_service.get_public_tracks(
        current_user_id=current_user.id, session=session
    )
