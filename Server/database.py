from pymongo import MongoClient

def get_users_collection():
    try:
        # For now, using local MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['privgpt_studio']
        return db['users']
    except Exception as e:
        print(f"Database connection error: {e}")
        return None