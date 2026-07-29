from pydantic import BaseModel


class SearchResultOut(BaseModel):
    chunk_id: str
    content: str
    score: float
    page_number: int | None
    section_heading: str | None
    source_type: str
    source_title: str
    source_url: str | None


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResultOut]
