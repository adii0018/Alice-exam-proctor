<div align="center">

```
 █████╗ ██╗     ██╗ ██████╗███████╗
██╔══██╗██║     ██║██╔════╝██╔════╝
███████║██║     ██║██║     █████╗  
██╔══██║██║     ██║██║     ██╔══╝  
██║  ██║███████╗██║╚██████╗███████╗
╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝╚══════╝
```

# 🎓 Alice Exam Proctor

### *AI-Powered Online Proctoring — Real-time. Intelligent. Unstoppable.*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-6366f1?style=for-the-badge)](https://alice-exam-proctor01.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-10b981?style=for-the-badge)](https://alice-exam-proctor.onrender.com)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django_4.2-092E20?style=flat-square&logo=django&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-000000?style=flat-square&logo=socket.io&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

<br/>

> **Alice** is a full-stack exam proctoring platform with real-time AI monitoring, WebSocket-powered violation detection, and role-based dashboards for Students, Teachers, and Admins — with **zero video sent to the server**.

<br/>

</div>

---

## ✨ Features at a Glance

| | Feature | Description |
|---|---|---|
| 🤖 | **AI Proctoring** | Real-time face detection, gaze tracking, head pose analysis — all client-side |
| 👥 | **Multi-face Detection** | Instantly flags when more than one person is in frame |
| 🎙️ | **Audio Monitoring** | Live risk-level indicator + calibration modal |
| 📡 | **WebSocket Streaming** | Violations broadcast to teachers in real-time via Django Channels + Redis |
| 🔑 | **Join Codes** | Auto-generated unique 6-character exam codes |
| ⏱️ | **Auto-submit** | Timed exams submit automatically on timeout |
| 🚨 | **Violation System** | `low` / `medium` / `high` severity, per-student breakdown |
| 🤖 | **Alice AI Chat** | Built-in assistant powered by Google Gemini 1.5 Flash |
| 🌙 | **Dark / Light Theme** | Full theme support via `ThemeContext` |
| 📱 | **Responsive** | Mobile bottom nav for student & teacher views |

---

## 🎭 Role-Based Dashboards

<details>
<summary><b>🧑‍🎓 Student Dashboard</b> — click to expand</summary>

<br/>

| Section | What you get |
|---|---|
| 🏠 Overview | Upcoming exams, recent violations, performance summary |
| 📚 My Exams | History of all completed quizzes with scores |
| 🔑 Join Exam | Enter quiz code to enter an exam |
| ⚠️ Violations | Full personal violation log |
| 👤 Profile | Manage name, bio, department, avatar |

</details>

<details>
<summary><b>👨‍🏫 Teacher Dashboard</b> — click to expand</summary>

<br/>

| Section | What you get |
|---|---|
| 📊 Stats | Total quizzes, students, submissions, violations at a glance |
| 📝 Exam Management | Create, edit, toggle active/inactive, delete quizzes |
| 👥 Student Management | View enrolled students and their details |
| 🔴 Live Monitoring | Real-time WebSocket violation feed per exam |
| 📈 Results | Submission scores + attached proctoring reports |
| ⚠️ Violations | Per-quiz violation breakdown with Recharts charts |

</details>

<details>
<summary><b>🛡️ Super Admin Dashboard</b> — click to expand</summary>

<br/>

| Section | What you get |
|---|---|
| 📊 Platform Stats | Bird's-eye view of all activity across the platform |
| 👥 User Management | List, activate/deactivate accounts, change roles |
| 📝 Exam Management | View and act on every exam on the platform |
| ⚠️ Violations | Complete platform-wide violation log |
| 🗒️ Audit Logs | Full history of admin actions |
| ⚙️ System Settings | Configure platform-level behavior |

</details>

---

## 🏗️ Architecture

### Data Flow

```
Student Browser
     │
     ├── REST (Axios) ──────────────► Django REST API ──► MongoDB
     │                                                    (users, quizzes,
     │                                                     submissions, violations)
     │
     └── WebSocket ─────────────────► Django Channels ──► Redis Channel Layer
                                            │
                                            └── Broadcast ──► Teacher Browser
                                                              (live monitoring)
```

### Project Structure

