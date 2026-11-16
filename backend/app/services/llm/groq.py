import json
import httpx
from typing import Dict, Any
from app.services.llm.base import BaseLLMProvider
from app.services.llm.prompts import SYSTEM_ANALYSIS_PROMPT

class GroqProvider(BaseLLMProvider):
    def __init__(self, api_key: str, model: str = "openai/gpt-oss-120b"):
        api_key = (api_key or "").strip()
        model = (model or "").strip() or "openai/gpt-oss-120b"
        super().__init__(api_key=api_key, model=model)
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    async def extract_clauses_and_summary(self, contract_text: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_ANALYSIS_PROMPT},
                {"role": "user", "content": f"Analyze this rental agreement:\n\n{contract_text}"}
            ],
            "response_format": {"type": "json_object"},
            "max_tokens": 8192,
            "temperature": 0.1
        }
        if "gpt-oss" in self.model:
            payload["reasoning_format"] = "parsed"
        
        async with httpx.AsyncClient(timeout=90.0) as client:
            resp = await client.post(self.api_url, headers=headers, json=payload)
            # If Groq strict JSON validator rejects (e.g. transient glitch or model token exhaustion), retry without response_format
            if resp.status_code == 400 and "json_validate_failed" in resp.text:
                payload.pop("response_format", None)
                resp = await client.post(self.api_url, headers=headers, json=payload)

            if resp.status_code != 200:
                raise RuntimeError(f"Groq API returned {resp.status_code}: {resp.text}")
            result = resp.json()
            
        content = result["choices"][0]["message"].get("content", "")
        cleaned = self.clean_json_text(content)
        data = json.loads(cleaned)
        summary, clauses = self.parse_clauses_from_dict(data)
        return {"summary": summary, "clauses": clauses}
