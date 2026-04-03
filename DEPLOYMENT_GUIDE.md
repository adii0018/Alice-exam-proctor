# 🚀 Deployment Guide - Alice Exam Proctor

## 📋 Quick Setup Checklist

### 1️⃣ Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project or create new one
3. Click on your OAuth 2.0 Client ID
4. Add these URLs:

**Authorized JavaScript origins:**
```
https://alice-exam-proctor01.vercel.app
https://alice-exam-proctor.onrender.com
http://localhost:5174
```

**Authorized redirect URIs:**
```
https://alice-exam-proctor01.vercel.app
https://alice-exam-proctor01.vercel.app/auth
https://alice-exam-proctor.onrender.com
http://localhost:5174
```

---

### 2️⃣ Backend Deployment (Railway/Render)

**Environment Variables to Set:**

```bash
# Core Settings
SECRET_KEY=8d59f0ea88be809b699ac86b5785a2bcfe08eac8e6b125058e561c9168388ee6891181e38a4ffebdcd9e034790bef7c8c96a
DEBUG=False

# Hosts & CORS
ALLOWED_HOSTS=alice-exam-proctor.onrender.com,alice-exam-proctor01.vercel.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://alice-exam-proctor01.vercel.app,http://localhost:5174
CSRF_TRUSTED_ORIGINS=https://alice-exam-proctor01.vercel.app,https://alice-exam-proctor.onrender.com

# Database
MONGODB_URI=mongodb+srv://singhrajputaditya982_db_user:adii001@adii.3y2zwkw.mongodb.net/alice_exam_proctor?retryWrites=true&w=majority&appName=ADII
MONGODB_DB=alice_exam_proctor

# Redis (Get from Railway/Render Redis addon)
REDIS_URL=redis://your-redis-url:6379

# Email
EMAIL_HOST_USER=opg21139@gmail.com
EMAIL_HOST_PASSWORD=jntd ylix yasf eyue

# Google OAuth
GOOGLE_CLIENT_ID=747022156815-9q3rhol4q46e9livqnefh37ksbt35phd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# AI
GEMINI_API_KEY=AIzaSyBSOxSyymLuGfUakN2eT3o67YzufYOlgfc
```

---

### 3️⃣ Frontend Deployment (Vercel)

**Environment Variables to Set in Vercel Dashboard:**

```bash
VITE_API_URL=https://alice-exam-proctor.onrender.com/api
VITE_WS_URL=wss://alice-exam-proctor.onrender.com/ws
VITE_GOOGLE_CLIENT_ID=747022156815-9q3rhol4q46e9livqnefh37ksbt35phd.apps.googleusercontent.com
```

---

### 4️⃣ Testing Google Login

1. Open browser console (F12)
2. Go to your deployed site
3. Click "Continue with Google"
4. Check Network tab for any errors
5. Check Console tab for error messages

**Common Issues:**

❌ **"Google sign in failed"**
- Check if backend URL is correct in Vercel env vars
- Verify Google OAuth URLs are added in Google Console
- Check CORS settings in backend

❌ **"redirect_uri_mismatch"**
- Add your frontend URL to Google Console Authorized redirect URIs

❌ **"Invalid token"**
- Check if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET match in both frontend and backend

---

### 5️⃣ Platform-Specific Instructions

#### Railway Deployment:
1. Connect your GitHub repo
2. Add Redis plugin from Railway marketplace
3. Copy Redis URL to REDIS_URL env var
4. Deploy!

#### Render Deployment:
1. Create new Web Service
2. Add Redis from Render dashboard
3. Copy Redis internal URL to REDIS_URL
4. Deploy!

---

### 🔍 Debugging Tips

**Check Backend Logs:**
```bash
# Railway
railway logs

# Render
Check logs in Render dashboard
```

**Test API Endpoint:**
```bash
curl https://alice-exam-proctor.onrender.com/api/auth/google/
```

**Check if backend is running:**
```bash
curl https://alice-exam-proctor.onrender.com/
```

---

### 📞 Need Help?

If Google login still not working:
1. Share the exact error message from browser console
2. Share backend logs
3. Verify all URLs are correct (no typos!)

---

## ✅ Final Checklist

- [ ] Google OAuth URLs added in Google Console
- [ ] Backend deployed with all env vars
- [ ] Frontend deployed with correct backend URL
- [ ] Redis configured and running
- [ ] MongoDB connection working
- [ ] CORS settings correct
- [ ] Tested Google login on deployed site

---

**Last Updated:** April 2026
