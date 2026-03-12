/**
 * React hook for face detection integration
 * Supports multiple detection engines: face-api.js, OpenCV.js
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import FaceDetectionFallback from '../utils/faceDetectionFallback';
import FaceDetectionOpenCV from '../utils/faceDetectionOpenCV';

const useFaceDetection = ({ 
  videoRef, 
  onViolation, 
  onFaceCountChange,
  enabled = true,
  config = {},
  engine = 'auto' // 'auto', 'opencv', 'faceapi'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFaceCount, setCurrentFaceCount] = useState(0);
  const [error, setError] = useState(null);
  const [detectionEngine, setDetectionEngine] = useState(null);
  const detectorRef = useRef(null);

  // Initialize face detection
  useEffect(() => {
    if (!enabled) return;
    
    const initDetector = async () => {
      try {
        let detector = null;
        let engineUsed = null;

        // Try OpenCV first if available or explicitly requested
        if ((engine === 'auto' || engine === 'opencv') && window.cv) {
          console.log('Attempting to use OpenCV.js for face detection...');
          detector = new FaceDetectionOpenCV();
          const success = await detector.initialize();
          
          if (success) {
            engineUsed = 'opencv';
            console.log('✓ Using OpenCV.js (more accurate)');
          } else {
            detector = null;
          }
        }

        // Fallback to face-api.js if OpenCV not available or failed
        if (!detector && (engine === 'auto' || engine === 'faceapi')) {
          console.log('Attempting to use face-api.js for face detection...');
          detector = new FaceDetectionFallback();
          const success = await detector.initialize();
          
          if (success) {
            engineUsed = 'faceapi';
            console.log('✓ Using face-api.js (lightweight)');
          }
        }

        if (!detector) {
          throw new Error('No face detection engine available');
        }

        // Update config if provided
        if (config) {
          detector.updateConfig(config);
        }

        // Register callbacks
        detector.on('faceCountChange', (count) => {
          setCurrentFaceCount(count);
          if (onFaceCountChange) {
            onFaceCountChange(count);
          }
        });

        detector.on('violation', (violationData) => {
          if (onViolation) {
            onViolation({
              ...violationData,
              detector: engineUsed
            });
          }
        });

        detector.on('error', (errorMsg) => {
          console.error('Face detection error:', errorMsg);
          setError(errorMsg);
        });

        detectorRef.current = detector;
        setDetectionEngine(engineUsed);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Face detection initialization error:', err);
        setError(err.message);
      }
    };

    initDetector();

    return () => {
      if (detectorRef.current) {
        detectorRef.current.destroy();
        detectorRef.current = null;
      }
    };
  }, [enabled, engine]);

  // Start monitoring when video is ready
  useEffect(() => {
    if (!isInitialized || !videoRef?.current || !enabled) return;

    const video = videoRef.current;
    
    // Wait for video to be ready
    const handleLoadedMetadata = () => {
      if (detectorRef.current && video.readyState >= 2) {
        const started = detectorRef.current.startMonitoring(video);
        if (!started) {
          setError('Failed to start face monitoring');
        }
      }
    };

    if (video.readyState >= 2) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (detectorRef.current) {
        detectorRef.current.stopMonitoring();
      }
    };
  }, [isInitialized, videoRef, enabled]);

  const updateConfig = useCallback((newConfig) => {
    if (detectorRef.current) {
      detectorRef.current.updateConfig(newConfig);
    }
  }, []);

  const getState = useCallback(() => {
    return detectorRef.current ? detectorRef.current.getState() : null;
  }, []);

  return {
    isInitialized,
    currentFaceCount,
    error,
    detectionEngine,
    updateConfig,
    getState
  };
};

export default useFaceDetection;
