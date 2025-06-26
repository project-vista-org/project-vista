import os

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

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

# Use DATABASE_URL if available (simplest approach)
if DATABASE_URL:
    # Create engine with traditional password authentication
    engine = create_engine(DATABASE_URL, echo=True)
    print("Using traditional password authentication for database connection")
else:
    raise ValueError("No DATABASE_URL found. Please set DATABASE_URL in your .env file")


def create_db_and_tables():
    """Create database tables from SQLModel models"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session"""
    with Session(engine) as session:
        yield session
