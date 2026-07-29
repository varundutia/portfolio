from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, require_admin
from app.core.errors import DomainError
from app.models.document import Document
from app.schemas.document import DocumentOut
from app.services.ingestion.pipeline import delete_document, ingest_document

router = APIRouter(prefix="/documents", tags=["documents"])

_MEDIA_TYPES = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "md": "text/markdown",
    "txt": "text/plain",
}


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)) -> list[Document]:
    return (
        db.query(Document)
        .options(joinedload(Document.versions))
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: UUID, db: Session = Depends(get_db)) -> Document:
    document = (
        db.query(Document)
        .options(joinedload(Document.versions))
        .filter(Document.id == document_id)
        .first()
    )
    if document is None:
        raise DomainError("Document not found.", status_code=404)
    return document


@router.get("/{document_id}/file")
def download_document_file(document_id: UUID, db: Session = Depends(get_db)) -> FileResponse:
    document = db.get(Document, document_id)
    if document is None or document.current_version is None:
        raise DomainError("Document not found.", status_code=404)
    version = document.current_version
    path = Path(version.storage_path)
    if not path.exists():
        raise DomainError("The stored file for this document is missing.", status_code=404)
    return FileResponse(
        path,
        media_type=_MEDIA_TYPES.get(document.file_type, "application/octet-stream"),
        filename=document.original_filename,
    )


@router.post("", response_model=DocumentOut, dependencies=[Depends(require_admin)])
async def upload_document(
    file: UploadFile, title: str | None = None, db: Session = Depends(get_db)
) -> Document:
    file_bytes = await file.read()
    document = ingest_document(
        db, file_bytes=file_bytes, original_filename=file.filename or "upload", title=title
    )
    db.commit()
    db.refresh(document)
    return document


@router.post("/{document_id}/reindex", response_model=DocumentOut, dependencies=[Depends(require_admin)])
async def reindex_document(document_id: UUID, file: UploadFile, db: Session = Depends(get_db)) -> Document:
    file_bytes = await file.read()
    document = ingest_document(
        db,
        file_bytes=file_bytes,
        original_filename=file.filename or "upload",
        existing_document_id=document_id,
    )
    db.commit()
    db.refresh(document)
    return document


@router.delete("/{document_id}", status_code=204, dependencies=[Depends(require_admin)])
def remove_document(document_id: UUID, db: Session = Depends(get_db)) -> None:
    delete_document(db, document_id)
    db.commit()
