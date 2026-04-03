# ✅ Backend Environment Variables Checklist

Render dashboard mein ye sab variables hone chahiye:

## Required Variables:

1. ✅ **SECRET_KEY**
   - Value: `8d59f0ea88be809b699ac86b5785a2bcfe08eac8e6b125058e561c9168388ee6891181e38a4ffebdcd9e034790bef7c8c96a`

2. ✅ **DEBUG**
   - Value: `False`

3. ✅ **ALLOWED_HOSTS**
   - Value: `alice-exam-proctor.onrender.com,alice-exam-proctor01.vercel.app,localhost,127.0.0.1`

4. ✅ **CORS_ALLOWED_ORIGINS**
   - Value: `https://alice-exam-proctor01.vercel.app,http://localhost:5174,http://127.0.0.1:5174`

5. ✅ **CSRF_TRUSTED_ORIGINS**
   - Value: `https://alice-exam-proctor01.vercel.app,https://alice-exam-proctor.onrender.com`

6. ✅ **MONGODB_URI**
   - Value: `mongodb+srv://singhrajputaditya982_db_user:adii001@adii.3y2zwkw.mongodb.net/alice_exam_proctor?retryWrites=true&w=majority&appName=ADII`

7. ✅ **MONGODB_DB**
   - Value: `alice_exam_proctor`

8. ✅ **REDIS_URL**
   - Value: `redis://localhost:6379` (or your Render Redis URL)

9. ✅ **EMAIL_HOST_USER**
   - Value: `opg21139@gmail.com`

10. ✅ **EMAIL_HOST_PASSWORD**
    - Value: `your_email_app_password_here`

11. ✅ **GOOGLE_CLIENT_ID**
    - Value: `your_google_client_id_here`

12. ✅ **GOOGLE_CLIENT_SECRET**
    - Value: `your_google_client_secret_here`

13. ✅ **GEMINI_API_KEY**
    - Value: `your_gemini_api_key_here`

---

## 🔴 MOST IMPORTANT - Google Console Setup:

Backend variables toh ready hain, but **Google Console mein URLs add karna MUST hai!**

### Go to: https://console.cloud.google.com/apis/credentials

1. Click on your OAuth Client ID
2. Add these to "Authorized JavaScript origins":
   - `https://alice-exam-proctor01.vercel.app`
   - `https://alice-exam-proctor.onrender.com`

3. Add these to "Authorized redirect URIs":
   - `https://alice-exam-proctor01.vercel.app`
   - `https://alice-exam-proctor.onrender.com`

4. Click SAVE

---

## 🟢 After Setup - Test Commands:

### Test if backend is running:
```bash
curl https://alice-exam-proctor.onrender.com/
```

### Test Google auth endpoint:
```bash
curl https://alice-exam-proctor.onrender.com/api/auth/google/
```

### Check Render logs:
Go to Render dashboard → Your service → Logs tab

---

## 🐛 Common Issues:

### Issue 1: "redirect_uri_mismatch"
**Solution:** Add URLs to Google Console (step above)

### Issue 2: "Google sign in failed"
**Solution:** 
- Check Vercel env vars are set
- Check backend is running
- Check browser console for exact error

### Issue 3: "CORS error"
**Solution:** 
- Verify CORS_ALLOWED_ORIGINS in Render
- Should include: `https://alice-exam-proctor01.vercel.app`

---

## 📞 Still Not Working?

Share these with me:
1. Browser console error (F12 → Console tab)
2. Network tab error (F12 → Network tab → Click on failed request)
3. Render backend logs
