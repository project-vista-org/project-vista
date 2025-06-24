import os

import boto3
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

# Determine which connection method to use
if all(
    [AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, RDS_HOST, RDS_DATABASE, RDS_USERNAME]
):
    # Get an RDS IAM authentication token
    def get_rds_auth_token():
        client = boto3.client(
            'rds',
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        token = client.generate_db_auth_token(
            DBHostname=RDS_HOST,
            Port=RDS_PORT,
            DBUsername=RDS_USERNAME,
            Region=AWS_REGION,
        )

        return token

    # Build the connection string with the token
    def get_connection_url():
        token = get_rds_auth_token()
        return (
            f"postgresql://{RDS_USERNAME}:{token}@{RDS_HOST}:{RDS_PORT}/{RDS_DATABASE}"
        )

    # Create engine with IAM authentication
    engine = create_engine(
        get_connection_url(), echo=True, connect_args={"sslmode": "require"}
    )
    print("Using AWS IAM authentication for database connection")
elif DATABASE_URL:
    # Create engine with traditional password authentication
    engine = create_engine(DATABASE_URL, echo=True)
    print("Using traditional password authentication for database connection")
else:
    raise ValueError(
        "No database connection information found. "
        "Please provide either DATABASE_URL or AWS credentials"
    )


def create_db_and_tables():
    """Create database tables from SQLModel models"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session"""
    with Session(engine) as session:
        yield session
