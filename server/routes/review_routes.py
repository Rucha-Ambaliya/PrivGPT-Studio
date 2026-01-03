from flask import Blueprint, request, jsonify, current_app
from server import mongo
from bson import ObjectId
import jwt
from datetime import datetime
from functools import wraps

review_bp = Blueprint('review', __name__)

def validate_user(req):
    """
    Validates JWT token from request header.
    Returns user_id if valid, else None.
    """
    token = None
    if 'Authorization' in req.headers:
        auth_header = req.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return None
        
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return data['user_id']
    except:
        return None

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = validate_user(request)
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401
        return f(user_id, *args, **kwargs)
    return decorated_function

@review_bp.route('/api/reviews', methods=['GET'])
def get_reviews():
    """Get all approved reviews for display on landing page"""
    try:
        reviews = list(mongo.db.reviews.find(
            {'approved': True}, 
            {'_id': 0, 'user_id': 0, 'approved': 0}
        ).sort('created_at', -1))
        
        return jsonify({'reviews': reviews}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching reviews: {str(e)}'}), 500

@review_bp.route('/api/reviews', methods=['POST'])
@require_auth
def submit_review(user_id):
    """Submit a new review (one per user)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('rating') or not data.get('comment'):
            return jsonify({'message': 'Rating and comment are required'}), 400
        
        rating = data.get('rating')
        comment = data.get('comment')
        
        # Validate rating
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400
        
        # Check if user already has a review
        existing_review = mongo.db.reviews.find_one({'user_id': user_id})
        if existing_review:
            return jsonify({'message': 'You have already submitted a review'}), 409
        
        # Get user info
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Create review
        review = {
            'user_id': user_id,
            'username': user.get('username', 'Anonymous'),
            'rating': rating,
            'comment': comment,
            'created_at': datetime.utcnow(),
            'approved': True  # Auto-approve for now, can add moderation later
        }
        
        mongo.db.reviews.insert_one(review)
        
        return jsonify({'message': 'Review submitted successfully'}), 201
        
    except Exception as e:
        return jsonify({'message': f'Error submitting review: {str(e)}'}), 500

@review_bp.route('/api/reviews/user', methods=['GET'])
@require_auth
def get_user_review(user_id):
    """Get current user's review if exists"""
    try:
        review = mongo.db.reviews.find_one(
            {'user_id': user_id}, 
            {'_id': 0, 'user_id': 0}
        )
        
        if review:
            return jsonify({'review': review}), 200
        else:
            return jsonify({'review': None}), 200
            
    except Exception as e:
        return jsonify({'message': f'Error fetching user review: {str(e)}'}), 500

@review_bp.route('/api/reviews/user', methods=['PUT'])
@require_auth
def update_user_review(user_id):
    """Update user's existing review"""
    try:
        data = request.get_json()
        
        if not data or not data.get('rating') or not data.get('comment'):
            return jsonify({'message': 'Rating and comment are required'}), 400
        
        rating = data.get('rating')
        comment = data.get('comment')
        
        # Validate rating
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400
        
        # Update review
        result = mongo.db.reviews.update_one(
            {'user_id': user_id},
            {
                '$set': {
                    'rating': rating,
                    'comment': comment,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'No review found to update'}), 404
        
        return jsonify({'message': 'Review updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error updating review: {str(e)}'}), 500

@review_bp.route('/api/reviews/user', methods=['DELETE'])
@require_auth
def delete_user_review(user_id):
    """Delete user's review"""
    try:
        result = mongo.db.reviews.delete_one({'user_id': user_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'No review found to delete'}), 404
        
        return jsonify({'message': 'Review deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error deleting review: {str(e)}'}), 500