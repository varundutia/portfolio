from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)


class CitationOut(BaseModel):
    index: int
    source_title: str
    source_url: str | None
    page_number: int | None
    section_heading: str | None
    source_type: str


class EvidenceOut(BaseModel):
    content: str
    source_title: str
    source_url: str | None
    page_number: int | None
    section_heading: str | None
    source_type: str
    score: float


class AskResponse(BaseModel):
    answer: str
    is_generated: bool
    was_refused: bool
    citations: list[CitationOut]
    evidence: list[EvidenceOut]
