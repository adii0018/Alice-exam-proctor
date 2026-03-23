/**
 * useProctoring — single hook that drives the entire proctoring pipeline.
 *
 * Replaces useFaceDetection + useGazeDetection with a unified, production-grade API.
 *
 * Usage:
 *   const {
 *     isReady, faceCount, isLookingAway, gazeDirection,
 *     score, decision, tabSwitchCount, violations, getReport
 *   } = useProctoring({ videoRef, enabled, onViolation });
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ProctoringOrchestrator, Decision } from '../utils/proctoring/ProctoringOrchestrator.js';

export { Decision };

const useProctoring = ({
  videoRef,
  enabled       = true,
  onViolation   = null,   // (logEntry) => void
  faceIntervalMs = 800,
  gazeIntervalMs = 400,
} = {}) => {
  const [isReady,       setIsReady]       = useState(false);
  const [faceCount,     setFaceCount]     = useState(0);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [gazeDirection, setGazeDirection] = useState('center');
  const [gazeAngles,    setGazeAngles]    = useState(null);
  const [score,         setScore]         = useState(0);
  const [decision,      setDecision]      = useState(Decision.CLEAN);
  const [tabSwitchCount,setTabSwitchCount]= useState(0);
  const [violations,    setViolations]    = useState([]);

  const orchestratorRef = useRef(null);

  // ─── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const orc = new ProctoringOrchestrator({
      faceIntervalMs,
      gazeIntervalMs,

      onFaceCount: count => setFaceCount(count),

      onGazeChange: ({ isLookingAway: away, direction, angles }) => {
        setIsLookingAway(away);
        setGazeDirection(direction);
        setGazeAngles(angles ?? null);
      },

      onTabSwitch: ({ count }) => setTabSwitchCount(count),

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
      setIsReady(false);
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
    getReport,
    getLogger,
  };
};

export default useProctoring;
