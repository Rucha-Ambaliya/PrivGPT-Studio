import json
import requests
from abc import ABC, abstractmethod
from typing import Dict, Any, Generator
import google.generativeai as genai
from api import gemini_model

class ModelProvider(ABC):
    @abstractmethod
    def generate(self, combined_input: Any, model_name: str, **kwargs) -> str:
        """Generate a complete response string."""
        pass
        
    @abstractmethod
    def generate_stream(self, combined_input: Any, model_name: str, **kwargs) -> Generator[str, None, None]:
        """Generate response as a stream of text chunks."""
        pass

class LocalOllamaProvider(ModelProvider):
    def _build_payload(self, combined_input: Any, model_name: str, stream: bool, **kwargs) -> Dict[str, Any]:
        payload = {
            "model": model_name,
            "prompt": combined_input,
            "stream": stream,
            "options": {
                "temperature": kwargs.get("temperature", 0.7),
                "top_p": kwargs.get("top_p", 0.9),
                "top_k": kwargs.get("top_k", 40),
                "num_predict": kwargs.get("max_tokens", 2048),
                "frequency_penalty": kwargs.get("frequency_penalty", 0),
                "presence_penalty": kwargs.get("presence_penalty", 0),
            }
        }
        if kwargs.get("stop_sequence"):
            payload["options"]["stop"] = [kwargs.get("stop_sequence")]
        if kwargs.get("seed") is not None:
            payload["options"]["seed"] = kwargs.get("seed")
        if kwargs.get("system_prompt"):
            payload["system"] = kwargs.get("system_prompt")
        return payload

    def generate(self, combined_input: Any, model_name: str, **kwargs) -> str:
        payload = self._build_payload(combined_input, model_name, stream=False, **kwargs)
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "No reply.")

    def generate_stream(self, combined_input: Any, model_name: str, **kwargs) -> Generator[str, None, None]:
        payload = self._build_payload(combined_input, model_name, stream=True, **kwargs)
        response = requests.post("http://localhost:11434/api/generate", json=payload, stream=True, timeout=60)
        response.raise_for_status()
        
        for line in response.iter_lines():
            if line:
                try:
                    chunk_data = json.loads(line.decode('utf-8'))
                    chunk_text = chunk_data.get("response", "")
                    if chunk_text:
                        yield chunk_text
                    if chunk_data.get("done", False):
                        break
                except json.JSONDecodeError:
                    continue

class GeminiProvider(ModelProvider):
    def _get_model(self, kwargs: Dict[str, Any]):
        system_prompt = kwargs.get("system_prompt", "").strip()
        if system_prompt:
            return genai.GenerativeModel(
                "models/gemini-2.5-flash",
                system_instruction=system_prompt
            )
        return gemini_model
        
    def _build_generation_config(self, kwargs: Dict[str, Any]) -> Dict[str, Any]:
        generation_config = {
            "temperature": kwargs.get("temperature", 0.7),
            "top_p": kwargs.get("top_p", 0.9),
            "top_k": kwargs.get("top_k", 40),
            "max_output_tokens": kwargs.get("max_tokens", 2048),
        }
        if kwargs.get("stop_sequence"):
            generation_config["stop_sequences"] = [kwargs.get("stop_sequence")]
        return generation_config

    def generate(self, combined_input: Any, model_name: str, **kwargs) -> str:
        if not gemini_model:
            raise RuntimeError("Gemini model is not configured.")
        
        model = self._get_model(kwargs)
        generation_config = self._build_generation_config(kwargs)
        
        response = model.generate_content(combined_input, generation_config=generation_config)
        return response.text or "No Reply"

    def generate_stream(self, combined_input: Any, model_name: str, **kwargs) -> Generator[str, None, None]:
        if not gemini_model:
            raise RuntimeError("Gemini model is not configured.")
            
        model = self._get_model(kwargs)
        generation_config = self._build_generation_config(kwargs)
        
        response = model.generate_content(combined_input, generation_config=generation_config, stream=True)
        for chunk in response:
            chunk_text = chunk.text if chunk.text else ""
            if chunk_text:
                yield chunk_text

class ModelFactory:
    @staticmethod
    def get_provider(model_type: str) -> ModelProvider:
        if model_type == "local":
            return LocalOllamaProvider()
        elif model_type == "cloud":
            return GeminiProvider()
        else:
            raise ValueError(f"Unknown model_type: {model_type}")
