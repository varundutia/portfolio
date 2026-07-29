from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All runtime configuration is env-driven; nothing personal or provider-specific is
    hardcoded here so swapping infrastructure never requires a code change."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"

    github_username: str = ""
    github_token: str = ""

    embedding_provider: str = "fastembed"
    embedding_dimensions: int = 384
    openai_api_key: str = ""
    voyage_api_key: str = ""

    llm_provider: str = "stub"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"
    openai_llm_model: str = "gpt-4o-mini"

    admin_password_hash: str = ""
    jwt_secret: str = "change-me-to-a-long-random-string"
    jwt_expire_minutes: int = 720

    frontend_origin: str = "http://localhost:3000"

    storage_dir: str = "./storage"

    retrieval_top_k: int = 8
    retrieval_min_score: float = 0.15

    @property
    def storage_path(self) -> Path:
        path = Path(self.storage_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()
