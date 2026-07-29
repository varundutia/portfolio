from app.services.providers.llm_base import LLMProvider, LLMResponse


class OpenAILLMProvider(LLMProvider):
    """Requires `openai` extra and `OPENAI_API_KEY`."""

    name = "openai"

    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required for the openai LLM provider.")
        from openai import OpenAI

        self._client = OpenAI(api_key=api_key)
        self._model = model

    def generate(self, system_prompt: str, user_prompt: str) -> LLMResponse:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        text = response.choices[0].message.content or ""
        return LLMResponse(text=text, is_generated=True)
