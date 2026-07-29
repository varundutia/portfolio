from app.services.providers.embedding_base import EmbeddingProvider


class VoyageEmbeddingProvider(EmbeddingProvider):
    """Voyage AI `voyage-3` embeddings. Requires `voyage` extra and `VOYAGE_API_KEY`."""

    name = "voyage"
    dimensions = 1024

    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise ValueError("VOYAGE_API_KEY is required for the voyage embedding provider.")
        import voyageai

        self._client = voyageai.Client(api_key=api_key)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        result = self._client.embed(texts, model="voyage-3", input_type="document")
        return result.embeddings

    def embed_query(self, text: str) -> list[float]:
        result = self._client.embed([text], model="voyage-3", input_type="query")
        return result.embeddings[0]
