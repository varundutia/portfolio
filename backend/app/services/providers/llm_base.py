from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LLMResponse:
    text: str
    is_generated: bool
    """False for the stub provider — the caller must not present a stub response as a
    grounded, model-generated answer."""


class LLMProvider(ABC):
    name: str

    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str) -> LLMResponse:
        """Produce a grounded answer from a system prompt (instructions + evidence context
        already embedded by the caller) and the user's question."""
