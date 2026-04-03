# 🧪 Google Login Testing Guide

## ✅ Backend Code Status:
- ✅ Google OAuth endpoint exists: `/api/auth/google/`
- ✅ User model has proper create/find methods
- ✅ MongoDB connection configured
- ✅ Token generation working
- ✅ User data storage implemented

## 🔍 What Happens When User Clicks "Continue with Google":

### Step 1: Frontend (React)
```javascript
// LoginForm.jsx calls useGoogleLogin
handleGoogleLogin() 
  → Gets access_token from Google
  → Calls googleLogin(access_token, 'student')
```

### Step 2: AuthContext
```javascript
// AuthContext.jsx
googleLogin(accessToken, role)
  → POST to /auth/google/
  → Sends: { credential: accessToken, role: 'student' }
```

### Step 3: Backend (Django)
```python
# auth.py - google_auth()
1. Receives access_token
2. Calls Google API: https://www.googleapis.com/oauth2/v3/userinfo
3. Gets user info (email, name)
4. Checks if user exists in MongoDB
5. If not exists → Creates new user
6. Generates JWT token
7. Returns: { token, user }
```

### Step 4: Frontend Stores Data
```javascript
// AuthContext.jsx
1. Saves token to localStorage
2. Saves user to localStorage
3. Sets Authorization header
4. Redirects to dashboard
```

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Google sign in failed" (Generic Error)

**Possible Causes:**
1. ❌ Google Console URLs not added
2. ❌ Backend not receiving request (CORS)
3. ❌ MongoDB connection failed
4. ❌ Invalid access token

**Debug Steps:**
```javascript
// Open browser console (F12) and check:
1. Network tab → Click on "google" request
2. Check Request URL: Should be https://alice-exam-proctor.onrender.com/api/auth/google/
3. Check Request Payload: Should have "credential" and "role"
4. Check Response: What error message?
```

---

### Issue 2: "redirect_uri_mismatch"

**Solution:**
Go to Google Console and add:
- `https://alice-exam-proctor01.vercel.app`
- `https://alice-exam-proctor.onrender.com`

---

### Issue 3: "Invalid Google token" (401)

**Possible Causes:**
1. Backend can't reach Google API
2. Access token expired
3. Network issue on Render

**Test Backend Manually:**
```bash
# Test if backend can reach Google API
curl -X POST https://alice-exam-proctor.onrender.com/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{"credential":"test_token","role":"student"}'

# Should return error about invalid token (which is expected)
# If it returns CORS error or 404, then routing issue
```

---

### Issue 4: MongoDB Connection Failed

**Check Render Logs:**
1. Go to Render Dashboard
2. Click on your service
3. Check "Logs" tab
4. Look for MongoDB connection errors

**Test MongoDB Connection:**
Your MongoDB URI is:
```
mongodb+srv://singhrajputaditya982_db_user:adii001@adii.3y2zwkw.mongodb.net/alice_exam_proctor
```

Make sure:
- ✅ MongoDB Atlas cluster is running
- ✅ IP whitelist includes 0.0.0.0/0 (allow all)
- ✅ Database user has read/write permissions

---

## 🧪 Manual Testing Steps:

### Test 1: Check if Backend is Running
```bash
curl https://alice-exam-proctor.onrender.com/
```
**Expected:** Some response (not 404)

### Test 2: Check Google Auth Endpoint
```bash
curl -X POST https://alice-exam-proctor.onrender.com/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{"credential":"fake_token","role":"student"}'
```
**Expected:** `{"error": "Invalid Google token"}` (401)
**Bad:** 404 or CORS error

### Test 3: Check MongoDB Connection
```bash
# In Render logs, you should see:
# "Connected to MongoDB" or similar
# No "MongoServerError" or connection timeouts
```

### Test 4: Frontend Environment Variables
```javascript
// Open browser console on your Vercel site
console.log(import.meta.env.VITE_API_URL)
// Should print: https://alice-exam-proctor.onrender.com/api

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
// Should print: 747022156815-9q3rhol4q46e9livqnefh37ksbt35phd.apps.googleusercontent.com
```

---

## 📋 Final Checklist:

### Google Console:
- [ ] OAuth Client ID created
- [ ] Authorized JavaScript origins added:
  - [ ] `https://alice-exam-proctor01.vercel.app`
  - [ ] `https://alice-exam-proctor.onrender.com`
- [ ] Authorized redirect URIs added (same as above)

### Render Backend:
- [ ] All environment variables set (13 total)
- [ ] Service is running (not crashed)
- [ ] Logs show no MongoDB errors
- [ ] CORS_ALLOWED_ORIGINS includes Vercel URL

### Vercel Frontend:
- [ ] 3 environment variables set
- [ ] Redeployed after adding variables
- [ ] Site loads without errors

### MongoDB Atlas:
- [ ] Cluster is running
- [ ] IP whitelist: 0.0.0.0/0
- [ ] Database user has permissions

---

## 🚨 If Still Not Working:

**Share these with me:**

1. **Browser Console Error:**
   - F12 → Console tab
   - Copy exact error message

2. **Network Request Details:**
   - F12 → Network tab
   - Click on failed "google" request
   - Copy Request URL, Status Code, Response

3. **Render Backend Logs:**
   - Last 50 lines from Render logs
   - Any errors or warnings

4. **Verify Environment Variables:**
   - Screenshot of Vercel env vars (hide sensitive values)
   - Confirm Render env vars are set

---

## 💡 Quick Fix Attempts:

### Fix 1: Clear Browser Cache
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh page
```

### Fix 2: Redeploy Both Services
1. Render: Manual Deploy → Deploy latest commit
2. Vercel: Deployments → Redeploy

### Fix 3: Test with Different Browser
- Try Chrome Incognito
- Try Firefox Private Window
- Disable browser extensions

---

**Last Updated:** April 2026
