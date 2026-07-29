import hashlib
from dataclasses import dataclass, field
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.errors import DomainError
from app.models.enums import RepositoryFileKind, SourceType
from app.models.repository import Repository, RepositoryFile
from app.models.source import Source
from app.services.github.client import GitHubClient
from app.services.ingestion.chunk import chunk_pages
from app.services.ingestion.extract import split_markdown_sections
from app.services.providers.factory import get_embedding_provider

_DOCS_DIR_CANDIDATES = ["docs"]
_MAX_DOCS_FILES = 10


def _checksum(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


@dataclass
class SyncResult:
    repositories_synced: int = 0
    documentation_files_indexed: int = 0
    documentation_files_unchanged: int = 0
    errors: list[str] = field(default_factory=list)


def sync_github(db: Session, username: str, token: str) -> SyncResult:
    if not username:
        raise DomainError("GITHUB_USERNAME is not configured.", status_code=400)

    client = GitHubClient(token)
    result = SyncResult()
    try:
        repos_json = client.list_repos(username)
        for repo_json in repos_json:
            try:
                repository = _upsert_repository(db, client, repo_json)
                db.flush()
                result.repositories_synced += 1
                if repository.is_selected_for_rag:
                    indexed, unchanged = _sync_repository_docs(db, client, repository)
                    result.documentation_files_indexed += indexed
                    result.documentation_files_unchanged += unchanged
            except Exception as exc:  # noqa: BLE001 -- one repo failing shouldn't abort the sync
                result.errors.append(f"{repo_json.get('full_name', '?')}: {exc}")
        db.flush()
    finally:
        client.close()
    return result


def _apply_repo_fields(repository: Repository, repo_json: dict) -> None:
    """Pure GitHub-API-JSON -> `Repository` field mapping, deliberately separated from the
    network-calling parts of sync so it can be unit tested without a live client or DB."""
    repository.github_id = repo_json["id"]
    repository.full_name = repo_json["full_name"]
    repository.name = repo_json["name"]
    repository.description = repo_json.get("description")
    repository.url = repo_json["html_url"]
    repository.homepage = repo_json.get("homepage") or None
    repository.topics = repo_json.get("topics") or []
    repository.primary_language = repo_json.get("language")
    repository.stars = repo_json.get("stargazers_count", 0)
    repository.forks = repo_json.get("forks_count", 0)
    repository.open_issues = repo_json.get("open_issues_count", 0)
    repository.default_branch = repo_json.get("default_branch", "main")
    repository.is_fork = repo_json.get("fork", False)
    repository.is_archived = repo_json.get("archived", False)
    repository.repo_created_at = _parse_dt(repo_json.get("created_at"))
    repository.repo_pushed_at = _parse_dt(repo_json.get("pushed_at"))


def _upsert_repository(db: Session, client: GitHubClient, repo_json: dict) -> Repository:
    full_name = repo_json["full_name"]
    repository = db.query(Repository).filter(Repository.full_name == full_name).first()
    if repository is None:
        repository = Repository(github_id=repo_json["id"], full_name=full_name)
        db.add(repository)

    _apply_repo_fields(repository, repo_json)
    repository.languages = client.get_languages(full_name)
    repository.last_synced_at = datetime.utcnow()

    release = client.get_latest_release(full_name)
    if release:
        repository.latest_release_tag = release.get("tag_name")
        repository.latest_release_published_at = _parse_dt(release.get("published_at"))

    commit_date = client.get_latest_commit_date(full_name, repository.default_branch)
    repository.last_meaningful_commit_at = _parse_dt(commit_date)

    return repository


def _index_file(
    db: Session, repository: Repository, *, path: str, kind: RepositoryFileKind, content: str, github_url: str
) -> bool:
    """Returns True if the file was (re-)indexed, False if content is unchanged and it was skipped."""
    checksum = _checksum(content)
    existing = (
        db.query(RepositoryFile)
        .filter(RepositoryFile.repository_id == repository.id, RepositoryFile.path == path)
        .first()
    )
    if existing is not None and existing.checksum == checksum:
        return False

    if existing is not None:
        old_source = (
            db.query(Source).filter(Source.repository_file_id == existing.id).first()
        )
        if old_source is not None:
            db.delete(old_source)
        existing.content = content
        existing.checksum = checksum
        existing.github_url = github_url
        existing.last_synced_at = datetime.utcnow()
        repo_file = existing
    else:
        repo_file = RepositoryFile(
            repository_id=repository.id,
            path=path,
            kind=kind,
            content=content,
            checksum=checksum,
            github_url=github_url,
        )
        db.add(repo_file)
    db.flush()

    source_type = SourceType.REPO_README if kind == RepositoryFileKind.README else SourceType.REPO_FILE
    source = Source(
        source_type=source_type,
        title=f"{repository.full_name} — {path}",
        url=github_url,
        repository_id=repository.id,
        repository_file_id=repo_file.id,
    )
    db.add(source)
    db.flush()

    pages = split_markdown_sections(content)
    chunk_data = chunk_pages(pages)
    if not chunk_data:
        return True

    embedder = get_embedding_provider()
    vectors = embedder.embed_documents([c.content for c in chunk_data])
    from app.models.chunk import Chunk

    for data, vector in zip(chunk_data, vectors, strict=True):
        db.add(
            Chunk(
                source_id=source.id,
                chunk_index=data.chunk_index,
                content=data.content,
                page_number=data.page_number,
                section_heading=data.section_heading,
                token_count=data.token_count,
                embedding=vector,
            )
        )
    if kind == RepositoryFileKind.README:
        repository.readme_checksum = checksum
    return True


def _sync_repository_docs(db: Session, client: GitHubClient, repository: Repository) -> tuple[int, int]:
    indexed = 0
    unchanged = 0

    readme = client.get_readme(repository.full_name)
    if readme:
        changed = _index_file(
            db,
            repository,
            path=readme["path"],
            kind=RepositoryFileKind.README,
            content=readme["content"],
            github_url=readme["html_url"],
        )
        indexed += int(changed)
        unchanged += int(not changed)

    for docs_dir in _DOCS_DIR_CANDIDATES:
        entries = client.list_directory(repository.full_name, docs_dir) or []
        markdown_entries = [e for e in entries if e.get("type") == "file" and e["name"].endswith(".md")]
        for entry in markdown_entries[:_MAX_DOCS_FILES]:
            file_data = client.get_repo_file(repository.full_name, entry["path"])
            if not file_data:
                continue
            kind = RepositoryFileKind.ADR if "adr" in entry["path"].lower() else RepositoryFileKind.DOC
            changed = _index_file(
                db,
                repository,
                path=file_data["path"],
                kind=kind,
                content=file_data["content"],
                github_url=file_data["html_url"],
            )
            indexed += int(changed)
            unchanged += int(not changed)

    return indexed, unchanged
