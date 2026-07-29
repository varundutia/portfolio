from datetime import UTC, datetime

from app.models.repository import Repository
from app.services.github.sync import _apply_repo_fields

_SAMPLE_REPO_JSON = {
    "id": 123456,
    "full_name": "varundutia/tokengate",
    "name": "tokengate",
    "description": "AI-powered platform to optimise LLM token usage.",
    "html_url": "https://github.com/varundutia/tokengate",
    "homepage": None,
    "topics": ["django", "rag", "celery"],
    "language": "Python",
    "stargazers_count": 4,
    "forks_count": 1,
    "open_issues_count": 2,
    "default_branch": "main",
    "fork": False,
    "archived": False,
    "created_at": "2025-01-15T10:00:00Z",
    "pushed_at": "2026-06-01T08:30:00Z",
}


def test_apply_repo_fields_maps_all_expected_fields():
    repository = Repository()
    _apply_repo_fields(repository, _SAMPLE_REPO_JSON)

    assert repository.github_id == 123456
    assert repository.full_name == "varundutia/tokengate"
    assert repository.name == "tokengate"
    assert repository.description == "AI-powered platform to optimise LLM token usage."
    assert repository.topics == ["django", "rag", "celery"]
    assert repository.primary_language == "Python"
    assert repository.stars == 4
    assert repository.forks == 1
    assert repository.open_issues == 2
    assert repository.is_fork is False
    assert repository.is_archived is False
    assert repository.repo_created_at == datetime(2025, 1, 15, 10, 0, tzinfo=UTC)
    assert repository.repo_pushed_at == datetime(2026, 6, 1, 8, 30, tzinfo=UTC)


def test_apply_repo_fields_handles_missing_optional_fields():
    minimal = {
        "id": 1,
        "full_name": "varundutia/experiment",
        "name": "experiment",
        "html_url": "https://github.com/varundutia/experiment",
    }
    repository = Repository()
    _apply_repo_fields(repository, minimal)

    assert repository.description is None
    assert repository.homepage is None
    assert repository.topics == []
    assert repository.stars == 0
    assert repository.default_branch == "main"
    assert repository.repo_created_at is None
