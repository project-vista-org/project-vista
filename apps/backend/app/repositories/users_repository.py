from typing import List

from apps.backend.app.middleware import DatabaseLoggingMixin
from apps.backend.app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class UsersRepository(DatabaseLoggingMixin):
    """Repository for User database operations"""

    def __init__(self):
        super().__init__()

    async def find_by_ids(
        self, user_ids: List[str], session: AsyncSession
    ) -> List[User]:
        """Find users by their IDs"""
        try:
            self.log_db_operation("SELECT", "users", user_ids=user_ids)
            statement = select(User).where(User.id.in_(user_ids))
            result = await session.execute(statement)
            users = result.scalars().all()
            self.log_db_operation(
                "SELECT_RESULT", "users", user_ids=user_ids, count=len(users)
            )
            return users
        except Exception as e:
            self.log_db_error("SELECT", "users", e, user_ids=user_ids)
            raise
