import requests

def get_available_models():
    """
    Fetches list of available local models from Ollama.

    Returns:
    list: Names of available local models (with full tags).
    """
    try:
        res = requests.get("http://localhost:11434/api/tags", timeout=5)
        # Return full model names including tags (e.g., "gemma3:1b" instead of just "gemma3")
        return sorted(m['name'] for m in res.json().get("models", []))
    except:
        return []

def get_model_details(model_name):
    """
    Fetches detailed information for a specific local model from Ollama.

    Args:
    model_name (str): The name of the model to inspect.

    Returns:
    dict: The JSON response from Ollama's /api/show endpoint, or None if failed.
    """
    try:
        res = requests.post("http://localhost:11434/api/show", json={"name": model_name}, timeout=5)
        if res.status_code == 200:
            return res.json()
        return None
    except Exception as e:
        print(f"Error fetching details for {model_name}: {e}")
        return None