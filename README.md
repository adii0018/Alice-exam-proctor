<div align="center">

<img src="https://api.dicebear.com/7.x/bottts/svg?seed=alice&backgroundColor=0f172a" width="120" height="120" alt="Alice Logo"/>

# 🍃 Alice Exam Proctor

### *Intelligent Online Proctoring — Powered by AI*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-alice--exam--proctor01.vercel.app-22c55e?style=for-the-badge&logoColor=white)](https://alice-exam-proctor01.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-6366f1?style=for-the-badge&logoColor=white)](https://alice-exam-proctor.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

<br/>

> **Alice** is a full-stack AI-powered exam proctoring platform that monitors students in real-time using facial recognition, gaze tracking, and head pose analysis — ensuring exam integrity without compromising on user experience.

<br/>

---

</div>

## 📸 Preview

> 🔗 **Try it live →** [alice-exam-proctor01.vercel.app](https://alice-exam-proctor01.vercel.app)

| Role | Email | Password |
|------|-------|----------|
| 🎓 Student | `student1@example.com` | `password123` |
| 👨‍🏫 Teacher | `teacher1@example.com` | `password123` |

> Or just hit **"Continue with Google"** — no setup needed!

---

## ✨ Features at a Glance

### 🔐 Authentication & Roles
- **Role-based Access** — Separate portals for Students, Teachers, and Admins
- **Google OAuth** — One-click sign in via Google
- **JWT Secured** — Stateless, secure token-based auth

### 🤖 AI Proctoring Engine
- **Real-time Face Detection** — Powered by `face-api.js`
- **Gaze Tracking** — Detects if student looks away from screen
- **Head Pose Analysis** — Flags suspicious head movements
- **Multi-Face Detection** — Alerts when multiple people are in frame
- **Violation Logging** — Full audit trail stored in MongoDB

### 📡 Live Monitoring Dashboard
- **WebSocket Integration** — Real-time feed via Django Channels + Redis
- **Teacher Dashboard** — Monitor all students simultaneously, live
- **Instant Alerts** — Violations flagged and logged in real-time

### 🧠 Alice AI Assistant
- **Built-in Chatbot** — Powered by Google Gemini
- **Context-aware** — Helps students & teachers navigate the platform

### 📝 Quiz Management
- **Create & Schedule Exams** — Full CRUD for teachers
- **Conduct Exams Online** — Clean, distraction-free exam UI for students
- **Results & Analytics** — Post-exam summaries and violation reports

### 🎨 Dynamic Avatar System
- **DiceBear Integration** — Unique avatars auto-generated per user
- **10+ Styles** — Robots, cartoons, pixel art, illustrated characters
- **Zero Storage** — Generated on-the-fly, no uploads needed
- **Consistent** — Same username always generates the same avatar

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Axios |
| **Backend** | Django 4.2, Django REST Framework, Django Channels |
| **Database** | MongoDB (via PyMongo) |
| **Auth** | JWT + Google OAuth 2.0 |
| **AI / ML** | face-api.js, OpenCV.js, Google Gemini |
| **Real-time** | WebSockets via Django Channels + Redis |
| **Avatars** | DiceBear API |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

---

## 🚀 Local Setup

### Prerequisites

Make sure you have these installed:
- **Python** 3.10+
- **Node.js** 18+
- **Redis** (for WebSocket support)
- **MongoDB** URI (Atlas free tier works)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/alice-exam-proctor.git
cd alice-exam-proctor
```

---

### 2️⃣ Backend Setup (Django)

```bash
cd django_backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
copy .env.example .env        # Windows
cp .env.example .env          # macOS / Linux

# Initialize database and seed sample data
python init_database.py
python create_sample_data.py

# Start the server (with WebSocket support via Daphne)
daphne -b 0.0.0.0 -p 8000 exam_proctoring.asgi:application
```

---

### 3️⃣ Frontend Setup (React)

```bash
# From project root
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

### 4️⃣ Environment Variables

**`frontend/.env.local`**
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**`django_backend/.env`**
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
MONGODB_URI=your_mongodb_connection_uri
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> 💡 **Tip:** Get a free MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and a Gemini key from [Google AI Studio](https://aistudio.google.com/).

---

## 🎨 Avatar System — Usage

Alice uses [DiceBear](https://dicebear.com) for auto-generated, consistent user avatars.

```jsx
import UserAvatar from './components/common/UserAvatar';
import { AVATAR_STYLES } from './utils/avatarGenerator';

<UserAvatar 
  user={user} 
  size={64} 
  style={AVATAR_STYLES.BOTTTS}
  showBorder={true}
/>
```

**Available Styles:**

| Style | Description |
|-------|-------------|
| `INITIALS` | Text-based initials (default fallback) |
| `LORELEI` | Illustrated storybook characters |
| `AVATAAARS` | Cartoon / comic style |
| `BOTTTS` | Cute robot avatars |
| `PIXEL_ART` | Retro 8-bit art |
| `ADVENTURER` | Adventure game characters |

> Visit `/avatar-showcase` route to see all styles in action!

---

## 🗂️ Project Structure

```
alice-exam-proctor/
├── django_backend/
│   ├── exam_proctoring/       # Django project config
│   ├── api/                   # REST API views & serializers
│   ├── consumers/             # WebSocket consumers
│   ├── models/                # MongoDB models
│   ├── init_database.py
│   ├── create_sample_data.py
│   └── requirements.txt
│
├── src/
│   ├── components/
│   │   ├── common/            # Shared UI components (Avatar, Navbar, etc.)
│   │   ├── student/           # Student portal components
│   │   ├── teacher/           # Teacher dashboard components
│   │   └── admin/             # Admin panel components
│   ├── pages/                 # Route-level page components
│   ├── utils/                 # Helper functions (avatarGenerator, etc.)
│   └── main.jsx
│
├── .env.local.example
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### 👤 Author

**Aditya Singh Rajput**

[![Email](https://img.shields.io/badge/Email-opg21139@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:opg21139@gmail.com)

<br/>

*Made with ❤️ by the Alice Team*

<br/>

⭐ **Star this repo if you found it useful!** ⭐

</div>
