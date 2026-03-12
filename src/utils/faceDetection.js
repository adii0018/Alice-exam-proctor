/**
 * Multi-Face Detection Module for Alice Exam Proctor
 * Uses MediaPipe Face Detection for browser-based face detection
 */

class FaceDetectionService {
  constructor() {
    this.faceDetector = null;
    this.isInitialized = false;
    this.detectionInterval = null;
    this.callbacks = {
      onFaceCountChange: null,
      onViolation: null,
      onError: null
    };
    
    // Configuration
    this.config = {
      detectionIntervalMs: 1000, // Check every 1 second
      violationThresholdSeconds: 3, // Trigger violation after 3 seconds
      minDetectionConfidence: 0.5,
      maxFacesAllowed: 1
    };
    
    // State tracking
    this.state = {
      currentFaceCount: 0,
      violationStartTime: null,
      isViolating: false,
      lastDetectionTime: null
    };
  }

  /**
   * Initialize face detection with MediaPipe
   */
  async initialize() {
    try {
      // Check if MediaPipe is available
      if (!window.FaceDetection) {
        throw new Error('MediaPipe Face Detection not loaded');
      }

      const vision = await window.FaceDetection.FaceDetector.createFromOptions(
        window.FaceDetection.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        ),
        {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          minDetectionConfidence: this.config.minDetectionConfidence
        }
      );

      this.faceDetector = vision;
      this.isInitialized = true;
      console.log('Face detection initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      this.handleError('Face detection initialization failed');
      return false;
    }
  }

  /**
   * Start monitoring video stream for faces
   */
  startMonitoring(videoElement) {
    if (!this.isInitialized) {
      console.error('Face detection not initialized');
      return false;
    }

    if (!videoElement || !videoElement.srcObject) {
      console.error('Invalid video element');
      return false;
    }

    // Clear any existing interval
    this.stopMonitoring();

    // Start detection loop
    this.detectionInterval = setInterval(() => {
      this.detectFaces(videoElement);
    }, this.config.detectionIntervalMs);

    console.log('Face monitoring started');
    return true;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    // Reset state
    this.state = {
      currentFaceCount: 0,
      violationStartTime: null,
      isViolating: false,
      lastDetectionTime: null
    };
    
    console.log('Face monitoring stopped');
  }

  /**
   * Detect faces in video frame
   */
  async detectFaces(videoElement) {
    try {
      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        return;
      }

      const now = Date.now();
      
      // Detect faces
      const detections = await this.faceDetector.detect(videoElement, now);
      const faceCount = detections.detections ? detections.detections.length : 0;
      
      this.state.lastDetectionTime = now;
      this.processFaceCount(faceCount);
      
    } catch (error) {
      console.error('Face detection error:', error);
      this.handleError('Face detection failed');
    }
  }

  /**
   * Process detected face count and trigger violations
   */
  processFaceCount(faceCount) {
    const previousCount = this.state.currentFaceCount;
    this.state.currentFaceCount = faceCount;

    // Notify about face count change
    if (previousCount !== faceCount && this.callbacks.onFaceCountChange) {
      this.callbacks.onFaceCountChange(faceCount);
    }

    // Check for violation (more than allowed faces)
    if (faceCount > this.config.maxFacesAllowed) {
      this.handleMultipleFaces(faceCount);
    } else {
      this.clearViolation();
    }
  }

  /**
   * Handle multiple faces detected
   */
  handleMultipleFaces(faceCount) {
    const now = Date.now();

    // Start violation timer if not already started
    if (!this.state.violationStartTime) {
      this.state.violationStartTime = now;
      console.log(`Multiple faces detected (${faceCount}), starting violation timer`);
      return;
    }

    // Check if violation threshold exceeded
    const violationDuration = (now - this.state.violationStartTime) / 1000;
    
    if (violationDuration >= this.config.violationThresholdSeconds && !this.state.isViolating) {
      this.state.isViolating = true;
      this.triggerViolation(faceCount);
    }
  }

  /**
   * Clear violation state
   */
  clearViolation() {
    if (this.state.violationStartTime || this.state.isViolating) {
      console.log('Violation cleared - single face detected');
      this.state.violationStartTime = null;
      this.state.isViolating = false;
    }
  }

  /**
   * Trigger violation callback
   */
  triggerViolation(faceCount) {
    console.log(`VIOLATION: ${faceCount} faces detected for ${this.config.violationThresholdSeconds}+ seconds`);
    
    if (this.callbacks.onViolation) {
      this.callbacks.onViolation({
        type: 'MULTIPLE_FACES',
        faceCount,
        timestamp: new Date().toISOString(),
        severity: faceCount > 2 ? 'high' : 'medium',
        message: `${faceCount} faces detected in frame`
      });
    }

    // Reset violation timer to avoid spam
    this.state.violationStartTime = null;
    this.state.isViolating = false;
  }

  /**
   * Handle errors
   */
  handleError(message) {
    if (this.callbacks.onError) {
      this.callbacks.onError(message);
    }
  }

  /**
   * Register callbacks
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase()}${event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = callback;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Face detection config updated:', this.config);
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopMonitoring();
    if (this.faceDetector) {
      this.faceDetector.close();
      this.faceDetector = null;
    }
    this.isInitialized = false;
    console.log('Face detection service destroyed');
  }
}

export default FaceDetectionService;
