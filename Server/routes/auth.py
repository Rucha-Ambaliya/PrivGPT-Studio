from flask import Blueprint, request, jsonify
from models.user import User
from database import get_users_collection
import re

auth_bp = Blueprint('auth', __name__)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Success response
        return jsonify({
            'message': 'User created successfully!',
            'user': {
                'email': email,
                'status': 'registered'
            }
        }), 201
            
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/test', methods=['GET'])
def auth_test():
    return jsonify({
        'message': 'Auth routes working!',
        'status': 'success',
        'endpoints': [
            '/api/auth/signup (POST)',
            '/api/auth/test (GET)'
        ]
    })
