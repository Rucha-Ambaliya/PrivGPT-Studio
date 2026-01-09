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
    MAX_MESSAGES_PER_SESSION = int(os.getenv("MAX_MESSAGES_PER_SESSION", 10))
    
    # File Upload Security Settings
    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
    MAX_CONTENT_LENGTH = MAX_FILE_SIZE  # Flask's max request size
    
    # MIME type validation mapping
    ALLOWED_MIME_TYPES = {
        "pdf": ["application/pdf"],
        "png": ["image/png"],
        "jpg": ["image/jpeg"],
        "jpeg": ["image/jpeg"],
        "gif": ["image/gif"],
        "mp4": ["video/mp4"],
        "mp3": ["audio/mpeg", "audio/mp3"]
    }
    
    # Rate limiting settings (per minute)
    FILE_UPLOAD_RATE_LIMIT = "5 per minute"
    CHAT_RATE_LIMIT = "30 per minute"
