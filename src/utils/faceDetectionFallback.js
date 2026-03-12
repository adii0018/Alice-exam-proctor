/**
 * Fallback Face Detection using face-api.js
 * Lighter alternative to MediaPipe
 */

class FaceDetectionFallback {
  constructor() {
    this.isInitialized = false;
    this.detectionInterval = null;
    this.callbacks = {
      onFaceCountChange: null,
      onViolation: null,
      onError: null
    };
    
    this.config = {
      detectionIntervalMs: 1000,
      violationThresholdSeconds: 3,
      maxFacesAllowed: 1
    };
    
    this.state = {
      currentFaceCount: 0,
      violationStartTime: null,
      isViolating: false,
      lastDetectionTime: null
    };
  }

  async initialize() {
    try {
      // Check if face-api.js is loaded
      if (!window.faceapi) {
        throw new Error('face-api.js not loaded');
      }

      // Load models
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
      
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL)
      ]);

      this.isInitialized = true;
      console.log('Fallback face detection initialized (face-api.js)');
      return true;
    } catch (error) {
      console.error('Failed to initialize fallback face detection:', error);
      this.handleError('Fallback face detection initialization failed');
      return false;
    }
  }

  startMonitoring(videoElement) {
    if (!this.isInitialized) {
      console.error('Face detection not initialized');
      return false;
    }

    if (!videoElement || !videoElement.srcObject) {
      console.error('Invalid video element');
      return false;
    }

    this.stopMonitoring();

    this.detectionInterval = setInterval(() => {
      this.detectFaces(videoElement);
    }, this.config.detectionIntervalMs);

    console.log('Fallback face monitoring started');
    return true;
  }

  stopMonitoring() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    this.state = {
      currentFaceCount: 0,
      violationStartTime: null,
      isViolating: false,
      lastDetectionTime: null
    };
  }

  async detectFaces(videoElement) {
    try {
      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        return;
      }

      const detections = await window.faceapi
        .detectAllFaces(videoElement, new window.faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.5
        }));
      
      const faceCount = detections.length;
      this.state.lastDetectionTime = Date.now();
      this.processFaceCount(faceCount);
      
    } catch (error) {
      console.error('Fallback face detection error:', error);
    }
  }

  processFaceCount(faceCount) {
    const previousCount = this.state.currentFaceCount;
    this.state.currentFaceCount = faceCount;

    if (previousCount !== faceCount && this.callbacks.onFaceCountChange) {
      this.callbacks.onFaceCountChange(faceCount);
    }

    if (faceCount > this.config.maxFacesAllowed) {
      this.handleMultipleFaces(faceCount);
    } else {
      this.clearViolation();
    }
  }

  handleMultipleFaces(faceCount) {
    const now = Date.now();

    if (!this.state.violationStartTime) {
      this.state.violationStartTime = now;
      return;
    }

    const violationDuration = (now - this.state.violationStartTime) / 1000;
    
    if (violationDuration >= this.config.violationThresholdSeconds && !this.state.isViolating) {
      this.state.isViolating = true;
      this.triggerViolation(faceCount);
    }
  }

  clearViolation() {
    if (this.state.violationStartTime || this.state.isViolating) {
      this.state.violationStartTime = null;
      this.state.isViolating = false;
    }
  }

  triggerViolation(faceCount) {
    if (this.callbacks.onViolation) {
      this.callbacks.onViolation({
        type: 'MULTIPLE_FACES',
        faceCount,
        timestamp: new Date().toISOString(),
        severity: faceCount > 2 ? 'high' : 'medium',
        message: `${faceCount} faces detected in frame`
      });
    }

    this.state.violationStartTime = null;
    this.state.isViolating = false;
  }

  handleError(message) {
    if (this.callbacks.onError) {
      this.callbacks.onError(message);
    }
  }

  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase()}${event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = callback;
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getState() {
    return { ...this.state };
  }

  destroy() {
    this.stopMonitoring();
    this.isInitialized = false;
  }
}

export default FaceDetectionFallback;
