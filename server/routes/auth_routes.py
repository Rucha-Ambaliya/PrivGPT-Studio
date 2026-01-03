from flask import Blueprint, request, jsonify, current_app
from server import mongo, bcrypt
import jwt
import datetime
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Optional field
    pattern = r'^[\+]?[1-9][\d]{0,15}$'
    return re.match(pattern, phone.replace('-', '').replace(' ', '')) is not None

@auth_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        email = data.get('email').strip().lower()
        password = data.get('password')
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(password) < 8:
            return jsonify({'message': 'Password must be at least 8 characters long'}), 400
        
        # Check if user already exists
        if mongo.db.users.find_one({'email': email}):
            return jsonify({'message': 'User with this email already exists'}), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Handle optional fields with validation
        username = data.get('username', '').strip()
        if not username:
            username = email.split('@')[0]
        
        # Validate optional fields
        gender = data.get('gender', '').strip()
        if gender and gender not in ['male', 'female', 'other']:
            return jsonify({'message': 'Invalid gender value'}), 400
        
        dob = data.get('dob', '').strip()
        phone = data.get('phone', '').strip()
        
        if phone and not validate_phone(phone):
            return jsonify({'message': 'Invalid phone number format'}), 400
        
        # Additional fields for comprehensive user profile
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        country = data.get('country', '').strip()
        occupation = data.get('occupation', '').strip()
        
        # Create user document
        user = {
            'email': email,
            'password': hashed_password,
            'username': username,
            'first_name': first_name if first_name else None,
            'last_name': last_name if last_name else None,
            'gender': gender if gender else None,
            'dob': dob if dob else None,
            'phone': phone if phone else None,
            'country': country if country else None,
            'occupation': occupation if occupation else None,
            'created_at': datetime.datetime.utcnow(),
            'updated_at': datetime.datetime.utcnow(),
            'is_active': True,
            'chat_sessions': [],  # Array to store chat session IDs for authorized users
            'profile_completed': bool(first_name and last_name and gender and dob)
        }
        
        result = mongo.db.users.insert_one(user)
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': str(result.inserted_id),
            'profile_completed': user['profile_completed']
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        email = data.get('email').strip().lower()
        password = data.get('password')
        
        # Find user by email
        user = mongo.db.users.find_one({'email': email})
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({'message': 'Account is deactivated. Please contact support.'}), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Update last login
        mongo.db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.datetime.utcnow()}}
        )
        
        # Generate JWT token with user info
        token_payload = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'username': user.get('username', ''),
            'is_authorized': True,  # Authorized users can have multiple chats
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        
        token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        # Return user info along with token
        user_info = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'username': user.get('username', ''),
            'first_name': user.get('first_name', ''),
            'last_name': user.get('last_name', ''),
            'profile_completed': user.get('profile_completed', False),
            'chat_sessions_count': len(user.get('chat_sessions', []))
        }
        
        return jsonify({
            'token': token,
            'message': 'Login successful',
            'user': user_info
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/api/profile', methods=['GET'])
def get_profile():
    """Get user profile information"""
    try:
        # Get token from header
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Authentication token required'}), 401
        
        # Decode token
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        # Get user from database
        user = mongo.db.users.find_one({'_id': mongo.db.users.find_one({'_id': user_id})['_id']})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Return user profile (excluding sensitive data)
        profile = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'username': user.get('username', ''),
            'first_name': user.get('first_name', ''),
            'last_name': user.get('last_name', ''),
            'gender': user.get('gender', ''),
            'dob': user.get('dob', ''),
            'phone': user.get('phone', ''),
            'country': user.get('country', ''),
            'occupation': user.get('occupation', ''),
            'created_at': user.get('created_at'),
            'profile_completed': user.get('profile_completed', False),
            'chat_sessions_count': len(user.get('chat_sessions', []))
        }
        
        return jsonify({'profile': profile}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500
