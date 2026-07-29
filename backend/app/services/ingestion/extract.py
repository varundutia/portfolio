import re
from dataclasses import dataclass

from app.core.errors import DomainError

SUPPORTED_EXTENSIONS = {"pdf", "docx", "md", "txt"}


@dataclass
class PageText:
    page_number: int | None
    text: str


@dataclass
class ExtractionResult:
    pages: list[PageText]
    method: str
    page_count: int | None

    @property
    def full_text(self) -> str:
        return "\n\n".join(p.text for p in self.pages)

    @property
    def is_empty(self) -> bool:
        return not self.full_text.strip()


def extract_text(file_path: str, file_type: str) -> ExtractionResult:
    file_type = file_type.lower().lstrip(".")
    if file_type not in SUPPORTED_EXTENSIONS:
        raise DomainError(f"Unsupported file type: .{file_type}", status_code=422)

    if file_type == "pdf":
        result = _extract_pdf(file_path)
        if result.is_empty:
            ocr_result = _try_ocr_pdf(file_path)
            if ocr_result is not None:
                return ocr_result
        return result
    if file_type == "docx":
        return _extract_docx(file_path)
    return _extract_plain_text(file_path)


def _extract_pdf(file_path: str) -> ExtractionResult:
    from pypdf import PdfReader

    reader = PdfReader(file_path)
    pages = [
        PageText(page_number=i + 1, text=page.extract_text() or "")
        for i, page in enumerate(reader.pages)
    ]
    return ExtractionResult(pages=pages, method="pypdf", page_count=len(pages))


def _try_ocr_pdf(file_path: str) -> ExtractionResult | None:
    """Only invoked when normal text extraction yields nothing, i.e. a scanned PDF. Degrades
    gracefully (returns None) if the optional OCR dependencies aren't installed, rather than
    crashing ingestion — the caller records that OCR was unavailable."""
    try:
        import pytesseract
        from pdf2image import convert_from_path
    except ImportError:
        return None

    try:
        images = convert_from_path(file_path)
    except Exception:
        return None

    pages = [
        PageText(page_number=i + 1, text=pytesseract.image_to_string(image))
        for i, image in enumerate(images)
    ]
    return ExtractionResult(pages=pages, method="ocr", page_count=len(pages))


def _extract_docx(file_path: str) -> ExtractionResult:
    import docx

    document = docx.Document(file_path)
    lines: list[str] = []
    heading: str | None = None
    blocks: list[PageText] = []
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
        style = (paragraph.style.name or "") if paragraph.style else ""
        if style.lower().startswith("heading"):
            heading = text
        blocks.append(PageText(page_number=None, text=f"{heading + ': ' if heading else ''}{text}"))
        lines.append(text)
    return ExtractionResult(pages=blocks, method="python-docx", page_count=None)


def split_markdown_sections(raw: str) -> list[PageText]:
    """Split on markdown-style headings so section context (e.g. 'Approval Workflow')
    survives into chunk metadata. Shared by plain-text/markdown document extraction and
    GitHub README/doc indexing so both paths produce section-labeled citations."""
    sections = re.split(r"(?m)^(#{1,6}\s+.+)$", raw)
    pages: list[PageText] = []
    if len(sections) == 1:
        pages.append(PageText(page_number=None, text=raw))
    else:
        current_heading = None
        for part in sections:
            if not part.strip():
                continue
            if re.match(r"^#{1,6}\s+", part):
                current_heading = part.lstrip("#").strip()
                continue
            text = f"{current_heading}: {part.strip()}" if current_heading else part.strip()
            pages.append(PageText(page_number=None, text=text))
    return pages


def _extract_plain_text(file_path: str) -> ExtractionResult:
    with open(file_path, encoding="utf-8", errors="replace") as f:
        raw = f.read()
    pages = split_markdown_sections(raw)
    return ExtractionResult(pages=pages, method="plain-text", page_count=None)
