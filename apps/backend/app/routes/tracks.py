from fastapi import APIRouter

router = APIRouter()

@router.get("/tracks")
def get_tracks():
    return [{"id": 1, "name": "Track 1"}, {"id": 2, "name": "Track 2"}] 