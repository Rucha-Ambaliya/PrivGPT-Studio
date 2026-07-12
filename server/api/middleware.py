from functools import wraps
from flask import request, jsonify, current_app
from datetime import datetime, timedelta
from api import mongo

def rate_limit(limit=10, per=60):
    """
    Rate limiting middleware using MongoDB.
    Limits requests to `limit` per `per` seconds based on IP address.
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=per)
            
            # Clean up old entries (optimization: could be moved to a background task)
            mongo.db.rate_limits.delete_many({"timestamp": {"$lt": window_start}})
            
            # Count recent requests from this IP
            count = mongo.db.rate_limits.count_documents({
                "ip": ip, 
                "timestamp": {"$gte": window_start}
            })
            
            if count >= limit:
                return jsonify({
                    "error": "Rate limit exceeded. Please try again later.",
                    "limit_reached": True
                }), 429
                
            # Log this request
            mongo.db.rate_limits.insert_one({"ip": ip, "timestamp": now})
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

def validate_chat_request(f):
    """
    Middleware to validate incoming chat request payloads.
    Ensures required fields exist and values are within expected bounds.
    """
    @wraps(f)
    def wrapped(*args, **kwargs):
        user_msg = request.form.get("message", "").strip()
        uploaded_file = request.files.get("uploaded_file")
        
        # Must have either text or a file
        if not user_msg and not uploaded_file:
            return jsonify({"error": "Bad Request: 'message' or 'uploaded_file' is required."}), 400
            
        # Validate model type
        model_type = request.form.get("model_type", "")
        if model_type not in ["local", "cloud", ""]:
            return jsonify({"error": "Bad Request: Invalid 'model_type'."}), 400
            
        # Validate inference parameters if present
        try:
            temperature = float(request.form.get("temperature", 0.7))
            if not (0.0 <= temperature <= 2.0):
                return jsonify({"error": "Bad Request: 'temperature' must be between 0.0 and 2.0."}), 400
                
            top_p = float(request.form.get("top_p", 0.9))
            if not (0.0 <= top_p <= 1.0):
                return jsonify({"error": "Bad Request: 'top_p' must be between 0.0 and 1.0."}), 400
                
        except ValueError:
            return jsonify({"error": "Bad Request: Inference parameters must be numeric."}), 400
            
        return f(*args, **kwargs)
    return wrapped
