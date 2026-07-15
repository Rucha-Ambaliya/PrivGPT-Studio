from flask import Blueprint, jsonify, request
from api.services.ollama_services import get_available_models, get_model_details, test_ollama_connection

model_bp=Blueprint('model_bp', __name__)

@model_bp.route("/models")
def models():
    """
    Returns available local and cloud models.
    Optionally accepts ollama_url query parameter for custom Ollama instance.

    Returns:
    JSON: Dictionary with local_models and cloud_models keys.
    """
    ollama_url = request.args.get('ollama_url', 'http://localhost:11434')
    local_models = get_available_models(ollama_url)
    cloud_models = ["gemini"]
    return jsonify({
        "local_models": local_models,
        "cloud_models": cloud_models,
    })

@model_bp.route("/model_info", methods=["POST"])
def model_info():
    """
    Returns detailed information about a specific model.
    Expects JSON: { "model_name": "name", "model_type": "local"|"cloud", "ollama_url": "url" (optional) }
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    model_name = data.get("model_name")
    model_type = data.get("model_type", "local")
    ollama_url = data.get("ollama_url", 'http://localhost:11434')

    if not model_name:
        return jsonify({"error": "Model name is required"}), 400

    if model_type == "cloud":
        return jsonify({
            "license": "Proprietary",
            "modelfile": "N/A",
            "parameters": "Managed by Provider",
            "template": "Standard Chat Interface",
            "details": {
                "parent_model": "",
                "format": "Cloud API",
                "family": "Gemini",
                "families": ["Gemini"],
                "parameter_size": "Unknown",
                "quantization_level": "None"
            }
        })

    details = get_model_details(model_name, ollama_url)
    if details:
        return jsonify(details)
    
    return jsonify({"error": "Failed to fetch model info"}), 500

@model_bp.route("/test_ollama", methods=["POST"])
def test_ollama():
    """
    Tests connection to an Ollama instance.
    Expects JSON: { "ollama_url": "url" }

    Returns:
    JSON: Connection test result with success status and message.
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    ollama_url = data.get("ollama_url", "http://localhost:11434")
    
    result = test_ollama_connection(ollama_url)
    return jsonify(result)

select_model_bp = Blueprint('select_model_bp', __name__)
@select_model_bp.route("/select_model", methods=["POST"])
def select_model():
    """
    Selects the current model based on user input.

    Returns:
    JSON: Status of model selection.
    """

    global current_model
    current_model = request.json.get("model", "phi3")
    return jsonify({"status": "ok"})