import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    CORS_HEADERS = "Content-Type"
    #here the second value shows the default value if the environment variable is not set
    MONGO_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017/privgpt")
    ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
    # Plugins directory logic
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # this is the 'server' folder
    PROJECT_ROOT = os.path.dirname(BASE_DIR)
    
    # Support both internal and root-level plugins
    PLUGINS_DIRS = [
        os.path.join(BASE_DIR, "plugins"),
        os.path.join(PROJECT_ROOT, "plugins")
    ]
    
    # Allow overriding via environment variable (comma-separated list)
    _env_dirs = os.getenv("PLUGINS_DIRS")
    if _env_dirs:
        PLUGINS_DIRS = _env_dirs.split(',')
        
    ENABLED_PLUGINS = os.getenv("ENABLED_PLUGINS", None) # Comma-separated list of plugin folder names
    MAX_MESSAGES_PER_SESSION = int(os.getenv("MAX_MESSAGES_PER_SESSION", 10))
    CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "support@privgpt-studio.com")
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
