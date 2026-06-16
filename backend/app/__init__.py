from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20 MB
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

    from .routes import api_bp
    app.register_blueprint(api_bp)

    return app
