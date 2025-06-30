from typing import List

from apps.backend.app.models.track import CreatorInfo, PublicTrackResponse
from apps.backend.app.repositories.tracks_repository import TracksRepository
from apps.backend.app.repositories.users_repository import UsersRepository
from sqlalchemy.ext.asyncio import AsyncSession


class ExploreService:
    """Service for Explore page business logic"""

    def __init__(self):
        self.tracks_repository = TracksRepository()
        self.users_repository = UsersRepository()

    async def get_public_tracks(
        self, current_user_id: str, session: AsyncSession
    ) -> List[PublicTrackResponse]:
        """Get public tracks excluding current user's tracks with creator info"""

        # Get public tracks excluding current user
        tracks = await self.tracks_repository.find_public_tracks_excluding_user(
            user_id=current_user_id, session=session
        )

        # Get unique user IDs to fetch creator info
        user_ids = list(set(track.user_id for track in tracks))

        # Fetch creator information using repository
        creators = await self.users_repository.find_by_ids(
            user_ids=user_ids, session=session
        )

        # Create a mapping of user_id to creator info
        creators_map = {
            creator.id: CreatorInfo(
                id=creator.id,
                name=creator.name
                or creator.email.split("@")[0],  # Fallback to email prefix
                avatar=creator.avatar_url,
            )
            for creator in creators
        }

        # Build response objects
        public_tracks = []
        for track in tracks:
            creator = creators_map.get(track.user_id)
            if creator:  # Only include tracks where we found creator info
                public_track = PublicTrackResponse(
                    id=track.id,
                    title=track.title,
                    description=track.description,
                    creator=creator,
                    articles_count=len(track.articles),
                    created_at=track.created_at,
                    # These will be implemented in later steps
                    participant_count=0,
                    is_joined=False,
                )
                public_tracks.append(public_track)

        # Sort by creation date (newest first)
        public_tracks.sort(key=lambda x: x.created_at, reverse=True)

        return public_tracks
