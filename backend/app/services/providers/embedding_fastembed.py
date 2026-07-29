from functools import cached_property

from app.services.providers.embedding_base import EmbeddingProvider

_MODEL_NAME = "BAAI/bge-small-en-v1.5"


class FastEmbedProvider(EmbeddingProvider):
    """Local, CPU-only embeddings via ONNX (no API key, no external network call at
    inference time). Default provider so semantic search works out of the box."""

    name = "fastembed"
    dimensions = 384

    @cached_property
    def _model(self):  # type: ignore[no-untyped-def]
        from fastembed import TextEmbedding

        return TextEmbedding(model_name=_MODEL_NAME)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        return [vec.tolist() for vec in self._model.embed(texts)]

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]
