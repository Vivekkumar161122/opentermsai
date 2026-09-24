import json
import logging
import re
from typing import Type, TypeVar, Optional, Any
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from pydantic import BaseModel, ValidationError

from app.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

class GeminiService:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model_name = model or GEMINI_MODEL
        self._client = None
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI Client with model: %s", self.model_name)
            except Exception as e:
                logger.warning("Failed to initialize Google GenAI Client: %s", e)
                self._client = None
        else:
            logger.info("No GEMINI_API_KEY provided. Operating in deterministic simulated agent mode.")

    @property
    def has_client(self) -> bool:
        return self._client is not None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1.5, min=2, max=10),
        reraise=True
    )
    def generate_structured_output(
        self,
        prompt: str,
        system_instruction: str,
        response_model: Type[T]
    ) -> T:
        """
        Executes Gemini API call with structured JSON enforcement and tenacity retry.
        Parses and validates against the provided Pydantic model.
        """
        if not self.has_client:
            raise RuntimeError("Gemini Client not initialized with GEMINI_API_KEY")

        from google.genai import types

        logger.info("Calling Gemini model %s with structured schema %s", self.model_name, response_model.__name__)

        # Request json response
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            temperature=0.1,  # Low temperature for strict factual contract grounding
        )

        response = self._client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )

        raw_text = response.text or ""
        logger.debug("Raw Gemini Response: %s", raw_text[:300])

        return self._clean_and_parse_json(raw_text, response_model)

    def _clean_and_parse_json(self, raw_text: str, response_model: Type[T]) -> T:
        """Cleans markdown JSON blocks if present and validates against Pydantic schema."""
        cleaned = raw_text.strip()
        # Strip markdown fences if Gemini wrapped it despite mime type
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            data = json.loads(cleaned)
            return response_model.model_validate(data)
        except (json.JSONDecodeError, ValidationError) as e:
            logger.warning("First pass JSON/Schema parse failed: %s. Attempting regex extract.", e)
            # Try to locate JSON object {...}
            match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                return response_model.model_validate(data)
            raise ValueError(f"Failed to parse LLM response into valid {response_model.__name__}: {e}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1.5, min=2, max=10),
        reraise=True
    )
    def generate_text(self, prompt: str, system_instruction: str) -> str:
        """Generate conversational text response with retry logic."""
        if not self.has_client:
            raise RuntimeError("Gemini Client not initialized with GEMINI_API_KEY")

        from google.genai import types
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2,
        )
        response = self._client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )
        return response.text or ""

gemini_service = GeminiService()
