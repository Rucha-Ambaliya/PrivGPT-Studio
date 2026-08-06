from flask import Blueprint, request, jsonify, current_app
from api import mongo
import jwt
import datetime
from bson import ObjectId
from bson.errors import InvalidId

review_bp = Blueprint('review', __name__)

def verify_token(request):
    """
    Verifies JWT token from Authorization header.

    Args:
    request: Flask request object containing headers

    Returns:
    dict: Decoded token data if valid, None if invalid or missing
    """
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return None
        
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return data
    except:
        return None

@review_bp.route('/api/reviews', methods=['GET'])
def get_reviews():
    """
    Retrieves all user reviews from the database.

    Returns:
    JSON: List of review objects with _id and user_id converted to strings
    HTTP 500: If database error occurs
    HTTP 200: On successful retrieval
    """
    try:
        reviews = list(mongo.db.reviews.find().sort('created_at', -1))
        
        for review in reviews:
            review['_id'] = str(review['_id'])
            if 'user_id' in review:
                review['user_id'] = str(review['user_id'])
                
        return jsonify(reviews), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching reviews', 'error': str(e)}), 500

@review_bp.route('/api/reviews', methods=['POST'])
def add_review():
    """
    Adds a new user review to the database.

    Requires Authorization header with Bearer token.
    Expects JSON payload with:
    - rating (int): Review rating (required)
    - comment (str): Review comment (required)

    Returns:
    JSON: Success message on review submission
    HTTP 401: If user is not authenticated
    HTTP 400: If rating or comment is missing
    HTTP 409: If user has already submitted a review
    HTTP 201: On successful submission
    """
    user_data = verify_token(request)
    if not user_data:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json(silent=True) or {}
    rating_raw = data.get('rating')
    comment = data.get('comment')

    # Use an explicit None check so a legitimate rating of 0 isn't treated as
    # "missing" by a falsy test.
    if rating_raw is None or not comment:
        return jsonify({'message': 'Missing rating or comment'}), 400

    try:
        rating = int(rating_raw)
    except (TypeError, ValueError):
        return jsonify({'message': 'Rating must be an integer between 1 and 5'}), 400
    if rating < 1 or rating > 5:
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    # A forged/stale token may carry a non-ObjectId user_id.
    try:
        user_object_id = ObjectId(user_data['user_id'])
    except (InvalidId, TypeError):
        return jsonify({'message': 'Invalid user'}), 401

    try:
        existing_review = mongo.db.reviews.find_one({'user_id': user_object_id})
        if existing_review:
            return jsonify({'message': 'You have already submitted a review'}), 409

        # The user may have been deleted while the token is still valid.
        user = mongo.db.users.find_one({'_id': user_object_id})
        if not user:
            return jsonify({'message': 'User not found'}), 404

        review = {
            'user_id': user_object_id,
            'username': user.get('username', 'Anonymous'),
            'rating': rating,
            'comment': comment,
            'role': 'User',  # Default role
            'created_at': datetime.datetime.utcnow()
        }

        mongo.db.reviews.insert_one(review)

        return jsonify({'message': 'Review submitted successfully'}), 201
    except Exception as e:
        current_app.logger.error(f"Failed to add review: {e}")
        return jsonify({'message': 'Failed to submit review'}), 500