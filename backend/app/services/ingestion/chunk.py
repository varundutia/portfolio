import re
from dataclasses import dataclass

from app.services.ingestion.extract import PageText

TARGET_CHUNK_CHARS = 1200
OVERLAP_CHARS = 200
_HEADING_RE = re.compile(r"^([A-Z][A-Za-z0-9 &/'\-]{2,60})$")
_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")


@dataclass
class ChunkData:
    content: str
    page_number: int | None
    section_heading: str | None
    chunk_index: int
    token_count: int


def _approx_tokens(text: str) -> int:
    return max(1, len(text) // 4)


def _detect_heading(line: str) -> str | None:
    line = line.strip()
    if not line or len(line) > 80:
        return None
    if line.endswith((".", ",", ";")):
        return None
    if _HEADING_RE.match(line) and (line.isupper() or line.istitle()):
        return line
    return None


def _split_paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def _split_oversized_paragraph(paragraph: str) -> list[str]:
    """Break a single paragraph longer than TARGET_CHUNK_CHARS into sentence-aligned
    pieces, falling back to a hard character split if it contains no sentence boundaries
    at all (e.g. one long run-on line)."""
    if len(paragraph) <= TARGET_CHUNK_CHARS:
        return [paragraph]

    sentences = _SENTENCE_SPLIT_RE.split(paragraph)
    if len(sentences) == 1:
        return [
            paragraph[i : i + TARGET_CHUNK_CHARS] for i in range(0, len(paragraph), TARGET_CHUNK_CHARS)
        ]

    pieces: list[str] = []
    buffer = ""
    for sentence in sentences:
        candidate = f"{buffer} {sentence}".strip() if buffer else sentence
        if len(candidate) > TARGET_CHUNK_CHARS and buffer:
            pieces.append(buffer)
            buffer = sentence
        else:
            buffer = candidate
    if buffer:
        pieces.append(buffer)
    return pieces


def chunk_pages(pages: list[PageText]) -> list[ChunkData]:
    """Paragraph-aware splitter with overlap. A page-number change always forces a flush —
    content from two different PDF pages is never merged into one chunk — so page metadata
    stays accurate. Documents without real page numbers (DOCX/MD/TXT, where every page is
    `None`) merge freely based on size alone, same as before."""
    chunks: list[ChunkData] = []
    current_heading: str | None = None
    buffer = ""
    buffer_page: int | None = None
    chunk_index = 0

    def flush() -> None:
        nonlocal buffer, chunk_index
        text = buffer.strip()
        if text:
            chunks.append(
                ChunkData(
                    content=text,
                    page_number=buffer_page,
                    section_heading=current_heading,
                    chunk_index=chunk_index,
                    token_count=_approx_tokens(text),
                )
            )
            chunk_index += 1
        buffer = ""

    for page in pages:
        if buffer and buffer_page != page.page_number:
            flush()
        buffer_page = page.page_number

        for paragraph in _split_paragraphs(page.text):
            first_line = paragraph.splitlines()[0] if paragraph else ""
            heading = _detect_heading(first_line)
            if heading:
                current_heading = heading

            for piece in _split_oversized_paragraph(paragraph):
                candidate = f"{buffer}\n\n{piece}".strip() if buffer else piece
                if len(candidate) <= TARGET_CHUNK_CHARS:
                    buffer = candidate
                    continue

                overlap_text = buffer[-OVERLAP_CHARS:] if len(buffer) > OVERLAP_CHARS else buffer
                flush()
                buffer_page = page.page_number
                buffer = f"{overlap_text}\n\n{piece}".strip() if overlap_text else piece

    flush()
    return chunks
