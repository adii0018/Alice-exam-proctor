# Quick Fix Reference - Exam Submission Issues

## 🚨 Common Errors & Instant Solutions

### Error: "Unauthorized" / "Unauthenticated"

**Quick Fix:**
```bash
# Check user roles
cd django_backend
python check_user_role.py
```

**Browser Fix:**
```javascript
// Open Console (F12) and run:
localStorage.clear()
// Then login again
```

---

### Error: "Session expired"

**Solution:** Just logout and login again
- Token expires after 7 days
- New login = new token

---

### Error: "Only students can submit exams"

**Check your role:**
```javascript
// In browser console (F12):
JSON.parse(localStorage.getItem('user')).role
// Should return: "student"
```

**Fix:** Login with student account, not teacher account

---

### Error: "This quiz is not active"

**Solution:** Ask teacher to activate the quiz
- Teacher Dashboard → Exams → Toggle Active

---

### Error: "Aapne yeh quiz pehle se submit kar diya hai"

**Reason:** One attempt per student (by design)
**Solution:** Cannot resubmit. Contact teacher if needed.

---

## 🔧 Diagnostic Commands

### Check Everything
```bash
cd django_backend
python verify_auth_setup.py
```

### Check Specific User
```bash
cd django_backend
python manage.py shell
```
```python
from api.models import users_collection
user = users_collection.find_one({'email': 'student@example.com'})
print(f"Role: {user['role']}")
```

### Fix All Role Issues
```bash
cd django_backend
python check_user_role.py
```

---

## 🎯 Prevention Checklist

- [ ] Register with correct role (Student/Teacher)
- [ ] Don't share accounts
- [ ] Logout properly when switching accounts
- [ ] Keep browser updated
- [ ] Clear cache if issues persist

---

## 📱 Browser Console Checks

```javascript
// Check if logged in
console.log('Token exists:', !!localStorage.getItem('token'))

// Check user data
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user.email)
console.log('Role:', user.role)

// Check token expiry (decode JWT)
const token = localStorage.getItem('token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Token expires:', new Date(payload.exp * 1000))
```

---

## 🔄 Complete Reset (Nuclear Option)

If nothing works:

1. **Backend:**
```bash
cd django_backend
# Backup database first!
cp db.sqlite3 db.sqlite3.backup
# Then recreate users
python create_demo_users.py
```

2. **Frontend:**
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
// Then hard refresh: Ctrl+Shift+R
```

3. **Re-register** with correct role

---

## 📞 Still Not Working?

1. Check backend is running: `http://localhost:8000/api/`
2. Check frontend is running: `http://localhost:5173/`
3. Check browser console for errors (F12)
4. Check backend terminal for errors
5. Run: `python verify_auth_setup.py`

---

## ✅ Success Indicators

When everything works:
- ✅ Login successful
- ✅ Can join exam with code
- ✅ Can answer questions
- ✅ Can submit exam
- ✅ See results page
- ✅ No "unauthorized" errors

---

## 🎓 For Developers

**Files Modified:**
- `django_backend/api/views/quiz.py` - Role checking logic
- `src/pages/student/ExamPage.jsx` - Frontend validation

**New Files:**
- `django_backend/check_user_role.py` - Role fixer
- `django_backend/verify_auth_setup.py` - Setup verifier
- `EXAM_SUBMISSION_FIX.md` - Detailed guide
- `EXAM_SUBMISSION_FIX_HINGLISH.md` - Hinglish guide

**Key Changes:**
- Case-insensitive role checking
- Better error messages
- Frontend token validation
- Auto-redirect on auth failures
