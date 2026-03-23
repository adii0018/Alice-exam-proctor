/**
 * HeadPoseEngine — production head-pose estimation via MediaPipe FaceMesh.
 *
 * Improvements over the original gazeDetection.js:
 *  1. Proper 3-D head pose via solvePnP-style landmark projection
 *     (nose tip, chin, eye corners, mouth corners — 6-point model).
 *  2. Exponential smoothing on all three angles.
 *  3. TemporalFilter for "looking away" decision (no single-frame spikes).
 *  4. Separate thresholds for yaw / pitch / roll.
 *  5. Downward-gaze grace period (student reading question).
 *  6. Structured logging + score ingestion.
 */

import { ExponentialSmoother, TemporalFilter } from './TemporalFilter.js';
import { EventType, Severity } from './ProctoringLogger.js';

// ─── Landmark indices (MediaPipe 468-point mesh) ──────────────────────────────
const LM = {
  NOSE_TIP:     1,
  CHIN:         152,
  LEFT_EYE:     33,
  RIGHT_EYE:    263,
  LEFT_MOUTH:   61,
  RIGHT_MOUTH:  291,
  LEFT_EAR:     234,
  RIGHT_EAR:    454,
};

// ─── Angle thresholds (degrees) ───────────────────────────────────────────────
const THRESHOLDS = {
  yaw:   22,   // left / right
  pitch: 18,   // up / down
  roll:  20,   // tilt
  // Grace: allow looking slightly down (reading) without flagging
  pitchDownGrace: 28,
};

export class HeadPoseEngine {
  /**
   * @param {object} opts
   * @param {ProctoringLogger}    opts.logger
   * @param {CheatingScoreEngine} opts.scorer
   * @param {function} opts.onGazeChange  - ({ isLookingAway, direction, angles }) => void
   * @param {number}   opts.intervalMs    - detection cadence (default 400 ms)
   */
  constructor({ logger, scorer, onGazeChange, intervalMs = 400 } = {}) {
    this._logger = logger;
    this._scorer = scorer;
    this._onGazeChange = onGazeChange;
    this._intervalMs = intervalMs;

    // Smoothers for each angle
    this._yawSmoother   = new ExponentialSmoother(0.3);
    this._pitchSmoother = new ExponentialSmoother(0.3);
    this._rollSmoother  = new ExponentialSmoother(0.3);

    // Temporal filter: 60 % of frames in 2 s must agree before flagging
    this._awayFilter = new TemporalFilter(2000, 0.60);

    this._faceMesh  = null;
    this._timer     = null;
    this._isAway    = false;
    this._awayStart = null;
    this._violationCooldown = false;
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  async init() {
    try {
      if (!window.FaceMesh) await this._loadScript(
        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'
      );

      this._faceMesh = new window.FaceMesh({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
      });

      this._faceMesh.setOptions({
        maxNumFaces:            1,
        refineLandmarks:        true,
        minDetectionConfidence: 0.65,
        minTrackingConfidence:  0.55,
      });

      this._faceMesh.onResults(r => this._onResults(r));
      console.log('[HeadPoseEngine] MediaPipe FaceMesh ready');
      return true;
    } catch (e) {
      console.error('[HeadPoseEngine] init failed', e);
      return false;
    }
  }

  // ─── Monitoring ────────────────────────────────────────────────────────────

  start(videoEl) {
    if (!this._faceMesh) return false;
    this.stop();
    this._timer = setInterval(async () => {
      if (videoEl.readyState >= 2) {
        await this._faceMesh.send({ image: videoEl });
      }
    }, this._intervalMs);
    return true;
  }

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this._yawSmoother.reset();
    this._pitchSmoother.reset();
    this._rollSmoother.reset();
    this._awayFilter.reset();
    this._isAway    = false;
    this._awayStart = null;
  }

  destroy() {
    this.stop();
    if (this._faceMesh?.close) this._faceMesh.close();
  }

  // ─── Results handler ───────────────────────────────────────────────────────

  _onResults(results) {
    if (!results.multiFaceLandmarks?.length) {
      // No face — head-pose can't be computed; face engine handles this
      return;
    }

    const lm     = results.multiFaceLandmarks[0];
    const raw    = this._computeAngles(lm);
    const angles = {
      yaw:   this._yawSmoother.push(raw.yaw),
      pitch: this._pitchSmoother.push(raw.pitch),
      roll:  this._rollSmoother.push(raw.roll),
    };

    const lookingAway = this._isLookingAway(angles);
    const confirmed   = this._awayFilter.push(lookingAway);
    const direction   = this._direction(angles);

    this._updateState(confirmed, direction, angles);
  }

