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
    mongo.init_app(app)
    bcrypt.init_app(app)

    @app.route("/")
    def index():
        return "Welcome to the PrivGPT-Studio Backend!"

    # configure the gemini model
    genai.configure(api_key=Config.GEMINI_API_KEY)
    global gemini_model
    gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")

    # blueprint imports
    from server.routes.db import db_bp
    app.register_blueprint(db_bp)
    from server.routes.model_routes import model_bp
    app.register_blueprint(model_bp)
    from server.routes.model_routes import select_model_bp
    app.register_blueprint(select_model_bp)
    from server.routes.chat_routes import chat_bp
    app.register_blueprint(chat_bp)
    from server.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    from server.routes.review_routes import review_bp
    app.register_blueprint(review_bp)
    return app