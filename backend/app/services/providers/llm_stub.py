from app.services.providers.llm_base import LLMProvider, LLMResponse

NOT_CONFIGURED_MESSAGE = (
    "Generated answers are not enabled on this deployment yet — no LLM provider is "
    "configured. The evidence retrieved for your question is shown below with full "
    "citations; once a provider is configured (ANTHROPIC_API_KEY or OPENAI_API_KEY plus "
    "LLM_PROVIDER), this will become a grounded, generated answer instead."
)


class StubLLMProvider(LLMProvider):
    """Default provider. Never fabricates an answer — makes the unconfigured state
    honest and visible instead of silently returning something that looks generated."""

    name = "stub"

    def generate(self, system_prompt: str, user_prompt: str) -> LLMResponse:
        return LLMResponse(text=NOT_CONFIGURED_MESSAGE, is_generated=False)
