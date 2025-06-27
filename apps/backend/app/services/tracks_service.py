from datetime import datetime

from apps.backend.app.models.track import Track, TrackCreate, TrackUpdate
from apps.backend.app.repositories.tracks_repository import TracksRepository
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class TracksService:
    """Service for Track business logic"""

    def __init__(self):
        self.tracks_repository = TracksRepository()

    async def create_track(
        self, track_data: TrackCreate, user_id: str, session: AsyncSession
    ) -> Track:
        """Create a new track with business logic"""
        track = Track(
            title=track_data.title,
            description=track_data.description,
            user_id=user_id,
            articles=[article.model_dump() for article in track_data.articles],
        )
        return await self.tracks_repository.create(track=track, session=session)

    async def update_track(
        self,
        track_id: str,
        track_data: TrackUpdate,
        user_id: str,
        session: AsyncSession,
    ) -> Track:
        """Update a track with business logic and validation"""
        track = await TracksRepository.find_by_id_and_user_id(
            track_id=track_id, user_id=user_id, session=session
        )

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
            track.articles = [article.model_dump() for article in track_data.articles]

        track.updated_at = datetime.utcnow()

        return await TracksRepository.update(track=track, session=session)

    async def delete_track(
        self, track_id: str, user_id: str, session: AsyncSession
    ) -> None:
        """Delete a track with validation"""
        track = await TracksRepository.find_by_id_and_user_id(
            track_id=track_id, user_id=user_id, session=session
        )

        if not track:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Track not found"
            )

        await TracksRepository.delete(track=track, session=session)
