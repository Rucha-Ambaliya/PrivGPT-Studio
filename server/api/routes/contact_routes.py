from flask import Blueprint, request, jsonify
from api import mongo
import datetime
import re
from functools import wraps
import time

contact_bp = Blueprint('contact', __name__)

# Simple in-memory rate limiting
# In production, use Redis or a proper rate limiting library
rate_limit_store = {}
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 5  # max requests per window per IP


def get_client_ip():
    """Get client IP address from request"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or '127.0.0.1'


def check_rate_limit(ip):
    """Check if IP has exceeded rate limit"""
    current_time = time.time()
    
    # Clean up old entries
    expired_ips = [
        stored_ip for stored_ip, data in rate_limit_store.items()
        if current_time - data['window_start'] > RATE_LIMIT_WINDOW
    ]
    for expired_ip in expired_ips:
        del rate_limit_store[expired_ip]
    
    # Check/update rate limit for current IP
    if ip in rate_limit_store:
        data = rate_limit_store[ip]
        if current_time - data['window_start'] > RATE_LIMIT_WINDOW:
            # Reset window
            rate_limit_store[ip] = {'window_start': current_time, 'count': 1}
            return True
        elif data['count'] >= RATE_LIMIT_MAX_REQUESTS:
            return False
        else:
            data['count'] += 1
            return True
    else:
        rate_limit_store[ip] = {'window_start': current_time, 'count': 1}
        return True


def validate_email(email):
    """Validate email format"""
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(email_regex, email))


@contact_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    """
    Handle contact form submission.
    
    Expected JSON payload:
    {
        "name": "string (required)",
        "email": "string (required, valid email)",
        "subject": "string (optional)",
        "message": "string (required, min 10 chars)",
        "website": "string (honeypot, should be empty)"
    }
    """
    # Rate limiting check
    client_ip = get_client_ip()
    if not check_rate_limit(client_ip):
        return jsonify({
            'message': 'Too many requests. Please try again later.',
            'error': 'rate_limit_exceeded'
        }), 429
    
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Honeypot check - if 'website' field is filled, it's likely a bot
    if data.get('website'):
        # Log the spam attempt but return success to not reveal the trap
        try:
            mongo.db.spam_attempts.insert_one({
                'ip': client_ip,
                'data': data,
                'timestamp': datetime.datetime.utcnow(),
                'type': 'honeypot'
            })
        except Exception:
            pass  # Silently ignore logging errors
        
        # Return a fake success to confuse bots
        return jsonify({'message': 'Spam detected'}), 400
    
    # Validate required fields
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()
    
    errors = {}
    
    if not name:
        errors['name'] = 'Name is required'
    
    if not email:
        errors['email'] = 'Email is required'
    elif not validate_email(email):
        errors['email'] = 'Please enter a valid email address'
    
    if not message:
        errors['message'] = 'Message is required'
    elif len(message) < 10:
        errors['message'] = 'Message must be at least 10 characters'
    
    if errors:
        return jsonify({
            'message': 'Validation failed',
            'errors': errors
        }), 400
    
    # Create contact message document
    contact_message = {
        'name': name,
        'email': email,
        'subject': subject if subject else 'No subject',
        'message': message,
        'ip': client_ip,
        'status': 'pending',  # pending, read, replied, archived
        'created_at': datetime.datetime.utcnow(),
        'read_at': None,
        'replied_at': None
    }
    
    # Log to console (fast, no database dependency)
    print(f"[CONTACT] New message received:")
    print(f"  From: {name} <{email}>")
    print(f"  Subject: {subject if subject else 'No subject'}")
    print(f"  Message: {message}")
    print(f"  IP: {client_ip}")
    print(f"  Time: {datetime.datetime.utcnow()}")
    
    # Optionally save to MongoDB if available (uncomment when DB is running)
    # try:
    #     if mongo.db is not None:
    #         mongo.db.contact_messages.insert_one(contact_message)
    # except Exception as e:
    #     print(f"[CONTACT DB ERROR] {str(e)}")
    
    return jsonify({
        'message': 'Thank you for contacting us! We will get back to you soon.'
    }), 201


@contact_bp.route('/api/contact', methods=['OPTIONS'])
def contact_options():
    """Handle CORS preflight request"""
    return '', 204
