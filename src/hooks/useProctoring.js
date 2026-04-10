/**
 * useProctoring — single hook that drives the entire proctoring pipeline.
 *
 * Replaces useFaceDetection + useGazeDetection with a unified, production-grade API.
 *
 * Key additions over v1:
 *  • calibrateGaze()  — run during the audio calibration modal to capture the
 *                       student's personal iris/head baseline.
 *  • GazeTemporalBuffer — gaze violations are only surfaced after 70% of frames
 *                         in a 3 s window are deviated (eliminates single-frame noise).
 *
 * Usage:
 *   const {
 *     isReady, faceCount, isLookingAway, gazeDirection,
 *     score, decision, tabSwitchCount, violations, getReport,
 *     calibrateGaze, isGazeCalibrated,
 *   } = useProctoring({ videoRef, enabled, onViolation });
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ProctoringOrchestrator, Decision } from '../utils/proctoring/ProctoringOrchestrator.js';
import { GazeTemporalBuffer }               from '../utils/proctoring/GazeTemporalBuffer.js';

export { Decision };

const useProctoring = ({
  videoRef,
  enabled        = true,
  onViolation    = null,   // (logEntry) => void
  onGazePattern  = null,   // ({ patternType, direction, count, severity }) => void
  faceIntervalMs = 800,
  gazeIntervalMs = 400,
} = {}) => {
  const [isReady,          setIsReady]          = useState(false);
  const [faceCount,        setFaceCount]        = useState(0);
  const [isLookingAway,    setIsLookingAway]    = useState(false);
  const [gazeDirection,    setGazeDirection]    = useState('center');
  const [gazeAngles,       setGazeAngles]       = useState(null);
  const [score,            setScore]            = useState(0);
  const [decision,         setDecision]         = useState(Decision.CLEAN);
  const [tabSwitchCount,   setTabSwitchCount]   = useState(0);
  const [violations,       setViolations]       = useState([]);
  const [isGazeCalibrated, setIsGazeCalibrated] = useState(false);
  const [gazePattern,      setGazePattern]      = useState(null); // latest repetitive pattern

  const orchestratorRef    = useRef(null);
  const gazeBufferRef      = useRef(new GazeTemporalBuffer({
    windowMs:      3000,
    minSamples:    5,
    deviationRate: 0.70,
  }));
  // Tracks whether a buffer-confirmed violation is already in cooldown
  const gazeViolationCooldownRef = useRef(false);

  // ─── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const orc = new ProctoringOrchestrator({
      faceIntervalMs,
      gazeIntervalMs,

      onFaceCount: count => setFaceCount(count),

      onGazeChange: ({ isLookingAway: away, direction, angles, irisH, irisV, gazeScore }) => {
        // ── 1. Update UI state immediately ──────────────────────────────
        setIsLookingAway(away);
        setGazeDirection(direction);
        setGazeAngles(angles ?? null);

        // ── 2. Feed GazeTemporalBuffer ──────────────────────────────────
        const gazeEngine  = orchestratorRef.current?._gazeEngine;
        const gazeData    = { irisH: irisH ?? 0.5, irisV: irisV ?? 0.5, gazeScore: gazeScore ?? 0 };
        const isDeviated  = gazeEngine
          ? gazeEngine.isGazeDeviated(gazeData)
          : away;   // fallback to head-pose only if engine not ready

        gazeBufferRef.current.push(isDeviated);

        // ── 3. Only trigger violation after temporal confirmation ────────
        if (
          gazeBufferRef.current.shouldTriggerViolation() &&
          !gazeViolationCooldownRef.current
        ) {
          gazeViolationCooldownRef.current = true;

          // The logger/scorer inside HeadPoseEngine handles actual violation
          // recording — we just reset the cooldown after 10 s so the buffer
          // can trigger again if the student keeps cheating.
          setTimeout(() => {
            gazeViolationCooldownRef.current = false;
            gazeBufferRef.current.reset();
          }, 10_000);
        }

        // Reset buffer when student returns to normal gaze
        if (!away && !isDeviated) {
          gazeBufferRef.current.reset();
        }
      },

      onTabSwitch: ({ count }) => setTabSwitchCount(count),

      onGazePattern: payload => {
        setGazePattern(payload);
        onGazePattern?.(payload);
        // Auto-clear pattern warning after 8 s
        setTimeout(() => setGazePattern(null), 8_000);
      },

      onScoreUpdate: ({ score: s, decision: d }) => {
        setScore(s);
        setDecision(d);
      },

      onViolation: entry => {
        setViolations(prev => [entry, ...prev].slice(0, 200));
        onViolation?.(entry);
      },
    });

    orchestratorRef.current = orc;

    orc.init().then(ok => {
      setIsReady(ok);
      if (!ok) console.warn('[useProctoring] No detection engine available');
    });

    return () => {
      orc.destroy();
      orchestratorRef.current = null;
      gazeBufferRef.current.reset();
      gazeViolationCooldownRef.current = false;
      setIsReady(false);
      setIsGazeCalibrated(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // ─── Start monitoring when video is ready ──────────────────────────────────
  useEffect(() => {
    if (!isReady || !videoRef?.current || !enabled) return;

    const video = videoRef.current;

    const tryStart = () => {
      if (video.readyState >= 2 && orchestratorRef.current) {
        orchestratorRef.current.start(video);
      }
    };

    if (video.readyState >= 2) {
      tryStart();
    } else {
      video.addEventListener('loadedmetadata', tryStart, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', tryStart);
      orchestratorRef.current?.stop();
    };
  }, [isReady, videoRef, enabled]);

  // ─── Gaze calibration (call during audio calibration modal) ────────────────

  /**
   * Runs gaze calibration for 3 seconds while the student looks at the screen.
   * Designed to run in parallel with the existing audio calibration modal.
   *
   * @param {number} [durationMs=3000] - how long to collect baseline samples
   * @returns {Promise<boolean>} true if calibration succeeded
   */
  const calibrateGaze = useCallback(async (durationMs = 3000) => {
    const gazeEngine = orchestratorRef.current?._gazeEngine;
    if (!gazeEngine) {
      console.warn('[useProctoring] calibrateGaze: engine not ready');
      return false;
    }

    // Provide a callback that returns the latest landmarks from the engine
    const getLandmarks = async () => {
      // HeadPoseEngine processes frames internally; we access the latest
      // landmark set it stored after the last _onResults call.
      return gazeEngine.lastLandmarks ?? null;
    };

    const ok = await gazeEngine.calibrate(getLandmarks, durationMs);
    setIsGazeCalibrated(ok);
    gazeBufferRef.current.reset();
    return ok;
  }, []);

  // ─── Public API ────────────────────────────────────────────────────────────

  const getReport = useCallback(() => {
    return orchestratorRef.current?.getReport() ?? null;
  }, []);

  const getLogger = useCallback(() => {
    return orchestratorRef.current?.logger ?? null;
  }, []);

  return {
    isReady,
    faceCount,
    isLookingAway,
    gazeDirection,
    gazeAngles,
    score,
    decision,
    tabSwitchCount,
    violations,
    gazePattern,
    // Gaze calibration
    calibrateGaze,
    isGazeCalibrated,
    // Helpers
    getReport,
    getLogger,
  };
};

export default useProctoring;
