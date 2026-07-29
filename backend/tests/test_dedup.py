import pytest

from app.core.errors import DomainError
from app.models.chunk import Chunk
from app.models.document import DocumentVersion
from app.models.enums import DocumentStatus
from app.services.ingestion.pipeline import ingest_document
from tests.conftest import requires_db


@requires_db
def test_reuploading_identical_content_is_detected_as_duplicate(db_session, fake_embedder):
    content = b"Varun worked on a payment microservice using NestJS and Razorpay."

    doc = ingest_document(db_session, file_bytes=content, original_filename="resume.txt")
    db_session.flush()
    assert doc.status == DocumentStatus.READY
    first_version_id = doc.current_version_id

    doc2 = ingest_document(
        db_session, file_bytes=content, original_filename="resume.txt", existing_document_id=doc.id
    )
    db_session.flush()

    versions = db_session.query(DocumentVersion).filter_by(document_id=doc.id).all()
    assert len(versions) == 2
    duplicate_version = next(v for v in versions if v.id != first_version_id)
    assert "Identical content" in (duplicate_version.status_detail or "")
    # current_version_id must not have moved to the duplicate — nothing new was actually indexed
    assert doc2.current_version_id == first_version_id


@requires_db
def test_reuploading_changed_content_creates_new_version_and_deactivates_old_chunks(
    db_session, fake_embedder
):
    original = b"Varun built a distributed rate limiter using Redis and Lua scripts."
    updated = b"Varun built a distributed rate limiter using Redis, Lua scripts, and Docker."

    doc = ingest_document(db_session, file_bytes=original, original_filename="notes.txt")
    db_session.flush()
    old_version_id = doc.current_version_id
    old_chunks = db_session.query(Chunk).join(Chunk.source).filter(
        Chunk.source.has(document_version_id=old_version_id)
    ).all()
    assert all(c.is_active for c in old_chunks)
    assert len(old_chunks) > 0

    doc2 = ingest_document(
        db_session, file_bytes=updated, original_filename="notes.txt", existing_document_id=doc.id
    )
    db_session.flush()

    assert doc2.current_version_id != old_version_id
    db_session.refresh(old_chunks[0])
    assert old_chunks[0].is_active is False  # superseded, not deleted

    new_chunks = db_session.query(Chunk).join(Chunk.source).filter(
        Chunk.source.has(document_version_id=doc2.current_version_id)
    ).all()
    assert all(c.is_active for c in new_chunks)


@requires_db
def test_unsupported_file_type_is_rejected(db_session, fake_embedder):
    with pytest.raises(DomainError):
        ingest_document(db_session, file_bytes=b"binary junk", original_filename="malware.exe")


@requires_db
def test_empty_file_is_rejected(db_session, fake_embedder):
    with pytest.raises(DomainError):
        ingest_document(db_session, file_bytes=b"", original_filename="empty.txt")
