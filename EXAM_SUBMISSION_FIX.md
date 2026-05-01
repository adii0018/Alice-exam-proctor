# Exam Submission "Unauthorized" Error - Fix Guide

## Problem
Students getting "unauthorized" error when trying to submit exams.

## Root Causes
1. User role in database is not set to 'student'
2. JWT token has expired
3. User is logged in with wrong account type (teacher instead of student)
4. Role has incorrect casing (e.g., "Student" instead of "student")

## Solutions Applied

### 1. Backend Changes (django_backend/api/views/quiz.py)
- Changed from `@require_role('student')` to `@require_auth` with manual role check
- Added case-insensitive role checking
- Better error messages in Hinglish for clarity

### 2. Frontend Changes (src/pages/student/ExamPage.jsx)
- Added token validation before submission
- Added user role verification before submission
- Better error handling with specific messages for 401 and 403 errors
- Auto-redirect to login page if session expired

### 3. Debugging Tool (django_backend/check_user_role.py)
- Script to check and fix user roles in database
- Run with: `python django_backend/check_user_role.py`

## How to Fix for Users

### Quick Check
1. Open browser console (F12)
2. Go to Application/Storage → Local Storage
3. Check the 'user' item - verify role is 'student' (lowercase)
4. Check the 'token' item - make sure it exists

### If Role is Wrong
**Option 1: Re-register**
1. Logout
2. Register again with correct role selection
3. Make sure to select "Student" during registration

**Option 2: Fix in Database**
```bash
cd django_backend
python check_user_role.py
```

### If Token Expired
1. Simply logout and login again
2. Token will be refreshed automatically

### If Still Not Working
1. Clear browser cache and localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
2. Login again
3. Try submitting exam

## Testing the Fix

1. Login as a student
2. Join an active exam
3. Answer questions
4. Click "Submit Exam"
5. Should see success message and redirect to results page

## Error Messages Explained

- **"Session expired. Please login again."** → Token is invalid/expired
- **"Only students can submit exams."** → Logged in as teacher/admin
- **"This quiz is not active."** → Teacher hasn't activated the quiz
- **"Aapne yeh quiz pehle se submit kar diya hai."** → Already submitted (one attempt only)

## Prevention

1. Always select correct role during registration
2. Don't share login credentials between teacher and student accounts
3. Logout properly when switching between accounts
4. Keep browser updated to avoid token storage issues

## Technical Details

The authentication flow:
1. User logs in → Backend generates JWT token with user_id and role
2. Token stored in localStorage
3. Every API request includes: `Authorization: Bearer <token>`
4. Backend decodes token and verifies role
5. If role != 'student', returns 403 Unauthorized

The fix ensures:
- Case-insensitive role checking
- Better error messages
- Frontend validation before API call
- Proper error handling and user feedback
