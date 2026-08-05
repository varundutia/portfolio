from functools import lru_cache

from app.core.config import Settings, get_settings
from app.services.providers.embedding_base import EmbeddingProvider
from app.services.providers.llm_base import LLMProvider
from app.services.providers.llm_stub import StubLLMProvider


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    settings = get_settings()
    return _build_embedding_provider(settings)


def _build_embedding_provider(settings: Settings) -> EmbeddingProvider:
    provider = settings.embedding_provider.lower()
    if provider == "fastembed":
        from app.services.providers.embedding_fastembed import FastEmbedProvider

        return FastEmbedProvider()
    if provider == "openai":
        from app.services.providers.embedding_openai import OpenAIEmbeddingProvider

        return OpenAIEmbeddingProvider(api_key=settings.openai_api_key)
    if provider == "voyage":
        from app.services.providers.embedding_voyage import VoyageEmbeddingProvider

        return VoyageEmbeddingProvider(api_key=settings.voyage_api_key)
    raise ValueError(f"Unknown EMBEDDING_PROVIDER: {settings.embedding_provider}")


@lru_cache
def get_llm_provider() -> LLMProvider:
    settings = get_settings()
    return _build_llm_provider(settings)


def _build_llm_provider(settings: Settings) -> LLMProvider:
    provider = settings.llm_provider.lower()
    if provider == "stub":
        return StubLLMProvider()
    if provider == "anthropic":
        from app.services.providers.llm_anthropic import AnthropicProvider

        return AnthropicProvider(api_key=settings.anthropic_api_key, model=settings.anthropic_model)
    if provider == "openai":
        from app.services.providers.llm_openai import OpenAILLMProvider

        return OpenAILLMProvider(api_key=settings.openai_api_key, model=settings.openai_llm_model)
    if provider == "gemini":
        from app.services.providers.llm_gemini import GeminiProvider

        return GeminiProvider(
            api_key=settings.gemini_api_key,
            model=settings.gemini_model,
            max_output_tokens=settings.gemini_max_output_tokens,
        )
    raise ValueError(f"Unknown LLM_PROVIDER: {settings.llm_provider}")
