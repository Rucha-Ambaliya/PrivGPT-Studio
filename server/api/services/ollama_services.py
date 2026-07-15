import requests
from urllib.parse import urlparse

def validate_ollama_url(url):
    """
    Validates that the URL is properly formatted and uses http/https.
    
    Args:
    url (str): The Ollama URL to validate.
    
    Returns:
    bool: True if valid, False otherwise.
    """
    try:
        parsed = urlparse(url)
        return parsed.scheme in ['http', 'https'] and parsed.netloc != ''
    except:
        return False

def get_available_models(ollama_url="http://localhost:11434"):
    """
    Fetches list of available local models from Ollama.

    Args:
    ollama_url (str): The URL of the Ollama instance.

    Returns:
    list: Names of available local models (with full tags).
    """
    if not validate_ollama_url(ollama_url):
        return []
    
    try:
        res = requests.get(f"{ollama_url}/api/tags", timeout=5)
        # Return full model names including tags (e.g., "gemma3:1b" instead of just "gemma3")
        return sorted(m['name'] for m in res.json().get("models", []))
    except:
        return []

def get_model_details(model_name, ollama_url="http://localhost:11434"):
    """
    Fetches detailed information for a specific local model from Ollama.

    Args:
    model_name (str): The name of the model to inspect.
    ollama_url (str): The URL of the Ollama instance.

    Returns:
    dict: The JSON response from Ollama's /api/show endpoint, or None if failed.
    """
    if not validate_ollama_url(ollama_url):
        return None
        
    try:
        res = requests.post(f"{ollama_url}/api/show", json={"name": model_name}, timeout=5)
        if res.status_code == 200:
            return res.json()
        return None
    except Exception as e:
        print(f"Error fetching details for {model_name}: {e}")
        return None

def test_ollama_connection(ollama_url="http://localhost:11434"):
    """
    Tests if the Ollama instance is reachable and responding.

    Args:
    ollama_url (str): The URL of the Ollama instance.

    Returns:
    dict: Dictionary with 'success' (bool) and 'message' (str) keys.
    """
    if not validate_ollama_url(ollama_url):
        return {
            "success": False,
            "message": "Invalid URL format. URL must start with http:// or https://"
        }
    
    try:
        res = requests.get(f"{ollama_url}/api/tags", timeout=5)
        if res.status_code == 200:
            return {
                "success": True,
                "message": "Successfully connected to Ollama instance"
            }
        else:
            return {
                "success": False,
                "message": f"Ollama returned status code {res.status_code}"
            }
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "message": "Connection timeout. Ollama may not be running or is unreachable."
        }
    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "message": "Connection refused. Check if Ollama is running and the URL is correct."
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Unexpected error: {str(e)}"
        }