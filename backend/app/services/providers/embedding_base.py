from abc import ABC, abstractmethod


class EmbeddingProvider(ABC):
    """Turns text into vectors for semantic search. Implementations are swappable via
    `EMBEDDING_PROVIDER` — nothing outside this module should know which one is active."""

    name: str
    dimensions: int

    @abstractmethod
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of chunk texts for storage."""

    @abstractmethod
    def embed_query(self, text: str) -> list[float]:
        """Embed a single search query."""
