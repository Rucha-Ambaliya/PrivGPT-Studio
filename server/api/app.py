import os
import sys
from flask_cors import CORS
# Add parent directory to Python path to allow Server module import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api import create_app
# Initialize Flask app
app = create_app()
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# start server
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)