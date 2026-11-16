import json
import httpx
from typing import Dict, Any
from app.services.llm.base import BaseLLMProvider
from app.services.llm.prompts import SYSTEM_ANALYSIS_PROMPT

class OpenRouterProvider(BaseLLMProvider):
    def __init__(self, api_key: str, model: str = "openrouter/free"):
        api_key = (api_key or "").strip()
        model = (model or "").strip() or "openrouter/free"
        super().__init__(api_key=api_key, model=model)
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"

    async def extract_clauses_and_summary(self, contract_text: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Rental Agreement Risk Analyzer",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_ANALYSIS_PROMPT},
                {"role": "user", "content": f"Analyze this rental agreement and return JSON:\n\n{contract_text}"}
            ],
            "response_format": {"type": "json_object"},
            "max_tokens": 8192,
            "temperature": 0.1
        }
        
        last_error = None
        # Attempt up to 3 times to allow openrouter/free to rotate if it hits a non-chat/safety model
        max_attempts = 3 if "free" in self.model else 1
        
        async with httpx.AsyncClient(timeout=90.0) as client:
            for attempt in range(max_attempts):
                resp = await client.post(self.api_url, headers=headers, json=payload)
                # Some free providers routed via openrouter don't support response_format json_object
                if resp.status_code == 400 and ("response_format" in resp.text or "json" in resp.text.lower()):
                    payload.pop("response_format", None)
                    resp = await client.post(self.api_url, headers=headers, json=payload)

                if resp.status_code != 200:
                    last_error = RuntimeError(f"OpenRouter API returned {resp.status_code}: {resp.text}")
                    continue
                
                result = resp.json()
                choices = result.get("choices", [])
                if not choices:
                    last_error = RuntimeError(f"OpenRouter returned no choices: {result}")
                    continue
                
                msg = choices[0].get("message", {})
                raw_content = msg.get("content") or ""
                raw_reasoning = msg.get("reasoning") or ""

                # Extract JSON from content, or fallback to reasoning if content is empty/truncated
                cleaned = self.clean_json_text(raw_content)
                if not (cleaned and "{" in cleaned and "}" in cleaned):
                    cleaned = self.clean_json_text(raw_reasoning)

                if not (cleaned and "{" in cleaned and "}" in cleaned):
                    last_error = RuntimeError(f"Model ({result.get('model')}) produced no JSON output: {repr(raw_content)[:100]}")
                    continue

                try:
                    data = json.loads(cleaned)
                    summary, clauses = self.parse_clauses_from_dict(data)
                    return {"summary": summary, "clauses": clauses}
                except Exception as e:
                    last_error = RuntimeError(f"Failed to parse JSON from {result.get('model')}: {e}")
                    continue

        if last_error:
            raise last_error
        raise RuntimeError("OpenRouter failed to analyze contract after multiple attempts.")