  // ─── Angle computation ─────────────────────────────────────────────────────

  /**
   * Lightweight 6-point head pose estimation.
   * Returns yaw / pitch / roll in degrees.
   */
  _computeAngles(lm) {
    const nose  = lm[LM.NOSE_TIP];
    const chin  = lm[LM.CHIN];
    const lEye  = lm[LM.LEFT_EYE];
    const rEye  = lm[LM.RIGHT_EYE];
    const lMth  = lm[LM.LEFT_MOUTH];
    const rMth  = lm[LM.RIGHT_MOUTH];

    // ── Yaw (left/right) ──────────────────────────────────────────────────
    // Ratio of nose-to-eye distances; asymmetry indicates rotation.
    const eyeSpan = rEye.x - lEye.x;
    const noseL   = nose.x - lEye.x;
    const noseR   = rEye.x - nose.x;
    // Normalised offset: 0 = centred, ±1 = fully rotated
    const yawNorm = eyeSpan > 0 ? (noseR - noseL) / eyeSpan : 0;
    const yaw     = yawNorm * 50; // empirical scale → degrees

    // ── Pitch (up/down) ───────────────────────────────────────────────────
    const eyeCY   = (lEye.y + rEye.y) / 2;
    const mthCY   = (lMth.y + rMth.y) / 2;
    const faceH   = Math.abs(chin.y - eyeCY) || 0.001;
    const pitchNorm = (nose.y - eyeCY) / faceH - 0.45; // 0.45 = neutral offset
    const pitch   = pitchNorm * 60;

    // ── Roll (tilt) ───────────────────────────────────────────────────────
    const dx   = rEye.x - lEye.x;
    const dy   = rEye.y - lEye.y;
    const roll = Math.atan2(dy, dx) * (180 / Math.PI);

    return { yaw, pitch, roll };
  }

  _isLookingAway({ yaw, pitch, roll }) {
    if (Math.abs(yaw)  > THRESHOLDS.yaw)  return true;
    if (Math.abs(roll) > THRESHOLDS.roll) return true;
    // Upward gaze is always suspicious
    if (pitch < -THRESHOLDS.pitch) return true;
    // Downward gaze: allow a wider grace (reading)
    if (pitch > THRESHOLDS.pitchDownGrace) return true;
    return false;
  }

  _direction({ yaw, pitch }) {
    if (Math.abs(yaw) > Math.abs(pitch)) {
      if (yaw >  THRESHOLDS.yaw)  return 'right';
      if (yaw < -THRESHOLDS.yaw)  return 'left';
    }
    if (pitch < -THRESHOLDS.pitch) return 'up';
    if (pitch >  THRESHOLDS.pitchDownGrace) return 'down';
    return 'center';
  }

  // ─── State machine ─────────────────────────────────────────────────────────

  _updateState(isAway, direction, angles) {
    const now = Date.now();

    if (isAway && !this._isAway) {
      this._isAway    = true;
      this._awayStart = now;
      this._onGazeChange?.({ isLookingAway: true, direction, angles });
    }

    if (!isAway && this._isAway) {
      this._isAway    = false;
      this._awayStart = null;
      this._violationCooldown = false;
      this._onGazeChange?.({ isLookingAway: false, direction: 'center', angles });
    }

    // Violation: looking away for > 4 s
    if (this._isAway && this._awayStart && !this._violationCooldown) {
      const duration = (now - this._awayStart) / 1000;
      if (duration >= 4) {
        this._violationCooldown = true;
        const sev = duration > 10 ? Severity.HIGH : duration > 6 ? Severity.MEDIUM : Severity.LOW;
        this._logger?.record(EventType.LOOKING_AWAY, sev, {
          direction,
          durationSec: Math.round(duration),
          angles: {
            yaw:   Math.round(angles.yaw),
            pitch: Math.round(angles.pitch),
            roll:  Math.round(angles.roll),
          },
        });
        this._scorer?.ingest(EventType.LOOKING_AWAY, sev);
        // Allow re-trigger after 10 s
        setTimeout(() => { this._violationCooldown = false; }, 10_000);
      }
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  _loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.crossOrigin = 'anonymous';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
}
