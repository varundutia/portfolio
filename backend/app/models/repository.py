import uuid
from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.enums import RepositoryCategory, RepositoryFileKind


class Repository(Base):
    """A GitHub repository synced into Postgres. The public site always reads from here —
    never live from the GitHub API — so it keeps working if GitHub is unavailable."""

    __tablename__ = "repositories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    github_id: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(500))
    homepage: Mapped[str | None] = mapped_column(String(500), nullable=True)
    topics: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    primary_language: Mapped[str | None] = mapped_column(String(50), nullable=True)
    languages: Mapped[dict] = mapped_column(JSONB, default=dict)
    stars: Mapped[int] = mapped_column(Integer, default=0)
    forks: Mapped[int] = mapped_column(Integer, default=0)
    open_issues: Mapped[int] = mapped_column(Integer, default=0)
    default_branch: Mapped[str] = mapped_column(String(100), default="main")
    is_fork: Mapped[bool] = mapped_column(Boolean, default=False)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)

    # Editorial curation — set via the admin UI, not inferred from stars/forks.
    category: Mapped[RepositoryCategory] = mapped_column(
        String(20), default=RepositoryCategory.HIDDEN
    )
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_selected_for_rag: Mapped[bool] = mapped_column(Boolean, default=False)
    curation_note: Mapped[str | None] = mapped_column(Text, nullable=True)

    readme_checksum: Mapped[str | None] = mapped_column(String(64), nullable=True)
    latest_release_tag: Mapped[str | None] = mapped_column(String(100), nullable=True)
    latest_release_published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_meaningful_commit_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    repo_created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    repo_pushed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    files: Mapped[list["RepositoryFile"]] = relationship(
        back_populates="repository", cascade="all, delete-orphan"
    )


class RepositoryFile(Base):
    """A selected file (README, docs/*, ADRs) pulled in for RAG indexing. File-path selection
    is editorial curation controlled via the admin UI — not every source file is indexed."""

    __tablename__ = "repository_files"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE")
    )
    path: Mapped[str] = mapped_column(String(500))
    kind: Mapped[RepositoryFileKind] = mapped_column(String(20), default=RepositoryFileKind.DOC)
    content: Mapped[str] = mapped_column(Text)
    checksum: Mapped[str] = mapped_column(String(64))
    github_url: Mapped[str] = mapped_column(String(500))
    last_synced_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    repository: Mapped["Repository"] = relationship(back_populates="files")
