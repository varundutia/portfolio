from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, require_admin
from app.core.errors import DomainError
from app.models.project import Project
from app.models.repository import Repository
from app.schemas.project import ProjectCreate, ProjectOut

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    return (
        db.query(Project)
        .options(joinedload(Project.repositories))
        .order_by(Project.featured.desc(), Project.sort_order)
        .all()
    )


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)) -> Project:
    project = (
        db.query(Project)
        .options(joinedload(Project.repositories))
        .filter(Project.slug == slug)
        .first()
    )
    if project is None:
        raise DomainError("Project not found.", status_code=404)
    return project


@router.post("", response_model=ProjectOut, dependencies=[Depends(require_admin)])
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> Project:
    existing = db.query(Project).filter(Project.slug == payload.slug).first()
    if existing is not None:
        raise DomainError("A project with this slug already exists.", status_code=409)
    repositories = (
        db.query(Repository).filter(Repository.id.in_(payload.repository_ids)).all()
        if payload.repository_ids
        else []
    )
    project = Project(
        slug=payload.slug,
        title=payload.title,
        category=payload.category,
        featured=payload.featured,
        repositories=repositories,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
