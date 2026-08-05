from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
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
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash-lite"
    gemini_max_output_tokens: int = 512

    frontend_origin: str = "http://localhost:3000"
    frontend_origins: str = (
        "https://varundutia.live,"
        "https://www.varundutia.live,"
        "https://varundutia-portfolio.vercel.app"
    )
    frontend_origin_regex: str = r"https://.*\.vercel\.app"

    storage_dir: str = "./storage"

    retrieval_top_k: int = 8
    retrieval_min_score: float = 0.15

    @field_validator("database_url")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        return value

    @property
    def storage_path(self) -> Path:
        path = Path(self.storage_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def cors_origins(self) -> list[str]:
        origins = [self.frontend_origin]
        origins.extend(origin.strip() for origin in self.frontend_origins.split(",") if origin.strip())
        return list(dict.fromkeys(origins))


@lru_cache
def get_settings() -> Settings:
    return Settings()
