#!/usr/bin/env python
"""Initialize MongoDB database and collections"""
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DB = os.getenv('MONGODB_DB', 'alice_exam_proctor')

def init_database():
    try:
        client = MongoClient(MONGODB_URI)
        db = client[MONGODB_DB]
        
        # Create collections
        collections = ['users', 'quizzes', 'submissions', 'flags']
        
        for collection in collections:
            if collection not in db.list_collection_names():
                db.create_collection(collection)
                print(f'✓ Created collection: {collection}')
            else:
                print(f'✓ Collection already exists: {collection}')
        
        # Create indexes
        db.users.create_index('email', unique=True)
        db.quizzes.create_index('code', unique=True)
        
        print('\n✓ Database initialized successfully!')
        print(f'Database: {MONGODB_DB}')
        print(f'Collections: {", ".join(collections)}')
        
    except Exception as e:
        print(f'✗ Error initializing database: {e}')
        sys.exit(1)

if __name__ == '__main__':
    init_database()
