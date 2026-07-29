from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DocumentVersionOut(BaseModel):
    id: UUID
    version_number: int
    checksum: str
    page_count: int | None
    extraction_method: str | None
    status: str
    status_detail: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentOut(BaseModel):
    id: UUID
    title: str
    original_filename: str
    file_type: str
    status: str
    status_detail: str | None
    current_version_id: UUID | None
    created_at: datetime
    versions: list[DocumentVersionOut] = []

    model_config = {"from_attributes": True}
