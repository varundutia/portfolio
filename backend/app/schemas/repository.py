from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import RepositoryCategory


class RepositoryFileOut(BaseModel):
    id: UUID
    path: str
    kind: str
    content: str
    github_url: str
    last_synced_at: datetime

    model_config = {"from_attributes": True}


class RepositoryOut(BaseModel):
    id: UUID
    full_name: str
    name: str
    description: str | None
    url: str
    homepage: str | None
    topics: list[str]
    primary_language: str | None
    languages: dict
    stars: int
    forks: int
    open_issues: int
    is_fork: bool
    is_archived: bool
    category: str
    featured: bool
    is_selected_for_rag: bool
    latest_release_tag: str | None
    latest_release_published_at: datetime | None
    last_meaningful_commit_at: datetime | None
    repo_created_at: datetime | None
    repo_pushed_at: datetime | None
    last_synced_at: datetime | None

    model_config = {"from_attributes": True}


class RepositoryDetailOut(RepositoryOut):
    files: list[RepositoryFileOut] = []


class RepositoryCurationUpdate(BaseModel):
    category: RepositoryCategory | None = None
    featured: bool | None = None
    is_selected_for_rag: bool | None = None
    curation_note: str | None = None


class SyncResultOut(BaseModel):
    repositories_synced: int
    documentation_files_indexed: int
    documentation_files_unchanged: int
    errors: list[str]
