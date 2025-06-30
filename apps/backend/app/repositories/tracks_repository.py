from typing import List, Optional

from apps.backend.app.middleware import DatabaseLoggingMixin
from apps.backend.app.models.track import Track
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class TracksRepository(DatabaseLoggingMixin):
    """Repository for Track database operations"""

    def __init__(self):
        super().__init__()

    async def find_by_user_id(self, user_id: str, session: AsyncSession) -> List[Track]:
        """Find all tracks for a specific user"""
        try:
            self.log_db_operation("SELECT", "tracks", user_id=user_id)
            statement = select(Track).where(Track.user_id == user_id)
            result = await session.execute(statement)
            tracks = result.scalars().all()
            self.log_db_operation(
                "SELECT_RESULT", "tracks", user_id=user_id, count=len(tracks)
            )
            return tracks
        except Exception as e:
            self.log_db_error("SELECT", "tracks", e, user_id=user_id)
            raise

    async def find_public_tracks_excluding_user(
        self, user_id: str, session: AsyncSession
    ) -> List[Track]:
        """Find all public tracks excluding tracks created by the current user"""
        try:
            self.log_db_operation("SELECT", "public_tracks", user_id=user_id)
            statement = select(Track).where(Track.is_public, Track.user_id != user_id)
            result = await session.execute(statement)
            tracks = result.scalars().all()
            self.log_db_operation(
                "SELECT_RESULT", "public_tracks", user_id=user_id, count=len(tracks)
            )
            return tracks
        except Exception as e:
            self.log_db_error("SELECT", "public_tracks", e, user_id=user_id)
            raise

    @staticmethod
    async def find_by_id_and_user_id(
        track_id: str, user_id: str, session: AsyncSession
    ) -> Optional[Track]:
        """Find a track by ID that belongs to a specific user"""
        statement = select(Track).where(Track.id == track_id, Track.user_id == user_id)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def create(self, track: Track, session: AsyncSession) -> Track:
        """Create a new track in the database"""
        try:
            self.log_db_operation(
                "INSERT", "tracks", user_id=track.user_id, title=track.title
            )
            session.add(track)
            await session.commit()
            await session.refresh(track)
            self.log_db_operation(
                "INSERT_SUCCESS", "tracks", record_id=track.id, user_id=track.user_id
            )
            return track
        except Exception as e:
            self.log_db_error(
                "INSERT", "tracks", e, user_id=track.user_id, title=track.title
            )
            raise

    @staticmethod
    async def update(track: Track, session: AsyncSession) -> Track:
        """Update an existing track in the database"""
        session.add(track)
        await session.commit()
        await session.refresh(track)
        return track

    @staticmethod
    async def delete(track: Track, session: AsyncSession) -> None:
        """Delete a track from the database"""
        await session.delete(track)
        await session.commit()
