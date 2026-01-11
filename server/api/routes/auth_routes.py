from flask import Blueprint, request, jsonify, current_app
from api import mongo, bcrypt
import jwt
import datetime
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
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
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    user = mongo.db.users.find_one({'email': email})
    
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # generate JWT
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({'token': token, 'message': 'Login successful'}), 200

@auth_bp.route('/api/profile', methods=['GET'])
def get_profile():
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
        
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'username': user.get('username'),
            'email': user.get('email'),
        }), 200
    except Exception as e:
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401