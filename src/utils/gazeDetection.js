/**
 * Gaze Detection Module for Alice Exam Proctor
 * Detects when students look away from the screen using MediaPipe Face Mesh
 * Tracks head pose and eye direction to identify gaze deviation
 */

class GazeDetectionService {
  constructor() {
    this.faceMesh = null;
    this.isInitialized = false;
    this.detectionInterval = null;
    this.callbacks = {
      onGazeChange: null,
      onViolation: null,
      onError: null
    };
    
    // Configuration
    this.config = {
      detectionIntervalMs: 500, // Check every 500ms for smoother detection
      violationThresholdSeconds: 4, // Trigger after 4 seconds of looking away
      minDetectionConfidence: 0.6,
      
      // Gaze thresholds (in degrees)
      maxYawAngle: 25, // Left/right head rotation
      maxPitchAngle: 20, // Up/down head tilt
      maxRollAngle: 15, // Head tilt sideways
      
      // Debounce settings
      lookingAwayDebounceMs: 1000, // Must look away for 1s before starting timer
      lookingBackDebounceMs: 500 // Must look back for 0.5s to clear
    };
    
    // State tracking
    this.state = {
      isLookingAway: false,
      lookingAwayStartTime: null,
      violationStartTime: null,
      lastGazeDirection: 'center',
      gazeHistory: [], // Track last N gaze states for smoothing
      maxHistoryLength: 5,
      consecutiveLookingAway: 0,
      consecutiveLookingAtScreen: 0
    };
  }

