from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, require_admin
from app.core.config import get_settings
from app.core.errors import DomainError
from app.models.enums import RepositoryCategory
from app.models.repository import Repository
from app.schemas.repository import (
    RepositoryCurationUpdate,
    RepositoryDetailOut,
    RepositoryOut,
    SyncResultOut,
)
from app.services.github.sync import sync_github

router = APIRouter(prefix="/github", tags=["github"])

_PUBLIC_CATEGORIES = [
    RepositoryCategory.FLAGSHIP,
    RepositoryCategory.SUPPORTING,
    RepositoryCategory.EXPERIMENT,
    RepositoryCategory.ACADEMIC,
    RepositoryCategory.ARCHIVED,
]


@router.get("/repositories", response_model=list[RepositoryOut])
def list_repositories(db: Session = Depends(get_db)) -> list[Repository]:
    return (
        db.query(Repository)
        .filter(Repository.category.in_(_PUBLIC_CATEGORIES))
        .order_by(Repository.featured.desc(), Repository.repo_pushed_at.desc())
        .all()
    )


@router.get("/repositories/{full_name:path}", response_model=RepositoryDetailOut)
def get_repository(full_name: str, db: Session = Depends(get_db)) -> Repository:
    repository = (
        db.query(Repository)
        .options(joinedload(Repository.files))
        .filter(or_(Repository.full_name == full_name, Repository.name == full_name))
        .first()
    )
    if repository is None or repository.category not in _PUBLIC_CATEGORIES:
        raise DomainError("Repository not found.", status_code=404)
    return repository


@router.post("/sync", response_model=SyncResultOut, dependencies=[Depends(require_admin)])
def trigger_sync(db: Session = Depends(get_db)) -> SyncResultOut:
    settings = get_settings()
    result = sync_github(db, settings.github_username, settings.github_token)
    db.commit()
    return SyncResultOut(**result.__dict__)


@router.get("/repositories-admin", response_model=list[RepositoryOut], dependencies=[Depends(require_admin)])
def list_all_repositories_admin(db: Session = Depends(get_db)) -> list[Repository]:
    return db.query(Repository).order_by(Repository.repo_pushed_at.desc()).all()


@router.patch(
    "/repositories/{repository_id}/curation",
    response_model=RepositoryOut,
    dependencies=[Depends(require_admin)],
)
def update_curation(
    repository_id: UUID, payload: RepositoryCurationUpdate, db: Session = Depends(get_db)
) -> Repository:
    repository = db.get(Repository, repository_id)
    if repository is None:
        raise DomainError("Repository not found.", status_code=404)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(repository, field, value)
    db.commit()
    db.refresh(repository)
    return repository
