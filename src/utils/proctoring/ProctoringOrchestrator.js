/**
 * ProctoringOrchestrator — single entry point for the entire pipeline.
 *
 * Pipeline:
 *   Camera/DOM events
 *       ↓
 *   FaceDetectionEngine  ──┐
 *   HeadPoseEngine       ──┤──→  ProctoringLogger  ──→  CheatingScoreEngine
 *   TabSwitchEngine      ──┘                                    ↓
 *                                                         Decision (CLEAN / WARNING / SUSPECT / CHEATING)
 *
 * Usage:
 *   const proctor = new ProctoringOrchestrator({ onScoreUpdate, onViolation });
 *   await proctor.init();
 *   proctor.start(videoElement);
 *   // ... exam runs ...
 *   const report = proctor.getReport();
 *   proctor.destroy();
 */

import { ProctoringLogger }   from './ProctoringLogger.js';
import { CheatingScoreEngine, Decision } from './CheatingScoreEngine.js';
import { FaceDetectionEngine } from './FaceDetectionEngine.js';
import { HeadPoseEngine }      from './HeadPoseEngine.js';
import { TabSwitchEngine }     from './TabSwitchEngine.js';
import { EventType }           from './ProctoringLogger.js';

export { Decision, EventType };

export class ProctoringOrchestrator {
  /**
   * @param {object} opts
   * @param {function} opts.onScoreUpdate   - ({ score, decision }) => void
   * @param {function} opts.onViolation     - (logEntry) => void  — called on every logged event
   * @param {function} opts.onFaceCount     - (count: number) => void
   * @param {function} opts.onGazeChange    - ({ isLookingAway, direction, angles }) => void
   * @param {function} opts.onTabSwitch     - ({ count, severity, durationMs }) => void
   * @param {number}   opts.faceIntervalMs  - face detection cadence (default 800)
   * @param {number}   opts.gazeIntervalMs  - gaze detection cadence (default 400)
   */
  constructor({
    onScoreUpdate,
    onViolation,
    onFaceCount,
    onGazeChange,
    onTabSwitch,
    faceIntervalMs = 800,
    gazeIntervalMs = 400,
  } = {}) {
    this._logger = new ProctoringLogger();
    this._scorer = new CheatingScoreEngine({ logger: this._logger });

    this._faceEngine = new FaceDetectionEngine({
      logger:            this._logger,
      scorer:            this._scorer,
      onFaceCountChange: onFaceCount,
      intervalMs:        faceIntervalMs,
    });

    this._gazeEngine = new HeadPoseEngine({
      logger:        this._logger,
      scorer:        this._scorer,
      onGazeChange:  onGazeChange,
      intervalMs:    gazeIntervalMs,
    });

    this._tabEngine = new TabSwitchEngine({
      logger:       this._logger,
      scorer:       this._scorer,
      onTabSwitch:  onTabSwitch,
    });

    // Forward score updates
    this._scorer.subscribe(snap => onScoreUpdate?.(snap));

    // Forward every log entry as a violation event
    this._logger.subscribe(entry => onViolation?.(entry));

    this._ready = false;
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  async init() {
    const [faceOk, gazeOk] = await Promise.all([
      this._faceEngine.init(),
      this._gazeEngine.init(),
    ]);

    if (!faceOk) console.warn('[Orchestrator] Face detection unavailable');
    if (!gazeOk) console.warn('[Orchestrator] Head pose unavailable');

    this._ready = faceOk || gazeOk;
    return this._ready;
  }

  start(videoEl) {
    if (!this._ready) {
      console.error('[Orchestrator] Call init() first');
      return false;
    }
    this._faceEngine.start(videoEl);
    this._gazeEngine.start(videoEl);
    this._tabEngine.start();
    console.log('[Orchestrator] Proctoring started');
    return true;
  }

  stop() {
    this._faceEngine.stop();
    this._gazeEngine.stop();
    this._tabEngine.stop();
  }

  destroy() {
    this.stop();
    this._faceEngine.destroy();
    this._gazeEngine.destroy();
    this._scorer.destroy();
  }

  // ─── Data access ───────────────────────────────────────────────────────────

  /** Current score snapshot. */
  get scoreSnapshot() { return this._scorer.snapshot(); }

  /** Full structured report for backend submission. */
  getReport() {
    return {
      score:    this._scorer.score,
      decision: this._scorer.decision,
      summary:  this._logger.summary(),
      events:   this._logger.getEvents(),
    };
  }

  /** Raw event log (for debugging / export). */
  get logger() { return this._logger; }
}
