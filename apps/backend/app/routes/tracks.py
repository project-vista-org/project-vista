from datetime import datetime
from typing import List

from apps.backend.app.auth import get_current_user
from apps.backend.app.database import get_session
from apps.backend.app.models.track import Track, TrackCreate, TrackResponse, TrackUpdate
from apps.backend.app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

router = APIRouter(prefix="/api/tracks", tags=["tracks"])


@router.get("/", response_model=List[TrackResponse])
async def get_tracks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get all tracks for the authenticated user"""
    statement = select(Track).where(Track.user_id == current_user.id)
    tracks = session.exec(statement).all()
    return tracks


@router.post("/", response_model=TrackResponse, status_code=status.HTTP_201_CREATED)
async def create_track(
    track_data: TrackCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Create a new track for the authenticated user"""
    track = Track(
        title=track_data.title,
        description=track_data.description,
        user_id=current_user.id,
        articles=track_data.articles,
    )
    session.add(track)
    session.commit()
    session.refresh(track)
    return track


@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(
    track_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get a specific track (must belong to the authenticated user)"""
    statement = select(Track).where(
        Track.id == track_id, Track.user_id == current_user.id
    )
    track = session.exec(statement).first()

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
    session: Session = Depends(get_session),
):
    """Update a track (must belong to the authenticated user)"""
    statement = select(Track).where(
        Track.id == track_id, Track.user_id == current_user.id
    )
    track = session.exec(statement).first()

    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Track not found"
        )

    # Update only provided fields
    if track_data.title is not None:
        track.title = track_data.title
    if track_data.description is not None:
        track.description = track_data.description
    if track_data.articles is not None:
        track.articles = track_data.articles

    track.updated_at = datetime.utcnow()

    session.add(track)
    session.commit()
    session.refresh(track)
    return track


@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_track(
    track_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Delete a track (must belong to the authenticated user)"""
    statement = select(Track).where(
        Track.id == track_id, Track.user_id == current_user.id
    )
    track = session.exec(statement).first()

    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Track not found"
        )

    session.delete(track)
    session.commit()
    return None
