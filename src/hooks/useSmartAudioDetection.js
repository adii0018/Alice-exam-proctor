/**
 * useSmartAudioDetection — React hook for enhanced audio proctoring
 *
 * Accuracy fixes included:
 *   FIX 1 — Spectral flatness whisper detection (handled in SmartAudioDetection.js)
 *   FIX 2 — Adaptive cooldown + LOW→MEDIUM upgrade (handled in SmartAudioDetection.js)
 *   FIX 3 — Auto-recalibration on tab resume / AudioContext interruption
 *   FIX 4 — Time-decayed risk score; warnings use decayedRiskScore, raw kept for audit
 *
 * Usage:
 *   const {
 *     isCalibrating, calibrationProgress, isCalibrated,
 *     isMonitoring, riskScore, decayedRiskScore, riskLevel,
 *     startCalibration, startMonitoring, stopMonitoring
 *   } = useSmartAudioDetection({ enabled, onViolation });
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { SmartAudioDetection } from '../utils/proctoring/SmartAudioDetection.js';
import toast from 'react-hot-toast';

export const useSmartAudioDetection = ({
  enabled    = true,
  onViolation = null,  // (violationObject) => void
  autoStart  = false,
} = {}) => {
  // ── Calibration ────────────────────────────────────────────────────────────
  const [isCalibrating,       setIsCalibrating]       = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isCalibrated,        setIsCalibrated]        = useState(false);

  // ── Monitoring ─────────────────────────────────────────────────────────────
  const [isMonitoring, setIsMonitoring] = useState(false);

  // ── FIX 4: expose both raw and decayed scores ──────────────────────────────
  const [riskScore,        setRiskScore]        = useState(0);
  const [decayedRiskScore, setDecayedRiskScore] = useState(0);
  const [riskLevel,        setRiskLevel]        = useState('No suspicious activity');

  // ── Refs ───────────────────────────────────────────────────────────────────
  const detectorRef      = useRef(null);
  const cleanupRef       = useRef(null);
  const lastWarningRef   = useRef(0);

  // ── Risk level label (uses decayed score per FIX 4) ───────────────────────
  const _updateRiskLevel = useCallback((decayed) => {
    if      (decayed <= 30) setRiskLevel('No suspicious activity');
    else if (decayed <= 60) setRiskLevel('Minor concerns');
    else if (decayed <= 90) setRiskLevel('Suspicious behaviour');
    else                    setRiskLevel('High risk — review required');
  }, []);

  // ── Violation handler ──────────────────────────────────────────────────────
  const handleViolation = useCallback((violation) => {
    // Skip internal system events (recalibration notices) from toast logic
    if (violation._isSystemEvent) {
      onViolation?.(violation);
      return;
    }

    onViolation?.(violation);

    const now = Date.now();
    if (now - lastWarningRef.current < 2500) return; // avoid spam, keep alerts immediate

    // Only show red high-severity alert; medium/low/score-based toasts are suppressed
    if (violation.severity === 'high') {
      toast.error('🚨 Loud/continuous voice detected in background', {
        duration: 7000,
        style: { background: '#dc2626', color: 'white' },
      });
      lastWarningRef.current = now;
    }
  }, [onViolation]);

  // ── Risk update handler (called by decay timer too) ────────────────────────
  const handleRiskUpdate = useCallback(({ riskScore: raw, decayedRiskScore: decayed }) => {
    setRiskScore(raw);
    setDecayedRiskScore(Math.round(decayed));
    _updateRiskLevel(decayed);
  }, [_updateRiskLevel]);

  // ── Calibration ────────────────────────────────────────────────────────────
  const startCalibration = useCallback(async () => {
    if (!enabled || isCalibrating) return false;

    try {
      setIsCalibrating(true);
      setCalibrationProgress(0);

      const detector = new SmartAudioDetection({
        onViolation:  handleViolation,
        onRiskUpdate: handleRiskUpdate,
        onCalibration: (status, progress) => {
          if (status === 'starting') {
            toast.loading('Calibrating audio... please stay silent', { id: 'audio-cal' });
          } else if (status === 'calibrating') {
            setCalibrationProgress(progress);
          } else if (status === 'complete') {
            setIsCalibrated(true);
            toast.success('Audio calibration complete', { id: 'audio-cal' });
            if (autoStart) setTimeout(() => startMonitoring(), 500);
          } else if (status === 'error') {
            toast.error('Audio calibration failed — using default settings', { id: 'audio-cal' });
            setIsCalibrated(false);
          }
        },
      });

      detectorRef.current = detector;
      return await detector.calibrateAmbientNoise();

    } catch (error) {
      console.error('[useSmartAudio] Calibration error:', error);
      toast.error('Failed to access microphone');
      return false;
    } finally {
      setIsCalibrating(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, autoStart, handleViolation, handleRiskUpdate]);

  // ── Start monitoring ───────────────────────────────────────────────────────
  const startMonitoring = useCallback(async () => {
    if (!enabled || isMonitoring) return false;

    try {
      if (!detectorRef.current) {
        const detector = new SmartAudioDetection({
          onViolation:  handleViolation,
          onRiskUpdate: handleRiskUpdate,
        });
        detectorRef.current = detector;
        await detector.calibrateAmbientNoise({ durationMs: 1000, silent: true });
        setIsCalibrated(true);
      }

      const cleanup = await detectorRef.current.startVoiceMonitoring();
      cleanupRef.current = cleanup;
      setIsMonitoring(true);
      console.log('[useSmartAudio] Monitoring started');
      return true;
    } catch (error) {
      console.error('[useSmartAudio] Failed to start monitoring:', error);
      toast.error('Failed to start audio monitoring');
      return false;
    }
  }, [enabled, isMonitoring, handleViolation, handleRiskUpdate]);

  // ── Stop monitoring ────────────────────────────────────────────────────────
  const stopMonitoring = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setIsMonitoring(false);
    console.log('[useSmartAudio] Monitoring stopped');
  }, []);

  // ── Reset risk score ───────────────────────────────────────────────────────
  const resetRiskScore = useCallback(() => {
    detectorRef.current?.resetRiskScore();
    setRiskScore(0);
    setDecayedRiskScore(0);
    setRiskLevel('No suspicious activity');
  }, []);

  // ── Debug state ────────────────────────────────────────────────────────────
  const getDetectorState = useCallback(() => {
    return detectorRef.current?.getState() ?? null;
  }, []);

  // ── Load persisted scores on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    try {
      const raw     = localStorage.getItem('examAudioRiskScore');
      const decayed = localStorage.getItem('examAudioDecayedRiskScore');
      const rawVal     = raw     ? Math.min(100, Math.max(0, parseInt(raw,     10))) : 0;
      const decayedVal = decayed ? Math.min(100, Math.max(0, parseInt(decayed, 10))) : 0;
      setRiskScore(rawVal);
      setDecayedRiskScore(decayedVal);
      _updateRiskLevel(decayedVal);
    } catch (_) { /* storage unavailable */ }
  }, [enabled, _updateRiskLevel]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopMonitoring();
      detectorRef.current = null;
    };
  }, [stopMonitoring]);

  return {
    // Calibration
    isCalibrating,
    calibrationProgress,
    isCalibrated,
    startCalibration,

    // Monitoring
    isMonitoring,
    startMonitoring,
    stopMonitoring,

    // Risk — FIX 4: both scores exposed
    riskScore,          // raw total (for admin audit)
    decayedRiskScore,   // time-decayed (for warnings / UI)
    riskLevel,          // label derived from decayedRiskScore
    resetRiskScore,

    // Utilities
    getDetectorState,
    isReady:            isCalibrated && !isCalibrating,
    canStartMonitoring: isCalibrated && !isMonitoring,
  };
};

export default useSmartAudioDetection;
