import enum


class DocumentStatus(enum.StrEnum):
    PENDING = "pending"
    EXTRACTING = "extracting"
    CHUNKING = "chunking"
    EMBEDDING = "embedding"
    READY = "ready"
    FAILED = "failed"


class SourceType(enum.StrEnum):
    DOCUMENT = "document"
    REPO_README = "repo_readme"
    REPO_FILE = "repo_file"


class RepositoryCategory(enum.StrEnum):
    FLAGSHIP = "flagship"
    SUPPORTING = "supporting"
    EXPERIMENT = "experiment"
    ACADEMIC = "academic"
    ARCHIVED = "archived"
    HIDDEN = "hidden"


class RepositoryFileKind(enum.StrEnum):
    README = "readme"
    DOC = "doc"
    ADR = "adr"
