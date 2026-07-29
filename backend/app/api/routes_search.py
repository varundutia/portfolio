from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.search import SearchResponse, SearchResultOut
from app.services.retrieval import hybrid_search

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def semantic_search(
    q: str = Query(min_length=1, max_length=500), db: Session = Depends(get_db)
) -> SearchResponse:
    results = hybrid_search(db, q)
    return SearchResponse(
        query=q,
        results=[SearchResultOut(**r.__dict__) for r in results],
    )
