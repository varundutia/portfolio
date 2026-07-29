from app.services.providers.llm_base import LLMProvider, LLMResponse


class AnthropicProvider(LLMProvider):
    """Requires `anthropic` extra and `ANTHROPIC_API_KEY`."""

    name = "anthropic"

    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY is required for the anthropic LLM provider.")
        import anthropic

        self._client = anthropic.Anthropic(api_key=api_key)
        self._model = model

    def generate(self, system_prompt: str, user_prompt: str) -> LLMResponse:
        message = self._client.messages.create(
            model=self._model,
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(block.text for block in message.content if block.type == "text")
        return LLMResponse(text=text, is_generated=True)
