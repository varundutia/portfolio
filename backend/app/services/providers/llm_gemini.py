from app.services.providers.llm_base import LLMProvider, LLMResponse


class GeminiProvider(LLMProvider):
    """Requires `google-genai` and `GEMINI_API_KEY`."""

    name = "gemini"

    def __init__(self, api_key: str, model: str, max_output_tokens: int) -> None:
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required for the gemini LLM provider.")
        from google import genai

        self._client = genai.Client(api_key=api_key)
        self._max_output_tokens = max_output_tokens
        self._model = model

    def generate(self, system_prompt: str, user_prompt: str) -> LLMResponse:
        from google.genai import types

        response = self._client.models.generate_content(
            model=self._model,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                max_output_tokens=self._max_output_tokens,
            ),
        )
        return LLMResponse(text=response.text or "", is_generated=True)
