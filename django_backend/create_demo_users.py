from dotenv import load_dotenv
import os
load_dotenv('.env')
from pymongo import MongoClient
import bcrypt

client = MongoClient(os.getenv('MONGODB_URI'))
db = client[os.getenv('MONGODB_DB')]
users = db['users']

def hash_pw(pw):
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')

demo_users = [
    {'name': 'Demo Student', 'email': 'student1@example.com', 'role': 'student'},
    {'name': 'Demo Teacher', 'email': 'teacher1@example.com', 'role': 'teacher'},
    {'name': 'Demo Admin',   'email': 'admin@example.com',    'role': 'admin'},
]

for u in demo_users:
    email = u['email']
    existing = users.find_one({'email': email})
    if existing:
        print('Already exists:', email)
    else:
        doc = {
            'name': u['name'],
            'email': email,
            'password': hash_pw('password123'),
            'role': u['role'],
            'phone': None, 'location': None, 'bio': None,
            'date_of_birth': None, 'department': None,
            'profile_picture': None, 'created_at': None
        }
        users.insert_one(doc)
        print('Created:', email, '(' + u['role'] + ')')
