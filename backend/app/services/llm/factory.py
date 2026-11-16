import os
import logging
from typing import Optional, List, Dict
from dotenv import load_dotenv

load_dotenv()

from app.services.llm.base import BaseLLMProvider
from app.services.llm.openrouter import OpenRouterProvider
from app.services.llm.groq import GroqProvider

logger = logging.getLogger("llm_factory")

def _clean_env(key: str, default: str = "") -> str:
    val = os.getenv(key, default)
    return (val or "").strip()

class LLMProviderFactory:
    SUPPORTED_PROVIDERS = {
        "groq": {
            "name": "Groq Cloud",
            "env_key": "GROQ_API_KEY",
            "default_model": "openai/gpt-oss-120b",
            "description": "Groq Cloud (openai/gpt-oss-120b)"
        },
        "openrouter": {
            "name": "OpenRouter",
            "env_key": "OPENROUTER_API_KEY",
            "default_model": "openrouter/free",
            "description": "OpenRouter Free Routing (openrouter/free)"
        }
    }

    @classmethod
    def get_provider(cls, provider_name: Optional[str] = None) -> BaseLLMProvider:
        """
        Instantiates the requested LLM provider using API keys in .env.
        Raises an explicit error if the required API key is missing.
        """
        chosen = (provider_name or "groq").lower().strip()

        if chosen not in cls.SUPPORTED_PROVIDERS:
            raise ValueError(
                f"Unsupported LLM provider '{chosen}'. Supported providers are: "
                f"{', '.join(cls.SUPPORTED_PROVIDERS.keys())}"
            )

        spec = cls.SUPPORTED_PROVIDERS[chosen]
        api_key = _clean_env(spec["env_key"])

        if not api_key:
            raise ValueError(
                f"Cannot use '{spec['name']}' because {spec['env_key']} is not set in .env."
            )

        model = spec["default_model"]

        if chosen == "groq":
            return GroqProvider(api_key=api_key, model=model)
        elif chosen == "openrouter":
            return OpenRouterProvider(api_key=api_key, model=model)

    @classmethod
    def get_providers_status(cls) -> Dict:
        """
        Returns which providers are configured with valid API keys in .env.
        """
        default_p = "groq"
        providers_list = []

        for p_id, spec in cls.SUPPORTED_PROVIDERS.items():
            key = _clean_env(spec["env_key"])
            is_configured = bool(key)
            model = spec["default_model"]

            providers_list.append({
                "id": p_id,
                "name": spec["name"],
                "description": spec["description"],
                "default_model": model,
                "configured": is_configured,
                "is_default": (p_id == default_p)
            })

        return {
            "default_provider": default_p,
            "providers": providers_list
        }
