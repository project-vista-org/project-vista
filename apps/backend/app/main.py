import uvicorn
from apps.backend.app.auth import get_current_user
from apps.backend.app.database import create_db_and_tables
from apps.backend.app.logging_config import logger
from apps.backend.app.middleware import LoggingMiddleware
from apps.backend.app.routes import tracks
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Project Vista API", version="1.0.0")

# Add logging middleware (should be first)
app.add_middleware(LoggingMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    logger.info("Starting Project Vista API...")
    await create_db_and_tables()
    logger.info("Database tables initialized")


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Project Vista API", "status": "running"}


@app.get("/api/user/profile")
async def get_user_profile(current_user=Depends(get_current_user)):
    """Get current user's profile"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "avatar_url": current_user.avatar_url,
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "project-vista-api"}


# Include routers
app.include_router(tracks.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