```
alice-exam-proctor/
├── src/                              ⚛️  React Frontend (Vite)
│   ├── pages/
│   │   ├── student/                  MyExams, ExamPage, Violations, Profile
│   │   ├── teacher/                  Exams, Students, LiveMonitoring, Results
│   │   └── admin/                    SuperAdminDashboard, UsersManagement
│   ├── components/
│   │   ├── exam/                     ProctorPanel, QuestionPanel, GazeWarning
│   │   ├── student/                  Dashboard widgets, QuizInterface, QuizResult
│   │   ├── teacher/                  QuizCreator, ExamTable, FlagMonitor
│   │   ├── admin/                    StatCard, ViolationChart, LiveActivityFeed
│   │   ├── ai/                       AliceAIChat
│   │   └── common/                   ProtectedRoute, UserAvatar, PremiumFooter
│   ├── contexts/                     AuthContext, ThemeContext
│   ├── hooks/                        useViolationWebSocket
│   └── App.jsx                       Routes with role-based ProtectedRoute
│
└── django_backend/                   🐍 Django + Channels Backend
    ├── api/
    │   ├── models.py                 MongoDB: users, quizzes, submissions, violations
    │   ├── authentication.py         JWT, bcrypt, require_auth / require_role
    │   ├── consumers.py              ProctoringConsumer, TeacherMonitoringConsumer
    │   ├── routing.py                WebSocket URL routing
    │   └── views/
    │       ├── auth.py               register, login, google_auth, update_profile
    │       ├── quiz.py               CRUD, toggle-active, submit, get-by-code
    │       ├── violation.py          create, list, stats, per-student breakdown
    │       ├── ai.py                 Gemini chat endpoint
    │       └── admin_api.py          Admin CRUD + audit logs
    └── exam_proctoring/
        ├── settings.py               MongoDB, Redis, CORS, security headers
        ├── asgi.py                   ASGI entry — Daphne + Channels
        └── urls.py                   Root URL config
```

### 🧩 Key Design Decisions

| Decision | Reason |
|---|---|
| **MongoDB via PyMongo** (no ORM) | Flexible schema for proctoring metadata |
| **SQLite** retained | Django admin session & auth tables only |
| **Redis** as channel layer | WebSocket group messaging at scale |
| **All AI/ML runs client-side** | Zero video ever sent to server — privacy first |
| **JWT stored client-side** | Validated per-request via `require_auth` / `require_role` decorators |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ **Frontend** | React 18, Vite, React Router v6, Axios |
| 🎨 **Styling** | Tailwind CSS, Framer Motion |
| 📊 **Charts** | Recharts |
| 🐍 **Backend** | Django 4.2, Django REST Framework |
| 📡 **Real-time** | Django Channels, Daphne, Redis |
| 🗄️ **Database** | MongoDB (PyMongo) + SQLite (Django admin) |
| 🔐 **Auth** | JWT (PyJWT), bcrypt, Google OAuth 2.0 |
| 🤖 **AI / ML** | face-api.js (client), Google Gemini 1.5 Flash (server) |
| 🚀 **Deployment** | Vercel (frontend), Render (backend) |

---

## ⚡ Local Setup

### 🐍 Backend

```bash
cd django_backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install dependencies and initialize
pip install -r requirements.txt
copy .env.example .env       # Fill in your values
python init_database.py
python create_sample_data.py

# Start the server
daphne -b 0.0.0.0 -p 8000 exam_proctoring.asgi:application
```

### ⚛️ Frontend

```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Frontend — `.env.local`

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend — `django_backend/.env`

```env
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

## 🎮 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 🧑‍🎓 Student | `student1@example.com` | `password123` |
| 👨‍🏫 Teacher | `teacher1@example.com` | `password123` |

> 💡 Or use **Continue with Google** on the auth page — no setup needed!

---

## 🔐 Auth & Security

- 🔒 **JWT-based auth** with 7-day token expiry
- 🌐 **Google OAuth 2.0** sign-in & registration
- 🛡️ **Role-based access control** — Student / Teacher / Admin
- 🔑 **bcrypt** password hashing
- 👤 **DiceBear avatars** — unique per user, no image uploads needed

---

<div align="center">

## 👨‍💻 Author

**Aditya Singh Rajput**

[![Gmail](https://img.shields.io/badge/Gmail-opg21139@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:opg21139@gmail.com)

<br/>

Made with ❤️ by the **Alice Team**

<br/>

⭐ **If this project helped you or you found it interesting, please drop a star — it really helps!** ⭐

</div>
