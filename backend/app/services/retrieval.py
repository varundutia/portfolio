from dataclasses import dataclass

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.config import get_settings
from app.models.chunk import Chunk
from app.models.enums import SourceType
from app.models.source import Source
from app.services.providers.factory import get_embedding_provider

VECTOR_WEIGHT = 0.6
KEYWORD_WEIGHT = 0.4
_CANDIDATE_MULTIPLIER = 4


@dataclass
class RetrievedChunk:
    chunk_id: str
    content: str
    score: float
    page_number: int | None
    section_heading: str | None
    source_type: str
    source_title: str
    source_url: str | None


def _looks_like_keyword_query(query: str) -> bool:
    """Heuristic query classifier: short, technology-name-shaped queries (e.g. 'NestJS',
    'PostgreSQL') benefit from weighting exact keyword matches higher than pure semantic
    similarity; longer natural-language questions stay vector-dominant."""
    words = query.strip().split()
    return len(words) <= 3


def _source_citation(source: Source) -> tuple[str, str | None]:
    if source.source_type == SourceType.DOCUMENT and source.document_version is not None:
        doc = source.document_version.document
        return doc.title, None
    if source.repository is not None:
        return source.title, source.url
    return source.title, source.url


def hybrid_search(
    db: Session,
    query: str,
    *,
    top_k: int | None = None,
    min_score: float | None = None,
    source_types: list[SourceType] | None = None,
) -> list[RetrievedChunk]:
    settings = get_settings()
    top_k = top_k or settings.retrieval_top_k
    min_score = min_score if min_score is not None else settings.retrieval_min_score
    candidate_limit = top_k * _CANDIDATE_MULTIPLIER

    keyword_leaning = _looks_like_keyword_query(query)
    vector_weight = 0.4 if keyword_leaning else VECTOR_WEIGHT
    keyword_weight = 0.6 if keyword_leaning else KEYWORD_WEIGHT

    embedder = get_embedding_provider()
    query_vector = embedder.embed_query(query)

    base_query = db.query(Chunk).options(
        joinedload(Chunk.source).joinedload(Source.document_version),
        joinedload(Chunk.source).joinedload(Source.repository),
        joinedload(Chunk.source).joinedload(Source.repository_file),
    ).filter(Chunk.is_active.is_(True))
    if source_types:
        base_query = base_query.join(Source).filter(Source.source_type.in_(source_types))

    distance_expr = Chunk.embedding.cosine_distance(query_vector)
    vector_rows = (
        base_query.add_columns(distance_expr.label("distance"))
        .order_by(distance_expr)
        .limit(candidate_limit)
        .all()
    )

    tsquery = func.plainto_tsquery("english", query)
    rank_expr = func.ts_rank(Chunk.search_vector, tsquery)
    keyword_rows = (
        base_query.add_columns(rank_expr.label("rank"))
        .filter(Chunk.search_vector.op("@@")(tsquery))
        .order_by(rank_expr.desc())
        .limit(candidate_limit)
        .all()
    )

    scores: dict[str, float] = {}
    chunks_by_id: dict[str, Chunk] = {}

    for chunk, distance in vector_rows:
        similarity = max(0.0, 1.0 - float(distance))
        chunk_id = str(chunk.id)
        chunks_by_id[chunk_id] = chunk
        scores[chunk_id] = scores.get(chunk_id, 0.0) + vector_weight * similarity

    max_rank = max((float(rank) for _, rank in keyword_rows), default=0.0)
    if max_rank > 0:
        for chunk, rank in keyword_rows:
            chunk_id = str(chunk.id)
            chunks_by_id[chunk_id] = chunk
            normalized = float(rank) / max_rank
            scores[chunk_id] = scores.get(chunk_id, 0.0) + keyword_weight * normalized

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)

    results: list[RetrievedChunk] = []
    for chunk_id, score in ranked:
        if score < min_score:
            continue
        chunk = chunks_by_id[chunk_id]
        title, url = _source_citation(chunk.source)
        results.append(
            RetrievedChunk(
                chunk_id=chunk_id,
                content=chunk.content,
                score=round(score, 4),
                page_number=chunk.page_number,
                section_heading=chunk.section_heading,
                source_type=chunk.source.source_type,
                source_title=title,
                source_url=url,
            )
        )
        if len(results) >= top_k:
            break

    return results
