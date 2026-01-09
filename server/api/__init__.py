from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from .config import Config
import google.generativeai as genai

mongo = PyMongo()
bcrypt = Bcrypt()
gemini_model = None


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    
    # Set maximum content length for file uploads
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
    
    mongo.init_app(app)
    bcrypt.init_app(app)

    @app.route("/")
    def index():
        return "Welcome to the PrivGPT-Studio Backend!"
    
    # Error handler for file too large
    @app.errorhandler(413)
    def request_entity_too_large(error):
        max_size_mb = Config.MAX_FILE_SIZE / (1024 * 1024)
        return jsonify({
            "error": f"File too large. Maximum allowed size is {max_size_mb:.1f}MB",
            "max_size_bytes": Config.MAX_FILE_SIZE
        }), 413

    # configure the gemini model
    genai.configure(api_key=Config.GEMINI_API_KEY)
    global gemini_model
    gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")

    # blueprint imports
    from api.routes.db import db_bp
    app.register_blueprint(db_bp)
    from api.routes.model_routes import model_bp
    app.register_blueprint(model_bp)
    from api.routes.model_routes import select_model_bp
    app.register_blueprint(select_model_bp)
    from api.routes.chat_routes import chat_bp
    app.register_blueprint(chat_bp)
    from api.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    return app