#!/usr/bin/env python3
"""Cleanup expired chat sessions"""

import os
from datetime import datetime
from pymongo import MongoClient

def cleanup_expired_chats():
    try:
        client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
        db = client.privgpt_studio
        
        now = datetime.now()
        result = db.sessions.delete_many({
            "privacy_settings.expires_at": {"$lt": now}
        })
        
        print(f"Cleaned up {result.deleted_count} expired sessions")
        client.close()
        return result.deleted_count
        
    except Exception as e:
        print(f"Error: {e}")
        return 0

if __name__ == '__main__':
    cleanup_expired_chats()