import pytest

from app.core.config import Settings
from app.services.providers.factory import _build_embedding_provider, _build_llm_provider
from app.services.providers.llm_stub import StubLLMProvider


def _settings(**overrides) -> Settings:
    return Settings(**overrides)


def test_stub_llm_provider_is_default_and_deterministic():
    provider = _build_llm_provider(_settings(llm_provider="stub"))
    assert isinstance(provider, StubLLMProvider)
    first = provider.generate("sys", "question one")
    second = provider.generate("sys", "a completely different question")
    assert first.text == second.text  # stub response never varies with input
    assert first.is_generated is False


def test_anthropic_provider_requires_api_key():
    with pytest.raises(ValueError, match="ANTHROPIC_API_KEY"):
        _build_llm_provider(_settings(llm_provider="anthropic", anthropic_api_key=""))


def test_openai_llm_provider_requires_api_key():
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        _build_llm_provider(_settings(llm_provider="openai", openai_api_key=""))


def test_gemini_provider_requires_api_key():
    with pytest.raises(ValueError, match="GEMINI_API_KEY"):
        _build_llm_provider(_settings(llm_provider="gemini", gemini_api_key=""))


def test_gemini_defaults_to_flash_lite():
    settings = _settings()
    assert settings.gemini_model == "gemini-3.5-flash-lite"
    assert settings.gemini_max_output_tokens == 512


def test_unknown_llm_provider_raises():
    with pytest.raises(ValueError, match="Unknown LLM_PROVIDER"):
        _build_llm_provider(_settings(llm_provider="not-a-real-provider"))


def test_unknown_embedding_provider_raises():
    with pytest.raises(ValueError, match="Unknown EMBEDDING_PROVIDER"):
        _build_embedding_provider(_settings(embedding_provider="not-a-real-provider"))


def test_openai_embedding_provider_requires_api_key():
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        _build_embedding_provider(_settings(embedding_provider="openai", openai_api_key=""))


def test_voyage_embedding_provider_requires_api_key():
    with pytest.raises(ValueError, match="VOYAGE_API_KEY"):
        _build_embedding_provider(_settings(embedding_provider="voyage", voyage_api_key=""))
