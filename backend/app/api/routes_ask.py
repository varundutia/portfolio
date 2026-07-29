from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.ask import AskRequest, AskResponse, CitationOut, EvidenceOut
from app.services.answer import answer_question

router = APIRouter(prefix="/ask", tags=["ask"])


@router.post("", response_model=AskResponse)
def ask(payload: AskRequest, db: Session = Depends(get_db)) -> AskResponse:
    result = answer_question(db, payload.question)
    db.commit()
    return AskResponse(
        answer=result.answer_text,
        is_generated=result.is_generated,
        was_refused=result.was_refused,
        citations=[CitationOut(**c.__dict__) for c in result.citations],
        evidence=[
            EvidenceOut(
                content=e.content,
                source_title=e.source_title,
                source_url=e.source_url,
                page_number=e.page_number,
                section_heading=e.section_heading,
                source_type=e.source_type,
                score=e.score,
            )
            for e in result.retrieved
        ],
    )
