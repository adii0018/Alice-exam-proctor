# Violation Monitoring Fixes

## Issues Fixed

### 1. Teacher Seeing All Violations (Not Just Their Quizzes)
**Problem**: Teachers were seeing violations from ALL students across ALL quizzes, even quizzes they didn't create.

**Solution**: 
- Updated `django_backend/api/views/violation.py` - `list_violations()` function
  - Now filters violations to only show those from quizzes created by the logged-in teacher
  - Uses `Quiz.find_by_teacher()` to get teacher's quizzes
  - Filters violations by `quiz_id` in teacher's quiz list

- Updated `django_backend/api/views/flag.py` - `list_flags()` function
  - Same filtering logic applied to flags
  - Teachers only see flags from their own quizzes
  - Students only see their own flags

### 2. Live Violations Not Showing in Real-Time
**Problem**: Violations were being saved to database but not broadcasting to teachers in real-time.

**Solution**:

#### Backend Changes:
1. **Updated `django_backend/api/views/flag.py` - `create_flag()` function**
   - Added WebSocket broadcast after flag creation
   - Uses Django Channels `channel_layer.group_send()`
   - Broadcasts to quiz-specific room: `proctor_{quiz_id}`
   - Includes student name and quiz title in broadcast

2. **Updated `django_backend/api/consumers.py` - `TeacherMonitoringConsumer`**
   - Added auto-subscription to all teacher's quizzes on connection
   - Teacher automatically subscribes to all their quiz rooms
   - Receives violation broadcasts from all subscribed quizzes
   - Tracks subscribed quizzes to prevent duplicates

#### Frontend Changes:
1. **Created `src/hooks/useViolationWebSocket.js`**
   - Custom React hook for WebSocket connection
   - Connects to teacher monitoring endpoint
   - Receives live violation alerts
   - Shows toast notifications for new violations
   - Auto-reconnects with exponential backoff
   - Maintains list of recent live violations

2. **Updated `src/pages/TeacherDashboardNew.jsx`**
   - Integrated `useViolationWebSocket` hook
   - Shows connection status indicator (green = connected, red = disconnected)
   - Refreshes flags list when new violation received
   - Displays live violations in real-time

3. **Updated `src/styles/index.css`**
   - Added pulse animation for connection status indicator

## How It Works Now

### Violation Flow:
1. Student takes quiz with proctoring enabled
2. Violation detected by `useProctoring` hook
3. Violation sent to backend via `flagAPI.create()`
4. Backend saves violation to database
5. Backend broadcasts violation via WebSocket to `proctor_{quiz_id}` room
6. Teacher's WebSocket connection (subscribed to their quiz rooms) receives broadcast
7. Frontend shows toast notification and updates violations list
8. Teacher sees violation in real-time on dashboard

### Teacher Dashboard:
- Shows connection status (Connected/Disconnected)
- Only displays violations from teacher's own quizzes
- Receives live violation alerts via WebSocket
- Toast notifications for new violations
- Auto-refreshes violation list

## Testing

### Test Violation Filtering:
1. Login as Teacher A
2. Create Quiz A
3. Login as Teacher B (different account)
4. Create Quiz B
5. Have students take both quizzes with violations
6. Verify Teacher A only sees violations from Quiz A
7. Verify Teacher B only sees violations from Quiz B

### Test Live Monitoring:
1. Login as teacher
2. Open dashboard
3. Verify "Live Monitoring: Connected" shows green indicator
4. Have student start quiz
5. Trigger violation (multiple faces, looking away, etc.)
6. Verify toast notification appears immediately
7. Verify violation appears in Recent Violations table
8. Check browser console for WebSocket messages

## WebSocket URL Format
```
ws://localhost:8000/ws/teacher/monitor/{teacher_id}/?token={auth_token}
```

## Environment Variables
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000/api)
- WebSocket URL is derived from API URL automatically

## Dependencies
- Django Channels (already installed)
- channels-redis (for production, optional for development)
- React hooks (useState, useEffect, useCallback, useRef)
- react-hot-toast (for notifications)

## Notes
- WebSocket connection auto-reconnects on disconnect
- Maximum 5 reconnection attempts with exponential backoff
- Ping/pong messages every 30 seconds to keep connection alive
- Violations are saved to database even if WebSocket broadcast fails
- Frontend gracefully handles WebSocket connection failures
