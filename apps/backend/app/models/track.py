import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from sqlmodel import JSON, Column, Field, SQLModel


class WikipediaArticle(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    completed: bool = False


class TrackBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_public: bool = Field(default=False)


class Track(TrackBase, table=True):
    __tablename__ = "tracks"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    articles: List[WikipediaArticle] = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TrackCreate(TrackBase):
    articles: List[WikipediaArticle]


class TrackUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    articles: Optional[List[WikipediaArticle]] = None
    is_public: Optional[bool] = None


class TrackResponse(TrackBase):
    id: str
    user_id: str
    articles: List[WikipediaArticle]
    created_at: datetime
    updated_at: datetime
