from app.services.ingestion.chunk import TARGET_CHUNK_CHARS, chunk_pages
from app.services.ingestion.extract import PageText, split_markdown_sections


def test_chunk_pages_preserves_page_numbers():
    pages = [
        PageText(page_number=1, text="First page content about backend systems."),
        PageText(page_number=2, text="Second page content about authentication."),
    ]
    chunks = chunk_pages(pages)
    assert [c.page_number for c in chunks] == [1, 2]


def test_chunk_pages_preserves_section_headings():
    pages = [
        PageText(page_number=None, text="Professional Experience\n\nBuilt a payment microservice.")
    ]
    chunks = chunk_pages(pages)
    assert any(c.section_heading == "Professional Experience" for c in chunks)


def test_chunk_pages_splits_long_content_with_overlap():
    long_paragraph = "Sentence about distributed systems. " * 100  # well over TARGET_CHUNK_CHARS
    pages = [PageText(page_number=1, text=long_paragraph)]
    chunks = chunk_pages(pages)
    assert len(chunks) > 1
    assert all(len(c.content) <= TARGET_CHUNK_CHARS + 400 for c in chunks)
    # consecutive chunk indices, monotonically increasing
    assert [c.chunk_index for c in chunks] == list(range(len(chunks)))


def test_chunk_pages_empty_input_returns_no_chunks():
    assert chunk_pages([]) == []
    assert chunk_pages([PageText(page_number=1, text="   ")]) == []


def test_split_markdown_sections_extracts_headings():
    raw = (
        "# Architecture\n\nUses NestJS and PostgreSQL.\n\n"
        "## Approval Workflow\n\nRequests go through review."
    )
    pages = split_markdown_sections(raw)
    headings_seen = [p.text.split(":")[0] for p in pages]
    assert "Architecture" in headings_seen
    assert "Approval Workflow" in headings_seen
