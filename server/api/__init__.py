from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from .config import Config
import google.generativeai as genai
import os
from dotenv import load_dotenv
from api.plugins.manager import init_plugin_manager

mongo = PyMongo()
bcrypt = Bcrypt()
gemini_model = None
plugin_manager = None

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()
    app.config.from_object(Config)
    mongo.init_app(app)
    bcrypt.init_app(app)
    app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')
    # Initialize Plugins
    global plugin_manager
    plugin_manager = init_plugin_manager(app.config['PLUGINS_DIRS'], app.config['ENABLED_PLUGINS'])
    
    with app.app_context():
        try:
            mongo.db.sessions.create_index("expires_at", expireAfterSeconds=0)
        except Exception as e:
            print(f"Warning: Failed to create TTL index for sessions: {e}")

    @app.route("/")
    def index():
        return "Welcome to the PrivGPT-Studio Backend!"

    try:
        genai.configure(api_key=Config.GEMINI_API_KEY)
        global gemini_model
        gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")
    except Exception as e:
        print(f"Warning: Gemini API not configured correctly: {e}")

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
    from api.routes.contact_routes import contact_bp
    app.register_blueprint(contact_bp)
    
    from api.routes.review_routes import review_bp
    app.register_blueprint(review_bp)
    
    return app