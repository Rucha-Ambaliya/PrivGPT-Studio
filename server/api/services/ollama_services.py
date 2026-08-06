import requests
from api.config import Config

def get_available_models(ollama_url=None):
    """
    Fetches list of available local models from Ollama.

    Args:
    ollama_url (str, optional): Custom Ollama base URL. Defaults to Config.OLLAMA_BASE_URL.

    Returns:
    list: Names of available local models (with full tags).
    """
    base_url = ollama_url or Config.OLLAMA_BASE_URL
    try:
        res = requests.get(f"{base_url}/api/tags", timeout=5)
        # Return full model names including tags (e.g., "gemma3:1b" instead of just "gemma3")
        return sorted(m['name'] for m in res.json().get("models", []))
    except:
        return []

def get_model_details(model_name, ollama_url=None):
    """
    Fetches detailed information for a specific local model from Ollama.

    Args:
    model_name (str): The name of the model to inspect.
    ollama_url (str, optional): Custom Ollama base URL. Defaults to Config.OLLAMA_BASE_URL.

    Returns:
    dict: The JSON response from Ollama's /api/show endpoint, or None if failed.
    """
    base_url = ollama_url or Config.OLLAMA_BASE_URL
    try:
        res = requests.post(f"{base_url}/api/show", json={"name": model_name}, timeout=5)
        if res.status_code == 200:
            return res.json()
        return None
    except Exception as e:
        print(f"Error fetching details for {model_name}: {e}")
        return None