  /**
   * Initialize face mesh detection with MediaPipe
   */
  async initialize() {
    try {
      // Check if MediaPipe Face Mesh is available
      if (!window.FaceMesh) {
        console.warn('MediaPipe Face Mesh not loaded, attempting to load...');
        await this.loadMediaPipe();
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: this.config.minDetectionConfidence,
        minTrackingConfidence: 0.5
      });

      this.faceMesh = faceMesh;
      this.isInitialized = true;
      console.log('✓ Gaze detection initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize gaze detection:', error);
      this.handleError('Gaze detection initialization failed');
      return false;
    }
  }

  /**
   * Load MediaPipe scripts dynamically
   */
  async loadMediaPipe() {
    return new Promise((resolve, reject) => {
      // Load camera utils
      const cameraScript = document.createElement('script');
      cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
      cameraScript.crossOrigin = 'anonymous';
      
      // Load face mesh
      const faceScript = document.createElement('script');
      faceScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
      faceScript.crossOrigin = 'anonymous';
      
      faceScript.onload = () => resolve();
      faceScript.onerror = () => reject(new Error('Failed to load MediaPipe'));
      
      document.head.appendChild(cameraScript);
      document.head.appendChild(faceScript);
    });
  }

  /**
   * Start monitoring video stream for gaze
   */
  startMonitoring(videoElement) {
    if (!this.isInitialized) {
      console.error('Gaze detection not initialized');
      return false;
    }

    if (!videoElement || !videoElement.srcObject) {
      console.error('Invalid video element');
      return false;
    }

    // Clear any existing interval
    this.stopMonitoring();

    // Set up face mesh results callback
    this.faceMesh.onResults((results) => {
      this.processResults(results);
    });

    // Start detection loop
    this.detectionInterval = setInterval(async () => {
      if (videoElement.readyState >= 2) {
        await this.faceMesh.send({ image: videoElement });
      }
    }, this.config.detectionIntervalMs);

    console.log('Gaze monitoring started');
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
      isLookingAway: false,
      lookingAwayStartTime: null,
      violationStartTime: null,
      lastGazeDirection: 'center',
      gazeHistory: [],
      consecutiveLookingAway: 0,
      consecutiveLookingAtScreen: 0
    };
    
    console.log('Gaze monitoring stopped');
  }

  /**
   * Process face mesh results
   */
  processResults(results) {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      // No face detected - treat as looking away
      this.updateGazeState(true, 'no_face');
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const headPose = this.calculateHeadPose(landmarks);
    const gazeDirection = this.determineGazeDirection(headPose);
    
    // Check if looking away
    const isLookingAway = this.isGazeLookingAway(headPose);
    
    this.updateGazeState(isLookingAway, gazeDirection, headPose);
  }

  /**
   * Calculate head pose angles from landmarks
   */
  calculateHeadPose(landmarks) {
    // Key landmark indices for head pose estimation
    const noseTip = landmarks[1];
    const chin = landmarks[152];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const leftMouth = landmarks[61];
    const rightMouth = landmarks[291];
    
    // Calculate yaw (left-right rotation)
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    const noseToLeftEye = Math.abs(noseTip.x - leftEye.x);
    const noseToRightEye = Math.abs(noseTip.x - rightEye.x);
    
    // Normalized yaw: negative = left, positive = right
    const yaw = ((noseToRightEye - noseToLeftEye) / eyeDistance) * 45;
    
    // Calculate pitch (up-down tilt)
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const mouthCenterY = (leftMouth.y + rightMouth.y) / 2;
    const faceHeight = Math.abs(chin.y - noseTip.y);
    
    // Normalized pitch: negative = up, positive = down
    const pitch = ((noseTip.y - eyeCenterY) / faceHeight) * 30;
    
    // Calculate roll (head tilt)
    const eyeSlope = (rightEye.y - leftEye.y) / (rightEye.x - leftEye.x);
    const roll = Math.atan(eyeSlope) * (180 / Math.PI);
    
    return { yaw, pitch, roll };
  }

  /**
   * Determine gaze direction from head pose
   */
  determineGazeDirection(headPose) {
    const { yaw, pitch } = headPose;
    
    // Determine primary direction
    if (Math.abs(yaw) > Math.abs(pitch)) {
      if (yaw > 15) return 'right';
      if (yaw < -15) return 'left';
    } else {
      if (pitch > 10) return 'down';
      if (pitch < -10) return 'up';
    }
    
    return 'center';
  }

  /**
   * Check if gaze is looking away from screen
   */
  isGazeLookingAway(headPose) {
    const { yaw, pitch, roll } = headPose;
    
    // Check if any angle exceeds threshold
    const yawExceeded = Math.abs(yaw) > this.config.maxYawAngle;
    const pitchExceeded = Math.abs(pitch) > this.config.maxPitchAngle;
    const rollExceeded = Math.abs(roll) > this.config.maxRollAngle;
    
    // Allow brief downward gaze (reading questions)
    if (pitch > 0 && pitch < this.config.maxPitchAngle * 1.5 && !yawExceeded) {
      return false;
    }
    
    return yawExceeded || pitchExceeded || rollExceeded;
  }

  /**
   * Update gaze state with debouncing
   */
  updateGazeState(isLookingAway, direction, headPose = null) {
    const now = Date.now();
    
    // Add to history for smoothing
    this.state.gazeHistory.push(isLookingAway);
    if (this.state.gazeHistory.length > this.state.maxHistoryLength) {
      this.state.gazeHistory.shift();
    }
    
    // Count consecutive states
    if (isLookingAway) {
      this.state.consecutiveLookingAway++;
      this.state.consecutiveLookingAtScreen = 0;
    } else {
      this.state.consecutiveLookingAtScreen++;
      this.state.consecutiveLookingAway = 0;
    }
    
    // Debounce: require consistent state before changing
    const requiredConsecutive = Math.ceil(
      (isLookingAway ? this.config.lookingAwayDebounceMs : this.config.lookingBackDebounceMs) 
      / this.config.detectionIntervalMs
    );
    
    // Transition to looking away
    if (isLookingAway && this.state.consecutiveLookingAway >= requiredConsecutive) {
      if (!this.state.isLookingAway) {
        this.state.isLookingAway = true;
        this.state.lookingAwayStartTime = now;
        this.state.lastGazeDirection = direction;
        
        console.log(`Student looking away: ${direction}`, headPose);
        
        if (this.callbacks.onGazeChange) {
          this.callbacks.onGazeChange({
            isLookingAway: true,
            direction,
            headPose
          });
        }
      }
      
      // Check for violation threshold
      this.checkViolationThreshold(now, direction, headPose);
    }
    
    // Transition to looking at screen
    if (!isLookingAway && this.state.consecutiveLookingAtScreen >= requiredConsecutive) {
      if (this.state.isLookingAway) {
        this.state.isLookingAway = false;
        this.state.lookingAwayStartTime = null;
        this.state.violationStartTime = null;
        
        console.log('Student looking at screen');
        
        if (this.callbacks.onGazeChange) {
          this.callbacks.onGazeChange({
            isLookingAway: false,
            direction: 'center',
            headPose
          });
        }
      }
    }
  }

  /**
   * Check if violation threshold exceeded
   */
  checkViolationThreshold(now, direction, headPose) {
    if (!this.state.lookingAwayStartTime) return;
    
    const duration = (now - this.state.lookingAwayStartTime) / 1000;
    
    // Trigger violation if threshold exceeded and not already triggered
    if (duration >= this.config.violationThresholdSeconds && !this.state.violationStartTime) {
      this.state.violationStartTime = now;
      this.triggerViolation(direction, duration, headPose);
    }
  }

  /**
   * Trigger violation callback
   */
  triggerViolation(direction, duration, headPose) {
    console.log(`VIOLATION: Looking away (${direction}) for ${duration.toFixed(1)}s`);
    
    // Determine severity based on duration
    let severity = 'low';
    if (duration > 10) severity = 'high';
    else if (duration > 6) severity = 'medium';
    
    if (this.callbacks.onViolation) {
      this.callbacks.onViolation({
        type: 'LOOKING_AWAY',
        direction,
        duration: Math.round(duration),
        timestamp: new Date().toISOString(),
        severity,
        metadata: {
          headPose: headPose ? {
            yaw: Math.round(headPose.yaw * 10) / 10,
            pitch: Math.round(headPose.pitch * 10) / 10,
            roll: Math.round(headPose.roll * 10) / 10
          } : null
        }
      });
    }

    // Reset violation timer to avoid spam (allow re-trigger after 10 seconds)
    setTimeout(() => {
      this.state.violationStartTime = null;
    }, 10000);
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
    const eventKey = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
    if (this.callbacks.hasOwnProperty(eventKey)) {
      this.callbacks[eventKey] = callback;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Gaze detection config updated:', this.config);
  }

  /**
   * Get current state
   */
  getState() {
    return { 
      ...this.state,
      currentDuration: this.state.lookingAwayStartTime 
        ? (Date.now() - this.state.lookingAwayStartTime) / 1000 
        : 0
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopMonitoring();
    if (this.faceMesh) {
      this.faceMesh.close();
      this.faceMesh = null;
    }
    this.isInitialized = false;
    console.log('Gaze detection service destroyed');
  }
}

export default GazeDetectionService;
