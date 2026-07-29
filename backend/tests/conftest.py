import os

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

import app.models  # noqa: F401  -- registers all models on Base.metadata
from app.db.base import Base
from app.services.providers.embedding_base import EmbeddingProvider

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio_test"
)


def _db_available() -> bool:
    try:
        engine = create_engine(TEST_DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


requires_db = pytest.mark.skipif(
    not _db_available(),
    reason="No Postgres+pgvector test database available (set TEST_DATABASE_URL). "
    "Run `docker compose up -d db` locally to enable these tests.",
)


@pytest.fixture()
def db_session():
    engine = create_engine(TEST_DATABASE_URL)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    Base.metadata.create_all(engine)
    _install_search_vector_trigger(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        Base.metadata.drop_all(engine)


def _install_search_vector_trigger(engine) -> None:
    with engine.connect() as conn:
        conn.execute(
            text(
                """
                CREATE OR REPLACE FUNCTION chunks_search_vector_update() RETURNS trigger AS $$
                BEGIN
                  NEW.search_vector := to_tsvector('english', coalesce(NEW.content, ''));
                  RETURN NEW;
                END
                $$ LANGUAGE plpgsql;
                """
            )
        )
        conn.execute(
            text(
                "DROP TRIGGER IF EXISTS chunks_search_vector_trigger ON chunks; "
                "CREATE TRIGGER chunks_search_vector_trigger BEFORE INSERT OR UPDATE OF content "
                "ON chunks FOR EACH ROW EXECUTE FUNCTION chunks_search_vector_update();"
            )
        )
        conn.commit()


class FakeEmbeddingProvider(EmbeddingProvider):
    """Deterministic, dependency-free embedding provider for tests — avoids network calls
    or downloading real model weights while still producing distinguishable vectors."""

    name = "fake"
    dimensions = 384

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self.embed_query(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        import hashlib

        digest = hashlib.sha256(text.encode("utf-8")).digest()
        raw = [(digest[i % len(digest)] / 255.0) - 0.5 for i in range(self.dimensions)]
        norm = sum(v * v for v in raw) ** 0.5 or 1.0
        return [v / norm for v in raw]


@pytest.fixture()
def fake_embedder(monkeypatch):
    provider = FakeEmbeddingProvider()
    monkeypatch.setattr(
        "app.services.providers.factory.get_embedding_provider", lambda: provider
    )
    monkeypatch.setattr("app.services.retrieval.get_embedding_provider", lambda: provider)
    monkeypatch.setattr("app.services.ingestion.pipeline.get_embedding_provider", lambda: provider)
    monkeypatch.setattr("app.services.github.sync.get_embedding_provider", lambda: provider)
    return provider
