import uvicorn
from apps.backend.app.auth import get_current_user
from apps.backend.app.database import create_db_and_tables
from apps.backend.app.routes import tracks
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Project Vista API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://project-vista.pages.dev/",
        "http://your-ec2-public-ip",  # Add your EC2 public IP or domain
    ],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    create_db_and_tables()


@app.get("/")
def read_root():
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
