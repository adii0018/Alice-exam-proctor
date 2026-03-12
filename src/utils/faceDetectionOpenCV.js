/**
 * OpenCV.js based Face Detection for Alice Exam Proctor
 * More accurate and robust than face-api.js
 */

class FaceDetectionOpenCV {
  constructor() {
    this.isInitialized = false;
    this.detectionInterval = null;
    this.classifier = null;
    this.callbacks = {
      onFaceCountChange: null,
      onViolation: null,
      onError: null
    };
    
    // Configuration
    this.config = {
      detectionIntervalMs: 1000,
      violationThresholdSeconds: 3,
      maxFacesAllowed: 1,
      scaleFactor: 1.1,
      minNeighbors: 3,
      minSize: { width: 30, height: 30 }
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
   * Initialize OpenCV.js and load Haar Cascade classifier
   */
  async initialize() {
    try {
      // Check if OpenCV is loaded
      if (!window.cv) {
        throw new Error('OpenCV.js not loaded');
      }

      // Wait for OpenCV to be ready
      await new Promise((resolve) => {
        if (window.cv.getBuildInformation) {
          resolve();
        } else {
          window.cv.onRuntimeInitialized = () => {
            resolve();
          };
        }
      });

      console.log('OpenCV.js initialized:', window.cv.getBuildInformation());

      // Load Haar Cascade classifier for face detection
      await this.loadHaarCascade();

      this.isInitialized = true;
      console.log('OpenCV face detection initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenCV face detection:', error);
      this.handleError('OpenCV initialization failed: ' + error.message);
      return false;
    }
  }

  /**
   * Load Haar Cascade classifier from OpenCV.js
   */
  async loadHaarCascade() {
    try {
      // Create classifier
      this.classifier = new window.cv.CascadeClassifier();
      
      // Load haarcascade_frontalface_default.xml
      const cascadeFile = 'haarcascade_frontalface_default.xml';
      const utils = new window.cv.Utils();
      
      // Load from CDN
      const response = await fetch(
        'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml'
      );
      
      if (!response.ok) {
        throw new Error('Failed to load Haar Cascade file');
      }
      
      const cascadeData = await response.text();
      
      // Create file in OpenCV virtual filesystem
      window.cv.FS_createDataFile('/', cascadeFile, cascadeData, true, false, false);
      
      // Load classifier
      this.classifier.load(cascadeFile);
      
      console.log('Haar Cascade classifier loaded successfully');
    } catch (error) {
      console.error('Failed to load Haar Cascade:', error);
      throw error;
    }
  }

  /**
   * Start monitoring video stream for faces
   */
  startMonitoring(videoElement) {
    if (!this.isInitialized) {
      console.error('OpenCV face detection not initialized');
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

    console.log('OpenCV face monitoring started');
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
    
    console.log('OpenCV face monitoring stopped');
  }

  /**
   * Detect faces in video frame using OpenCV
   */
  detectFaces(videoElement) {
    try {
      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        return;
      }

      const cv = window.cv;
      
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Read image from canvas
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      const faces = new cv.RectVector();

      // Convert to grayscale
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      // Detect faces
      this.classifier.detectMultiScale(
        gray,
        faces,
        this.config.scaleFactor,
        this.config.minNeighbors,
        0,
        this.config.minSize,
        new cv.Size(0, 0)
      );

      const faceCount = faces.size();
      this.state.lastDetectionTime = Date.now();
      
      // Process face count
      this.processFaceCount(faceCount);

      // Cleanup
      src.delete();
      gray.delete();
      faces.delete();
      
    } catch (error) {
      console.error('OpenCV face detection error:', error);
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
      console.log(`OpenCV: Multiple faces detected (${faceCount}), starting violation timer`);
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
      console.log('OpenCV: Violation cleared - single face detected');
      this.state.violationStartTime = null;
      this.state.isViolating = false;
    }
  }

  /**
   * Trigger violation callback
   */
  triggerViolation(faceCount) {
    console.log(`OpenCV VIOLATION: ${faceCount} faces detected for ${this.config.violationThresholdSeconds}+ seconds`);
    
    if (this.callbacks.onViolation) {
      this.callbacks.onViolation({
        type: 'MULTIPLE_FACES',
        faceCount,
        timestamp: new Date().toISOString(),
        severity: faceCount > 2 ? 'high' : 'medium',
        message: `${faceCount} faces detected in frame (OpenCV)`,
        detector: 'opencv'
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
    const eventName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
    if (this.callbacks.hasOwnProperty(eventName)) {
      this.callbacks[eventName] = callback;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('OpenCV face detection config updated:', this.config);
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
    
    if (this.classifier) {
      this.classifier.delete();
      this.classifier = null;
    }
    
    this.isInitialized = false;
    console.log('OpenCV face detection service destroyed');
  }
}

export default FaceDetectionOpenCV;
