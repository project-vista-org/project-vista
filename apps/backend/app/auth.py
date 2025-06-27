import os
from datetime import datetime
from typing import Optional

from apps.backend.app.database import get_session
from apps.backend.app.models.user import User
from apps.backend.app.utils import load_env
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from supabase import Client, create_client

# Load environment variables from .env file
load_env()

# Create Supabase client directly in auth.py instead of importing from main
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_service_key:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(supabase_url, supabase_service_key)

# Security bearer token scheme
security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session),
) -> User:
    """
    Verify JWT token, upsert user into database, and return user data.

    This function:
    1. Verifies the JWT token with Supabase
    2. Gets user data from Supabase Auth
    3. Upserts user info into our local users table
    4. Returns the user object from our database
    """
    try:
        token = credentials.credentials
        # Verify the JWT token with Supabase
        supabase_user = supabase.auth.get_user(token)

        if not supabase_user or not supabase_user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract user data from Supabase Auth
        auth_user = supabase_user.user
        user_id = auth_user.id
        email = auth_user.email
        name = (
            auth_user.user_metadata.get("full_name")
            if auth_user.user_metadata
            else None
        )
        avatar_url = (
            auth_user.user_metadata.get("avatar_url")
            if auth_user.user_metadata
            else None
        )

        # Check if user exists in our database
        statement = select(User).where(User.id == user_id)
        result = await session.execute(statement)
        db_user = result.scalar_one_or_none()

        if db_user:
            # Update existing user
            db_user.email = email
            db_user.name = name
            db_user.avatar_url = avatar_url
            db_user.updated_at = datetime.utcnow()
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)
        else:
            # Create new user
            db_user = User(id=user_id, email=email, name=name, avatar_url=avatar_url)
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)

        return db_user

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security),
    session: AsyncSession = Depends(get_session),
) -> Optional[User]:
    """
    Similar to get_current_user but returns None instead of raising an exception
    when authentication fails. Useful for endpoints that work both for
    authenticated and anonymous users.
    """
    if not credentials:
        return None

    try:
        return await get_current_user(credentials, session)
    except HTTPException:
        return None
