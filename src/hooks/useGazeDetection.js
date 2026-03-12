/**
 * React hook for gaze detection integration
 * Monitors student's gaze direction and triggers violations
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import GazeDetectionService from '../utils/gazeDetection';

const useGazeDetection = ({ 
  videoRef, 
  onViolation, 
  onGazeChange,
  enabled = true,
  config = {}
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [gazeDirection, setGazeDirection] = useState('center');
  const [error, setError] = useState(null);
  const detectorRef = useRef(null);

  // Initialize gaze detection
  useEffect(() => {
    if (!enabled) return;
    
    const initDetector = async () => {
      try {
        const detector = new GazeDetectionService();
        const success = await detector.initialize();
        
        if (!success) {
          throw new Error('Failed to initialize gaze detection');
        }

        // Update config if provided
        if (config && Object.keys(config).length > 0) {
          detector.updateConfig(config);
        }

        // Register callbacks
        detector.on('gazeChange', (gazeData) => {
          setIsLookingAway(gazeData.isLookingAway);
          setGazeDirection(gazeData.direction);
          
          if (onGazeChange) {
            onGazeChange(gazeData);
          }
        });

        detector.on('violation', (violationData) => {
          console.log('Gaze violation detected:', violationData);
          
          if (onViolation) {
            onViolation(violationData);
          }
        });

        detector.on('error', (errorMsg) => {
          console.error('Gaze detection error:', errorMsg);
          setError(errorMsg);
        });

        detectorRef.current = detector;
        setIsInitialized(true);
        setError(null);
        
        console.log('✓ Gaze detection hook initialized');
      } catch (err) {
        console.error('Gaze detection initialization error:', err);
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
  }, [enabled]);

  // Start monitoring when video is ready
  useEffect(() => {
    if (!isInitialized || !videoRef?.current || !enabled) return;

    const video = videoRef.current;
    
    // Wait for video to be ready
    const handleLoadedMetadata = () => {
      if (detectorRef.current && video.readyState >= 2) {
        const started = detectorRef.current.startMonitoring(video);
        if (!started) {
          setError('Failed to start gaze monitoring');
        } else {
          console.log('✓ Gaze monitoring started');
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
    isLookingAway,
    gazeDirection,
    error,
    updateConfig,
    getState
  };
};

export default useGazeDetection;
