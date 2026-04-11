# AI Proctoring System

Yeh document exam proctoring system ke AI features ko explain karta hai.

---

## Overview

Is system mein browser-based AI use kiya gaya hai jo exam ke dauran student ko monitor karta hai. Koi server-side processing nahi hoti — sab kuch student ke browser mein real-time chalta hai.

---

## Features

### 1. Multi-Face Detection

Webcam se detect karta hai ki camera ke saamne kitne log hain.

| Condition | Action |
|-----------|--------|
| 1 face | Sab theek, koi warning nahi |
| 0 face | "No Face Detected" warning |
| 2+ faces | "Multiple Faces" warning + sound alert + violation log |

**Library:** MediaPipe BlazeFace (primary) + face-api.js TinyFaceDetector (fallback)

**Kaise kaam karta hai:**
- Har 800ms pe webcam ka ek frame analyze hota hai
- Sirf woh faces count hote hain jinka confidence score >= 65% ho
- Chote/background faces ignore hote hain (frame ka 1.5% se kam area)
- False positives rokne ke liye Temporal Filter use hota hai — 3 seconds mein 60% frames mein multiple faces aayein tabhi violation trigger hoga

---

### 2. Gaze / Head Pose Detection

Student ki aankhein aur sar ki direction track karta hai.

| Direction | Action |
|-----------|--------|
| Seedha screen pe | OK |
| Left / Right / Up / Down | Gaze Warning show hoti hai |

**Library:** MediaPipe Face Mesh (468 facial landmarks)

**Kaise kaam karta hai:**
- Har 400ms pe face ke landmarks detect hote hain
- Yaw (left/right), Pitch (up/down), Roll (tilt) angles calculate hote hain

- Pehli baar calibration hoti hai student ki neutral position ke liye
- Agar student zyada der tak door dekhe toh violation log hota hai

---

### 3. Smart Audio Detection

Microphone se suspicious sounds detect karta hai.

| Sound | Action |
|-------|--------|
| Normal ambient noise | Ignore |
| Voice / whispering | Warning + risk score badh jaata hai |
| Loud sound | High severity violation |

**Library:** Web Audio API (browser built-in, koi external library nahi)

**Kaise kaam karta hai:**
- Exam shuru hone se pehle 3 seconds ka ambient noise calibration hota hai
- Spectral Flatness analysis se voice aur background noise mein farq karta hai
- Risk score time ke saath decay hota hai (ek baar ki awaaz permanent violation nahi)
- Tab switch hone pe auto-recalibration hoti hai

---

### 4. Tab Switch Detection

Agar student exam window se bahar jaaye toh detect karta hai.

**Library:** Browser built-in `visibilitychange` + `blur` events (koi library nahi)

**Kaise kaam karta hai:**
- `document.visibilitychange` event listen karta hai
- Har switch count hota hai aur log hota hai
- 3 se zyada switches pe HIGH severity violation

---

### 5. Cheating Score Engine

Sab violations ko mila ke ek overall "cheating score" calculate karta hai (0-100).

| Score | Decision |
|-------|----------|
| 0-30 | CLEAN |
| 31-60 | SUSPICIOUS |
| 61-80 | LIKELY_CHEATING |
| 81-100 | CHEATING |

- Har violation ka alag weight hota hai (HIGH > MEDIUM > LOW)
- Score time ke saath automatically decay hota hai
- Exam end pe teacher ko full report milti hai

---

## Libraries Summary

| Library | Kaam | Load Method |
|---------|------|-------------|
| MediaPipe BlazeFace | Face detection | CDN (browser runtime) |
| MediaPipe Face Mesh | Gaze tracking | CDN (browser runtime) |
| face-api.js TinyFaceDetector | Face detection fallback | CDN (browser runtime) |
| Web Audio API | Audio monitoring | Browser built-in |

> Note: Koi bhi library `npm install` se nahi aati — sab CDN se browser mein load hoti hain isliye `package.json` mein nazar nahi aatein.

---

## File Structure

```
src/utils/proctoring/
├── FaceDetectionEngine.js     # Multi-face detection
├── HeadPoseEngine.js          # Gaze / head pose tracking
├── SmartAudioDetection.js     # Audio / voice monitoring
├── TabSwitchEngine.js         # Tab switch detection
├── CheatingScoreEngine.js     # Overall score calculator
├── ProctoringLogger.js        # Violation event logger
├── ProctoringOrchestrator.js  # Sab engines ko coordinate karta hai
└── TemporalFilter.js          # False positive prevention

src/hooks/
└── useProctoring.js           # React hook — UI ke liye

src/components/exam/
├── ProctorPanel.jsx           # Side panel (camera + status)
├── MultiFaceWarning.jsx       # Multiple faces warning UI
├── GazeWarning.jsx            # Gaze warning UI
└── AudioRiskIndicator.jsx     # Audio risk level UI
```

---

## Language Support

Yeh poora system **JavaScript (Browser)** pe based hai.
- React + JavaScript frontend
- Sirf modern browsers support hain: Chrome, Firefox, Edge, Safari
- Mobile browsers pe limited support
