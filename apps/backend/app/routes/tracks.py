from typing import List

from apps.backend.app.auth import get_current_user
from apps.backend.app.database import get_session
from apps.backend.app.models.track import TrackCreate, TrackResponse, TrackUpdate
from apps.backend.app.models.user import User
from apps.backend.app.repositories.tracks_repository import TracksRepository
from apps.backend.app.services.tracks_service import TracksService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/tracks", tags=["tracks"])


@router.get("/", response_model=List[TrackResponse])
async def get_tracks(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get all tracks for the authenticated user"""
    return await TracksRepository.find_by_user_id(
        user_id=current_user.id, session=session
    )


@router.post("/", response_model=TrackResponse, status_code=status.HTTP_201_CREATED)
async def create_track(
    track_data: TrackCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new track for the authenticated user"""
    return await TracksService.create_track(
        track_data=track_data, user_id=current_user.id, session=session
    )


@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(
    track_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get a specific track (must belong to the authenticated user)"""
    track = await TracksRepository.find_by_id_and_user_id(
        track_id=track_id, user_id=current_user.id, session=session
    )

    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Track not found"
        )

    return track


@router.put("/{track_id}", response_model=TrackResponse)
async def update_track(
    track_id: str,
    track_data: TrackUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update a track (must belong to the authenticated user)"""
    return await TracksService.update_track(
        track_id=track_id,
        track_data=track_data,
        user_id=current_user.id,
        session=session,
    )


@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_track(
    track_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Delete a track (must belong to the authenticated user)"""
    await TracksService.delete_track(
        track_id=track_id, user_id=current_user.id, session=session
    )
    return None
