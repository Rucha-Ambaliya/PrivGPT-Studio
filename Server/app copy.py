import os
import google.generativeai as genai
import sys
# Add parent directory to Python path to allow Server module import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Server import create_app
# Initialize Flask app
app = create_app()
# list available models
for m in genai.list_models():
    print(m.name, m.supported_generation_methods)
# start server
if __name__ == "__main__":
    app.run(debug=True)