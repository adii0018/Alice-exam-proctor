# Alice Exam Proctor - Backend

Django REST API backend for the Alice Exam Proctor platform.

## Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
copy .env.example .env
```

Edit `.env` and configure your settings:
- MongoDB connection
- Secret key
- Groq API key (optional, for Alice AI)

### 5. Initialize Database
```bash
python init_database.py
```

### 6. Create Sample Data
```bash
python create_sample_data.py
```

### 7. Run Server
```bash
python manage.py runserver
```

Server will run on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user

### Quizzes
- `GET /api/quizzes/` - List all quizzes
- `POST /api/quizzes/create/` - Create quiz (teacher only)
- `GET /api/quizzes/by-code/:code/` - Get quiz by code
- `GET /api/quizzes/:id/` - Get quiz by ID
- `POST /api/quizzes/:id/submit/` - Submit quiz answers
- `DELETE /api/quizzes/:id/delete/` - Delete quiz (teacher only)

### Flags
- `GET /api/flags/` - List all violation flags
- `POST /api/flags/create/` - Create violation flag
- `PUT /api/flags/:id/update/` - Update flag status

### AI
- `POST /api/ai/chat/` - Chat with Alice AI

## Demo Credentials

### Students
- student1@example.com / password123
- student2@example.com / password123

### Teachers
- teacher1@example.com / password123
- teacher2@example.com / password123

## Quiz Codes
- PY101A - Python Basics Quiz
- JS101B - JavaScript Fundamentals
