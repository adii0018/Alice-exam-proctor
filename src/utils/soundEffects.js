// Sound Effects Utility for Exam Proctoring System

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Generate beep sound
  createBeep(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = this.volume;

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Violation alert sound - urgent beep
  playViolationAlert() {
    if (!this.enabled) return;
    
    // Triple beep pattern for urgency
    this.createBeep(800, 0.15, 'square');
    setTimeout(() => this.createBeep(800, 0.15, 'square'), 200);
    setTimeout(() => this.createBeep(800, 0.15, 'square'), 400);
  }

  // Warning sound - moderate alert
  playWarning() {
    if (!this.enabled) return;
    
    // Double beep pattern
    this.createBeep(600, 0.2, 'sine');
    setTimeout(() => this.createBeep(600, 0.2, 'sine'), 250);
  }

  // Multi-face detection alert
  playMultiFaceAlert() {
    if (!this.enabled) return;
    
    // Ascending beeps
    this.createBeep(400, 0.15, 'triangle');
    setTimeout(() => this.createBeep(600, 0.15, 'triangle'), 150);
    setTimeout(() => this.createBeep(800, 0.2, 'triangle'), 300);
  }

  // Success sound
  playSuccess() {
    if (!this.enabled) return;
    
    // Ascending pleasant tones
    this.createBeep(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.createBeep(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.createBeep(783.99, 0.15, 'sine'), 200); // G5
  }

  // Error sound
  playError() {
    if (!this.enabled) return;
    
    // Descending harsh tones
    this.createBeep(400, 0.2, 'sawtooth');
    setTimeout(() => this.createBeep(300, 0.3, 'sawtooth'), 200);
  }

  // Notification sound - gentle
  playNotification() {
    if (!this.enabled) return;
    
    this.createBeep(800, 0.1, 'sine');
    setTimeout(() => this.createBeep(1000, 0.15, 'sine'), 100);
  }

  // Timer countdown sound (last 10 seconds)
  playTick() {
    if (!this.enabled) return;
    
    this.createBeep(1000, 0.05, 'sine');
  }

  // Exam start sound
  playExamStart() {
    if (!this.enabled) return;
    
    // Uplifting sequence
    this.createBeep(523.25, 0.15, 'sine'); // C5
    setTimeout(() => this.createBeep(659.25, 0.15, 'sine'), 150); // E5
    setTimeout(() => this.createBeep(783.99, 0.15, 'sine'), 300); // G5
    setTimeout(() => this.createBeep(1046.50, 0.25, 'sine'), 450); // C6
  }

  // Exam end sound
  playExamEnd() {
    if (!this.enabled) return;
    
    // Completion sequence
    this.createBeep(783.99, 0.2, 'sine'); // G5
    setTimeout(() => this.createBeep(659.25, 0.2, 'sine'), 200); // E5
    setTimeout(() => this.createBeep(523.25, 0.3, 'sine'), 400); // C5
  }

  // Button click sound
  playClick() {
    if (!this.enabled) return;
    
    this.createBeep(1200, 0.03, 'sine');
  }

  // Toggle sound on/off
  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Set volume (0 to 1)
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
  }

  // Enable sound
  enable() {
    this.enabled = true;
  }

  // Disable sound
  disable() {
    this.enabled = false;
  }

  // Check if sound is enabled
  isEnabled() {
    return this.enabled;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

// Named exports for convenience
export const {
  playViolationAlert,
  playWarning,
  playMultiFaceAlert,
  playSuccess,
  playError,
  playNotification,
  playTick,
  playExamStart,
  playExamEnd,
  playClick,
  toggleSound,
  setVolume,
  enable,
  disable,
  isEnabled
} = soundManager;
