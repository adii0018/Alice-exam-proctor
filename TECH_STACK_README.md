# Tech Stack & Languages Used 🚀

Bhai, is project (Alice Exam Proctor) mein humne yeh saari technologies aur languages use ki hain. Niche sabki detail aur unka kaam likha hai:

## 🌐 Frontend (Client Side)
Yeh part user ko dikhta hai aur browser par run hota hai.

1. **React.js (JavaScript/JSX)**
   - **Kaam:** User Interface (UI) banane ke liye. Yeh frontend ka core framework hai jo single-page application (SPA) banata hai.
2. **Vite**
   - **Kaam:** Fast development server aur build tool. Yeh React app ko bahut tezi se load aur build karne mein madad karta hai.
3. **Tailwind CSS**
   - **Kaam:** UI ko style aur design karne ke liye. Isse hum directly HTML (JSX) classes mein likh kar jaldi responsive design banate hain.
4. **Redux Toolkit**
   - **Kaam:** Global state management ke liye. Jaise ki user login hai ya nahi, aur uska data pure app mein access karne ke liye.
5. **React Router DOM**
   - **Kaam:** App mein alag-alag pages (Exams, Dashboard, Results, etc.) ke bich navigation ke liye bina page reload kiye.
6. **Framer Motion**
   - **Kaam:** UI elements mein smooth animations aur transitions dalne ke liye.
7. **Recharts**
   - **Kaam:** Student ke dashboard par results aur performance ke graphs/charts dikhane ke liye.
8. **React OAuth Google**
   - **Kaam:** Google account ke through direct Login/Signup (Single Sign-On) karwane ke liye.

---

## ⚙️ Backend (Server Side)
Yeh part server par run hota hai, database handle karta hai aur frontend ko APIs ke through data deta hai.

1. **Python**
   - **Kaam:** Backend ki primary programming language.
2. **Django**
   - **Kaam:** Python ka powerful web framework jo backend ka core structure, database connections aur admin panel handle karta hai.
3. **Django REST Framework (DRF)**
   - **Kaam:** RESTful APIs banane ke liye. Frontend (React) inhi APIs ko call karke backend se data (users, exams, etc.) leta aur bhejta hai.
4. **Django Channels, Redis & Daphne**
   - **Kaam:** Real-time WebSockets implement karne ke liye. Iska use live proctoring (student par exam ke time live nazar rakhna) aur real-time warnings bhejne ke liye hota hai.
5. **MongoDB (PyMongo) & SQLite**
   - **Kaam:** Data store karne ke liye database. Exams ke questions, user profiles, aur proctoring logs sab yahi save hote hain.
6. **JWT (JSON Web Tokens) (PyJWT)**
   - **Kaam:** Authentication aur security ke liye. Jab user login karta hai toh usko ek token milta hai jisse wo secure APIs access kar pata hai.
7. **Google Generative AI (Gemini API)**
   - **Kaam:** Artificial Intelligence (AI) features ke liye. Exam ke dauran student ki activity ko automatically analyze karne (AI Proctoring) ke liye.

---

## 🛠️ Tools & Deployment
1. **Axios**
   - **Kaam:** Frontend se backend (Django) ki APIs ko HTTP requests (GET, POST, etc.) bhejne ke liye.
2. **Nixpacks / Render / Vercel configurations**
   - **Kaam:** App ko internet par live host/deploy karne ke liye (Production environment).

**In short:** React + Tailwind ne sundar aur fast Frontend banaya, aur Python + Django + WebSockets ne secure aur real-time Backend handle kiya!
