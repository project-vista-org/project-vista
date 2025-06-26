import os
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel

# Load environment variables from .env file
load_dotenv()

# Get AWS credentials and RDS info from environment variables
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
RDS_HOST = os.getenv("RDS_HOST")
RDS_PORT = os.getenv("RDS_PORT", "5432")
RDS_DATABASE = os.getenv("RDS_DATABASE")
RDS_USERNAME = os.getenv("RDS_USERNAME")

# Fallback to traditional DATABASE_URL if AWS credentials are not provided
DATABASE_URL = os.getenv("DATABASE_URL")

# Convert postgres:// to postgresql+asyncpg:// for async support
if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Create async engine
    engine = create_async_engine(DATABASE_URL, echo=True)
    print("Using async database connection with asyncpg")
else:
    raise ValueError("No DATABASE_URL found. Please set DATABASE_URL in your .env file")


async def create_db_and_tables():
    """Create database tables from SQLModel models"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get an async database session"""
    async with AsyncSession(engine) as session:
        yield session
