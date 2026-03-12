#!/usr/bin/env python
"""Create sample data for testing"""
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DB = os.getenv('MONGODB_DB', 'alice_exam_proctor')

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')

def create_sample_data():
    try:
        client = MongoClient(MONGODB_URI)
        db = client[MONGODB_DB]
        
        # Clear existing data
        print('Clearing existing data...')
        db.users.delete_many({})
        db.quizzes.delete_many({})
        db.submissions.delete_many({})
        db.flags.delete_many({})
        
        # Create sample users
        print('\nCreating sample users...')
        password_hash = hash_password('password123')
        
        users = [
            {
                'name': 'Student One',
                'email': 'student1@example.com',
                'password': password_hash,
                'role': 'student'
            },
            {
                'name': 'Student Two',
                'email': 'student2@example.com',
                'password': password_hash,
                'role': 'student'
            },
            {
                'name': 'Teacher One',
                'email': 'teacher1@example.com',
                'password': password_hash,
                'role': 'teacher'
            },
            {
                'name': 'Teacher Two',
                'email': 'teacher2@example.com',
                'password': password_hash,
                'role': 'teacher'
            }
        ]
        
        result = db.users.insert_many(users)
        teacher_id = result.inserted_ids[2]
        print(f'✓ Created {len(users)} users')
        
        # Create sample quizzes
        print('\nCreating sample quizzes...')
        quizzes = [
            {
                'title': 'Python Basics Quiz',
                'description': 'Test your Python knowledge',
                'duration': 30,
                'code': 'PY101A',
                'teacher_id': teacher_id,
                'questions': [
                    {
                        'text': 'What is Python?',
                        'options': [
                            'A programming language',
                            'A snake',
                            'A framework',
                            'A database'
                        ],
                        'correctAnswer': 'A programming language'
                    },
                    {
                        'text': 'Which keyword is used to define a function in Python?',
                        'options': ['function', 'def', 'func', 'define'],
                        'correctAnswer': 'def'
                    }
                ]
            },
            {
                'title': 'JavaScript Fundamentals',
                'description': 'Test your JavaScript skills',
                'duration': 45,
                'code': 'JS101B',
                'teacher_id': teacher_id,
                'questions': [
                    {
                        'text': 'What does DOM stand for?',
                        'options': [
                            'Document Object Model',
                            'Data Object Model',
                            'Digital Object Model',
                            'Document Oriented Model'
                        ],
                        'correctAnswer': 'Document Object Model'
                    }
                ]
            }
        ]
        
        db.quizzes.insert_many(quizzes)
        print(f'✓ Created {len(quizzes)} quizzes')
        
        print('\n✓ Sample data created successfully!')
        print('\nDemo Credentials:')
        print('Students:')
        print('  - student1@example.com / password123')
        print('  - student2@example.com / password123')
        print('Teachers:')
        print('  - teacher1@example.com / password123')
        print('  - teacher2@example.com / password123')
        print('\nQuiz Codes:')
        print('  - PY101A (Python Basics)')
        print('  - JS101B (JavaScript Fundamentals)')
        
    except Exception as e:
        print(f'✗ Error creating sample data: {e}')
        sys.exit(1)

if __name__ == '__main__':
    create_sample_data()
