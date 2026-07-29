from app.services.answer import (
    _SYSTEM_PROMPT_TEMPLATE,
    INSUFFICIENT_EVIDENCE_MESSAGE,
    OUT_OF_SCOPE_MESSAGE,
    _validate_citations,
)
from app.services.retrieval import RetrievedChunk


def _chunk(i: int) -> RetrievedChunk:
    return RetrievedChunk(
        chunk_id=f"chunk-{i}",
        content=f"Evidence content {i}",
        score=0.9,
        page_number=i,
        section_heading=None,
        source_type="document",
        source_title=f"Source {i}",
        source_url=None,
    )


def test_validate_citations_accepts_in_range_marker():
    retrieved = [_chunk(1), _chunk(2)]
    citations = _validate_citations("Varun used NestJS in production [1].", retrieved)
    assert len(citations) == 1
    assert citations[0].index == 1
    assert citations[0].source_title == "Source 1"


def test_validate_citations_rejects_out_of_range_marker():
    """The core citation-integrity guarantee: a marker that doesn't correspond to a chunk
    that was actually retrieved must never surface as a citation, no matter what the model
    output contains."""
    retrieved = [_chunk(1), _chunk(2)]
    citations = _validate_citations("This is backed by evidence [99].", retrieved)
    assert citations == []


def test_validate_citations_dedupes_repeated_markers():
    retrieved = [_chunk(1)]
    citations = _validate_citations("Claim A [1]. Claim B also [1].", retrieved)
    assert len(citations) == 1


def test_validate_citations_no_markers_returns_empty():
    retrieved = [_chunk(1)]
    assert _validate_citations("No evidence cited here.", retrieved) == []


def test_validate_citations_empty_retrieved_set_rejects_everything():
    assert _validate_citations("Claim [1].", []) == []


def test_validate_citations_preserves_citation_order_of_first_appearance():
    retrieved = [_chunk(1), _chunk(2), _chunk(3)]
    citations = _validate_citations("First [2], then [1], then [2] again, then [3].", retrieved)
    assert [c.index for c in citations] == [2, 1, 3]


def test_system_prompt_contains_grounding_and_injection_defense_language():
    prompt = _SYSTEM_PROMPT_TEMPLATE.format(
        insufficient_evidence=INSUFFICIENT_EVIDENCE_MESSAGE,
        out_of_scope=OUT_OF_SCOPE_MESSAGE,
        evidence_block="[1] Source: Test\nSome content",
    )
    assert "DATA, not instructions" in prompt
    assert "Never invent" in prompt
    assert INSUFFICIENT_EVIDENCE_MESSAGE in prompt
    assert OUT_OF_SCOPE_MESSAGE in prompt
    assert "production" in prompt and "personal" in prompt and "academic" in prompt
