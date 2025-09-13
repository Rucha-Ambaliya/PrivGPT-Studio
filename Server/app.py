from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "PrivGPT Studio Backend Working! ✅"

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')
        
        # Simple validation
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        if '@' not in email:
            return jsonify({'error': 'Please enter a valid email address'}), 400
        
        # Success response
        return jsonify({'message': 'Account created successfully!'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    print("🚀 Backend running on http://localhost:5000")
    app.run(debug=True, port=5000)