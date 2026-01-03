#!/usr/bin/env python3
"""
Script to seed the database with sample reviews for testing
"""

from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Sample reviews data
sample_reviews = [
    {
        "user_id": "sample_user_1",
        "username": "TechEnthusiast",
        "rating": 5,
        "comment": "PrivGPT Studio has revolutionized my workflow! The local model option gives me the privacy I need while the cloud models provide incredible performance.",
        "created_at": datetime.utcnow(),
        "approved": True
    },
    {
        "user_id": "sample_user_2", 
        "username": "DataScientist",
        "rating": 4,
        "comment": "Great platform with excellent model variety. The interface is clean and intuitive. Would love to see more local model options in the future.",
        "created_at": datetime.utcnow(),
        "approved": True
    },
    {
        "user_id": "sample_user_3",
        "username": "PrivacyAdvocate", 
        "rating": 5,
        "comment": "Finally, an AI chat platform that respects privacy! The local models work flawlessly and I love having full control over my data.",
        "created_at": datetime.utcnow(),
        "approved": True
    },
    {
        "user_id": "sample_user_4",
        "username": "Developer",
        "rating": 4,
        "comment": "Seamless switching between cloud and local models. Perfect for different use cases. The API integration is also very smooth.",
        "created_at": datetime.utcnow(),
        "approved": True
    },
    {
        "user_id": "sample_user_5",
        "username": "StartupFounder",
        "rating": 5,
        "comment": "This platform has been a game-changer for our team. The flexibility to choose between models based on our needs is incredible.",
        "created_at": datetime.utcnow(),
        "approved": True
    },
    {
        "user_id": "sample_user_6",
        "username": "AIResearcher",
        "rating": 4,
        "comment": "Impressive collection of models and great performance. The local model support is particularly valuable for research work.",
        "created_at": datetime.utcnow(),
        "approved": True
    }
]

def seed_reviews():
    """Seed the database with sample reviews"""
    try:
        # Connect to MongoDB
        mongo_uri = os.getenv("MONGODB_URL", "mongodb://localhost:27017/privgpt_studio")
        client = MongoClient(mongo_uri)
        db = client.privgpt_studio  # Specify database name explicitly
        
        # Clear existing sample reviews
        db.reviews.delete_many({"user_id": {"$regex": "^sample_user_"}})
        
        # Insert sample reviews
        result = db.reviews.insert_many(sample_reviews)
        print(f"Successfully inserted {len(result.inserted_ids)} sample reviews")
        
        # Display inserted reviews
        for review in sample_reviews:
            print(f"- {review['username']}: {review['rating']} stars - {review['comment'][:50]}...")
            
    except Exception as e:
        print(f"Error seeding reviews: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_reviews()