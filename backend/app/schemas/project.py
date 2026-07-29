from uuid import UUID

from pydantic import BaseModel

from app.schemas.repository import RepositoryOut


class ProjectOut(BaseModel):
    id: UUID
    slug: str
    title: str
    category: str
    featured: bool
    repositories: list[RepositoryOut] = []

    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    slug: str
    title: str
    category: str = "supporting"
    featured: bool = False
    repository_ids: list[UUID] = []
