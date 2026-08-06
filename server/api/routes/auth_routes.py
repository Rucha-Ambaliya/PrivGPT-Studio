from flask import Blueprint, request, jsonify, current_app
from api import mongo, bcrypt
import os
import jwt
import datetime
from bson import ObjectId
from google.oauth2 import id_token
from google.auth.transport import requests
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/google', methods=['POST'])
def google_auth():
    app_client_id = current_app.config.get('GOOGLE_CLIENT_ID')

    # verify_oauth2_token skips the audience ('aud') check when the audience is
    # None — which would accept a token minted for ANY Google OAuth client. Refuse
    # to verify unless the client id is configured, so the audience is always
    # enforced against this app.
    if not app_client_id:
        return jsonify({'message': 'Google Sign-In is not configured on the server'}), 500

    data = request.get_json()
    token = data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), app_client_id)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        
        if not email:
            return jsonify({'message': 'Invalid token payload: Email missing'}), 400

        user = mongo.db.users.find_one({'email': email})
        
        if not user:
            new_user = {
                'email': email,
                'username': name or email.split('@')[0],
                'password': None,          
                'gender': None,
                'dob': None,
                'phone': None,
                'chat_sessions': [],       
                'created_at': datetime.datetime.utcnow()
            }
            result = mongo.db.users.insert_one(new_user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(user['_id'])
        local_token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': local_token, 'message': 'Login successful'}), 200

    except ValueError as ve:
        return jsonify({'message': 'Invalid token authentication signature', 'error': str(ve)}), 401
    except Exception as e:
        return jsonify({'message': 'Internal token verification failure', 'error': str(e)}), 401

@auth_bp.route('/api/register', methods=['POST'])
def register():
    """
    Registers a new user with email and password.

    Expects JSON payload with:
    - email (str): User's email address (required)
    - password (str): User's password (required)
    - username (str): Optional username, defaults to email prefix
    - gender (str): Optional gender
    - dob (str): Optional date of birth
    - phone (str): Optional phone number

    Returns:
    JSON: Success message on successful registration
    HTTP 400: If email or password is missing
    HTTP 409: If user already exists
    HTTP 201: On successful registration
    """
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    # user already exists
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 409
    
    # hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # handle optional fields
    username = data.get('username')
    if not username:
        username = email.split('@')[0]
        
    gender = data.get('gender')
    dob = data.get('dob')
    phone = data.get('phone')
    
    # create user
    user = {
        'email': email,
        'password': hashed_password,
        'username': username,
        'gender': gender if gender else None,
        'dob': dob if dob else None,
        'phone': phone if phone else None,
        'created_at': datetime.datetime.utcnow(),
        'chat_sessions': []
    }
    
    mongo.db.users.insert_one(user)
    
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """
    Authenticates a user with email and password.

    Expects JSON payload with:
    - email (str): User's email address (required)
    - password (str): User's password (required)

    Returns:
    JSON: JWT token and success message on successful login
    HTTP 400: If email or password is missing
    HTTP 401: If credentials are invalid
    HTTP 200: On successful login
    """
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    user = mongo.db.users.find_one({'email': email})
    
    if not user or not user.get('password') or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # generate JWT
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    
    return jsonify({'token': token, 'message': 'Login successful'}), 200

@auth_bp.route('/api/profile', methods=['GET'])
def get_profile():
    """
    Retrieves the authenticated user's profile information.

    Requires Authorization header with Bearer token.

    Returns:
    JSON: User profile data (username, email, gender, dob, phone)
    HTTP 401: If token is missing or invalid
    HTTP 404: If user not found
    HTTP 200: On successful retrieval
    """
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
        
    try:
        data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'username': user.get('username'),
            'email': user.get('email'),
            'gender': user.get('gender'),
            'dob': user.get('dob'),
            'phone': user.get('phone'),
        }), 200
    except Exception as e:
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401
    
@auth_bp.route('/api/profile', methods=['PUT'])
def update_profile():
    """
    Updates the authenticated user's profile information.

    Requires Authorization header with Bearer token.
    Expects JSON payload with optional fields:
    - username (str): New username
    - gender (str): New gender
    - dob (str): New date of birth
    - phone (str): New phone number

    Returns:
    JSON: Success message on update
    HTTP 401: If token is missing or invalid
    HTTP 400: If no valid fields provided
    HTTP 200: On successful update
    """
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
        
    try:
        data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        update_data = request.get_json()
        if not update_data:
             return jsonify({'message': 'No data provided'}), 400

        allowed_fields = ['username', 'gender', 'dob', 'phone']
        
        allowed_fields = ['username', 'gender', 'dob', 'phone']
        
        updates = {}
        for field in allowed_fields:
            if field in update_data:
                if isinstance(update_data[field], str):
                    updates[field] = update_data[field]
                else:
                    return jsonify({'message': f'Invalid data type for {field}. Expected a string.'}), 400
        
        if not updates:
            return jsonify({'message': 'No valid fields to update'}), 400

        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': updates}
        )
        
        if result.modified_count == 0:
             return jsonify({'message': 'Profile updated (no changes detected)'}), 200

        return jsonify({'message': 'Profile updated successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except Exception as e:
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401