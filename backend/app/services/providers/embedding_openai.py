from app.services.providers.embedding_base import EmbeddingProvider


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """text-embedding-3-small. Requires `openai` extra and `OPENAI_API_KEY`."""

    name = "openai"
    dimensions = 1536

    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required for the openai embedding provider.")
        from openai import OpenAI

        self._client = OpenAI(api_key=api_key)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        response = self._client.embeddings.create(model="text-embedding-3-small", input=texts)
        return [item.embedding for item in response.data]

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]
