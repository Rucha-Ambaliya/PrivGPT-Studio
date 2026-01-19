#!/usr/bin/env python3
"""
Cleanup script for expired chat sessions.
This script should be run periodically (e.g., via cron job) to remove expired conversations.
"""

import os
import sys
import requests
from datetime import datetime

# Add the parent directory to the path so we can import from api
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def cleanup_expired_chats():
    """
    Calls the cleanup endpoint to remove expired chat sessions.
    """
    try:
        # Get the backend URL from environment or use default
        backend_url = os.getenv('BACKEND_URL', 'http://localhost:5000')
        
        response = requests.post(f"{backend_url}/chat/cleanup-expired")
        
        if response.status_code == 200:
            data = response.json()
            print(f"[{datetime.now()}] Cleanup successful: {data['message']}")
            return data['deleted_count']
        else:
            print(f"[{datetime.now()}] Cleanup failed: {response.status_code} - {response.text}")
            return 0
            
    except Exception as e:
        print(f"[{datetime.now()}] Error during cleanup: {str(e)}")
        return 0

if __name__ == "__main__":
    deleted_count = cleanup_expired_chats()
    sys.exit(0 if deleted_count >= 0 else 1)