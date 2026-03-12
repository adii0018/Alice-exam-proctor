# Alice Exam Proctor - Main Exam Page

A world-class, distraction-free AI-proctored examination interface built with React 18, Tailwind CSS, and Framer Motion.

## Design Philosophy

- **Zero distraction UI** - Clean, focused interface with no unnecessary elements
- **Calm & neutral colors** - Professional gray/blue palette for reduced stress
- **No unnecessary animations** - Only subtle, purposeful motion
- **Focus-first layout** - Question content takes priority
- **Trustworthy & professional** - Enterprise-grade SaaS aesthetics
- **2026 modern design** - Contemporary, clean, and accessible

## Components

### ExamPage (Main Container)
- Two-column layout (70% questions, 30% proctoring on desktop)
- Fullscreen enforcement
- Tab switch detection
- Copy/paste prevention
- Right-click disabled
- WebRTC camera integration
- WebSocket AI monitoring
- Auto-submit on time expiry or violation limit

### ExamTopBar
- Exam name display
- Prominent countdown timer (pulses when < 5 min)
- Warning counter (0-10 limit)
- Submit exam button
- Rules info button

### QuestionPanel
- Large, clickable option areas
- Keyboard navigation (1-4 for options, ← → for navigation)
- Clear selected state
- Mark for review functionality
- Question navigator grid with status indicators
- Next/Previous navigation
- Progress tracking

### ProctorPanel
- Live camera feed
- Face detection status (detected/multiple/none)
- AI monitoring badge with live pulse
- Microphone status
- Violation statistics
- Tab switch counter
- Rules reminder

### WarningModal
- Non-intrusive toast notification
- Auto-dismiss after 4 seconds
- Yellow warning theme
- Clear violation message

### ExitConfirmModal
- Confirmation before submission
- Shows answered/unanswered count
- Warning for incomplete questions
- Cannot be dismissed accidentally

### RulesModal
- Read-only exam rules display
- Icon-based rule categories
- Additional guidelines section
- Clear, professional presentation

## Features

### Security & Proctoring
- ✅ Fullscreen mode enforcement
- ✅ Tab switch detection & logging
- ✅ Face detection (single face required)
- ✅ Multiple face detection warning
- ✅ No face detection warning
- ✅ Copy/paste disabled
- ✅ Right-click disabled
- ✅ Auto-submit at 10 violations
- ✅ WebSocket real-time monitoring

### User Experience
- ✅ Keyboard-only navigation
- ✅ Clear focus states
- ✅ High contrast text
- ✅ Screen reader friendly
- ✅ Responsive design (mobile-ready)
- ✅ Question status indicators
- ✅ Mark for review
- ✅ Question navigator grid

### Timer & Submission
- ✅ Real-time countdown
- ✅ Visual warning at 5 minutes
- ✅ Auto-submit on time expiry
- ✅ Confirmation before manual submit
- ✅ Unanswered question warning

## Usage

```jsx
import ExamPage from './pages/student/ExamPage';

// Route setup
<Route path="/student/exam/:examId" element={<ExamPage />} />
```

## API Integration

The exam page expects the following API endpoints:

```javascript
// Fetch exam data
GET /api/quiz/:examId/

// Submit exam
POST /api/quiz/:examId/submit/
Body: {
  answers: { questionId: optionId },
  violations: [{ timestamp, message, questionNumber }],
  timeSpent: seconds
}

// WebSocket connection
ws://localhost:8000/ws/proctor/:examId/
```

## Keyboard Shortcuts

- `1-4` - Select option A-D
- `←` - Previous question
- `→` - Next question
- `Esc` - (Blocked during exam)

## Violation System

Violations are tracked and logged for:
- Tab switching
- Window minimization
- Exiting fullscreen
- Multiple faces detected
- No face detected
- Suspicious behavior (AI-detected)

**Limit:** 10 violations → Auto-submit

## Browser Requirements

- Modern browser with WebRTC support
- Camera and microphone access
- Fullscreen API support
- WebSocket support

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader compatible
- High contrast mode support
- Focus indicators on all interactive elements

## Production Ready

- ✅ Error handling
- ✅ Loading states
- ✅ Cleanup on unmount
- ✅ Memory leak prevention
- ✅ Performance optimized
- ✅ Mobile responsive
- ✅ Cross-browser tested

## Color Palette

- Primary: Blue 600 (#2563eb)
- Success: Green 600 (#16a34a)
- Warning: Yellow 600 (#ca8a04)
- Danger: Red 600 (#dc2626)
- Neutral: Gray 50-900

## No Distractions

- No emojis
- No gamification
- No bright colors
- No excessive animations
- No dashboard clutter
- No social features
- Pure focus on examination
