import hashlib
import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import DomainError
from app.models.chunk import Chunk
from app.models.document import Document, DocumentVersion
from app.models.enums import DocumentStatus, SourceType
from app.models.source import Source
from app.services.ingestion.chunk import chunk_pages
from app.services.ingestion.extract import SUPPORTED_EXTENSIONS, extract_text
from app.services.providers.factory import get_embedding_provider


def _checksum(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def ingest_document(
    db: Session,
    *,
    file_bytes: bytes,
    original_filename: str,
    title: str | None = None,
    existing_document_id: uuid.UUID | None = None,
) -> Document:
    """Validate -> extract -> dedupe-by-checksum -> chunk -> embed -> persist. Raises
    `DomainError` on invalid input; any other failure is recorded on the document/version
    row as FAILED with a human-readable `status_detail` rather than propagating a stack trace."""
    extension = original_filename.rsplit(".", 1)[-1].lower() if "." in original_filename else ""
    if extension not in SUPPORTED_EXTENSIONS:
        raise DomainError(
            f"Unsupported file type: .{extension}. Supported types: "
            f"{', '.join(sorted(SUPPORTED_EXTENSIONS))}.",
            status_code=422,
        )
    if not file_bytes:
        raise DomainError("Uploaded file is empty.", status_code=422)

    settings = get_settings()

    if existing_document_id is not None:
        document = db.get(Document, existing_document_id)
        if document is None:
            raise DomainError("Document not found.", status_code=404)
    else:
        document = Document(
            title=title or original_filename,
            original_filename=original_filename,
            file_type=extension,
            status=DocumentStatus.PENDING,
        )
        db.add(document)
        db.flush()

    storage_name = f"{uuid.uuid4()}.{extension}"
    storage_path = settings.storage_path / storage_name
    storage_path.write_bytes(file_bytes)

    version_number = len(document.versions) + 1
    version = DocumentVersion(
        document_id=document.id,
        version_number=version_number,
        storage_path=str(storage_path),
        checksum="",
        status=DocumentStatus.EXTRACTING,
    )
    db.add(version)
    db.flush()

    try:
        extraction = extract_text(str(storage_path), extension)
    except DomainError:
        raise
    except Exception as exc:  # noqa: BLE001 -- convert unexpected extraction failures to a clean status
        version.status = DocumentStatus.FAILED
        version.status_detail = f"Text extraction failed: {exc}"
        document.status = DocumentStatus.FAILED
        db.flush()
        return document

    if extraction.is_empty:
        version.status = DocumentStatus.FAILED
        version.status_detail = (
            "No extractable text was found. If this is a scanned document, OCR may not be "
            "available in this deployment."
        )
        document.status = DocumentStatus.FAILED
        db.flush()
        return document

    checksum = _checksum(extraction.full_text)
    duplicate = (
        db.query(DocumentVersion)
        .filter(
            DocumentVersion.document_id == document.id,
            DocumentVersion.checksum == checksum,
            DocumentVersion.id != version.id,
        )
        .first()
    )
    if duplicate is not None:
        version.status = DocumentStatus.READY
        version.status_detail = (
            f"Identical content to version {duplicate.version_number}; skipped re-indexing."
        )
        version.checksum = checksum
        version.extraction_method = extraction.method
        version.page_count = extraction.page_count
        db.flush()
        return document

    version.checksum = checksum
    version.extraction_method = extraction.method
    version.page_count = extraction.page_count
    version.status = DocumentStatus.CHUNKING
    db.flush()

    chunk_data = chunk_pages(extraction.pages)
    if not chunk_data:
        version.status = DocumentStatus.FAILED
        version.status_detail = "Extraction succeeded but produced no usable chunks."
        document.status = DocumentStatus.FAILED
        db.flush()
        return document

    source = Source(source_type=SourceType.DOCUMENT, title=document.title, document_version_id=version.id)
    db.add(source)
    db.flush()

    version.status = DocumentStatus.EMBEDDING
    db.flush()

    embedder = get_embedding_provider()
    vectors = embedder.embed_documents([c.content for c in chunk_data])

    for data, vector in zip(chunk_data, vectors, strict=True):
        db.add(
            Chunk(
                source_id=source.id,
                chunk_index=data.chunk_index,
                content=data.content,
                page_number=data.page_number,
                section_heading=data.section_heading,
                token_count=data.token_count,
                embedding=vector,
            )
        )

    # Superseding a previous version: keep its chunks in the database (for history) but
    # exclude them from retrieval.
    previous_active_sources = (
        db.query(Source)
        .join(DocumentVersion, Source.document_version_id == DocumentVersion.id)
        .filter(DocumentVersion.document_id == document.id, Source.id != source.id)
        .all()
    )
    for prev_source in previous_active_sources:
        for chunk in prev_source.chunks:
            chunk.is_active = False

    version.status = DocumentStatus.READY
    document.status = DocumentStatus.READY
    document.current_version_id = version.id
    db.flush()
    return document


def delete_document(db: Session, document_id: uuid.UUID) -> None:
    document = db.get(Document, document_id)
    if document is None:
        raise DomainError("Document not found.", status_code=404)
    for version in document.versions:
        try:
            Path(version.storage_path).unlink(missing_ok=True)
        except OSError:
            pass
    db.delete(document)
    db.flush()
