# Alice Exam Proctor — AI-Powered Online Proctoring System

A full-stack exam proctoring platform with real-time AI monitoring, violation detection, and role-based dashboards for students, teachers, and admins.

🌐 **Live Demo:** [https://alice-exam-proctor01.vercel.app](https://alice-exam-proctor01.vercel.app)
⚙️ **Backend API:** [https://alice-exam-proctor.onrender.com](https://alice-exam-proctor.onrender.com)

---

## Core Features

### Authentication & Users
- JWT-based auth with 7-day token expiry
- Google OAuth 2.0 sign-in / registration
- Role-based access control — Student, Teacher, Admin
- bcrypt password hashing
- Profile management (name, bio, department, avatar)

### AI Proctoring (Client-Side)
- Real-time face detection via `face-api.js`
- Multi-face detection — flags when more than one person is in frame
- Gaze tracking and head pose analysis
- Audio monitoring with risk level indicator
- Audio calibration modal for environment setup
- Violation events sent to backend via WebSocket in real-time

### Quiz / Exam System
- Teachers create quizzes with MCQ questions, duration, and descriptions
- Auto-generated unique 6-character join codes
- Students join exams via code entry
- Active/inactive toggle per quiz
- Timed exam interface with auto-submit on timeout
- Score calculation and proctoring report attached to each submission

### Real-Time Monitoring (WebSocket)
- `ProctoringConsumer` — per-quiz channel for violation streaming
- `TeacherMonitoringConsumer` — teacher subscribes to live violation feed
- Violations broadcast to all connected monitors instantly
- Ping/pong heartbeat support
- Backed by Django Channels + Redis

### Violation System
- Violations stored in MongoDB with type, severity, face count, timestamp, metadata
- Types: `MULTIPLE_FACES`, gaze deviation, audio anomaly, etc.
- Severity levels: low / medium / high
- Per-quiz and per-student violation queries
- Teacher can view violations per quiz with student breakdown
- Admin can view all violations across the platform

### Dashboards

**Student**
- Overview: upcoming exams, recent violations, performance summary
- My Exams — history of completed quizzes with scores
- Join Exam — enter quiz code to start
- Violations — personal violation log
- Profile & Settings

**Teacher**
- Dashboard stats — total quizzes, students, submissions, violations
- Exam management — create, edit, toggle active, delete quizzes
- Student management — view enrolled students and their details
- Live Monitoring — real-time violation feed via WebSocket
- Results — submission scores and proctoring reports
- Violations — per-quiz violation breakdown
- Performance charts via Recharts

**Super Admin**
- Platform-wide stats dashboard
- User management — list, activate/deactivate, role changes
- Exam management — view and act on all exams
- Violations management — full violation log
- Audit logs
- System settings

### Alice AI Assistant
- Built-in chat powered by Google Gemini 1.5 Flash
- Maintains last 5 messages as conversation context
- Falls back to demo mode if no API key is configured
- Accessible from within the platform UI

### UI / UX
- React 18 + Vite + Tailwind CSS
- Framer Motion animations
- Recharts for data visualization
- DiceBear avatars — unique per user, no image uploads needed
- Dark/light theme via ThemeContext
- Responsive layout with mobile bottom nav for student and teacher
- Toast notifications via react-hot-toast
- Lucide + React Icons icon sets

---

## Architecture

```
alice-exam-proctor/
├── src/                        # React frontend (Vite)
│   ├── pages/
│   │   ├── student/            # MyExams, ExamPage, Violations, Profile, Settings
│   │   ├── teacher/            # Exams, Students, LiveMonitoring, Results, Violations
│   │   └── admin/              # SuperAdminDashboard, UsersManagement, ExamsManagement, etc.
│   ├── components/
│   │   ├── exam/               # ProctorPanel, QuestionPanel, GazeWarning, AudioRiskIndicator, etc.
│   │   ├── student/            # Dashboard widgets, QuizInterface, QuizResult
│   │   ├── teacher/            # QuizCreator, ExamTable, FlagMonitor, LiveMonitorCard
│   │   ├── admin/              # StatCard, ViolationChart, LiveActivityFeed, SystemHealthMonitor
│   │   ├── ai/                 # AliceAIChat
│   │   └── common/             # ProtectedRoute, UserAvatar, PremiumFooter, SoundSettings
│   ├── contexts/               # AuthContext, ThemeContext
│   ├── hooks/                  # useViolationWebSocket
│   └── App.jsx                 # Route definitions with role-based ProtectedRoute
│
└── django_backend/             # Django + Channels backend
    ├── api/
    │   ├── models.py           # MongoDB collections: users, quizzes, submissions, flags, violations
    │   ├── authentication.py   # JWT encode/decode, bcrypt, require_auth / require_role decorators
    │   ├── consumers.py        # ProctoringConsumer, TeacherMonitoringConsumer (WebSocket)
    │   ├── routing.py          # WebSocket URL routing
    │   └── views/
    │       ├── auth.py         # register, login, google_auth, get_current_user, update_profile
    │       ├── quiz.py         # CRUD, toggle-active, submit, get-by-code
    │       ├── violation.py    # create, list, stats, per-student breakdown
    │       ├── flag.py         # create, list, update status
    │       ├── ai.py           # Gemini chat endpoint
    │       ├── stats.py        # Teacher dashboard & performance stats
    │       ├── students.py     # Teacher student list & details
    │       ├── student_dashboard.py
    │       ├── admin_api.py    # Admin CRUD for users, exams, violations, audit logs
    │       └── contact.py      # Email via SMTP
    └── exam_proctoring/
        ├── settings.py         # Django config, MongoDB, Redis, CORS, security headers
        ├── asgi.py             # ASGI entry point for Daphne + Channels
        └── urls.py             # Root URL config
```

### Data Flow

```
Student Browser
  │
  ├── REST (Axios) ──────────────► Django REST API ──► MongoDB
  │                                                        (users, quizzes, submissions, violations)
  │
  └── WebSocket ─────────────────► Django Channels ──► Redis Channel Layer
                                        │
                                        └── Broadcast ──► Teacher Browser (live monitoring)
```

### Key Design Decisions
- MongoDB via PyMongo (no ORM) — flexible schema for proctoring metadata
- SQLite kept only for Django admin session/auth tables
- Redis as the channel layer for WebSocket group messaging
- All AI/ML runs client-side (face-api.js) — no video sent to server
- JWT stored client-side, validated per-request via `require_auth` / `require_role` decorators

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios |
| Styling | Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Backend | Django 4.2, Django REST Framework |
| Real-time | Django Channels, Daphne, Redis |
| Database | MongoDB (PyMongo) + SQLite (Django admin) |
| Auth | JWT (PyJWT), bcrypt, Google OAuth 2.0 |
| AI/ML | face-api.js (client), Google Gemini 1.5 Flash (server) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Local Setup

### Backend
```bash
cd django_backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
copy .env.example .env       # fill in your values
python init_database.py
python create_sample_data.py
daphne -b 0.0.0.0 -p 8000 exam_proctoring.asgi:application
```

### Frontend
```bash
npm install
npm run dev
```

### Environment Variables

**Frontend (`.env.local`)**
```
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (`django_backend/.env`)**
```
SECRET_KEY=your_secret_key
DEBUG=True
MONGODB_URI=your_mongodb_uri
MONGODB_DB=alice_exam_proctor
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | student1@example.com | password123 |
| Teacher | teacher1@example.com | password123 |

Or use **Continue with Google** on the auth page.

---

## Author

**Aditya Singh Rajput** — opg21139@gmail.com

Made with ❤️ by the Alice Team
