/**
 * HeadPoseEngine — production head-pose + iris/pupil estimation via MediaPipe FaceMesh.
 *
 * Improvements over v1:
 *  1. Iris tracking using landmarks 468–477 (requires refineLandmarks: true).
 *  2. Fused gazeScore: iris position dominates, head pose only supports.
 *  3. Per-student calibration baseline via calibrate() method.
 *  4. isGazeDeviated() returns true only when delta exceeds calibrated threshold.
 *  5. Existing head-pose smoothing & violation logging preserved.
 */

import { ExponentialSmoother, TemporalFilter } from './TemporalFilter.js';
import { EventType, Severity } from './ProctoringLogger.js';

// ─── Landmark indices (MediaPipe 468-point mesh + iris 468-477) ──────────────
const LM = {
  // Head-pose 6-point model
  NOSE_TIP:      1,
  CHIN:          152,
  LEFT_EYE:      33,   // left eye outer corner
  RIGHT_EYE:     263,  // right eye outer corner
  LEFT_MOUTH:    61,
  RIGHT_MOUTH:   291,

  // Iris landmarks (refineLandmarks must be true)
  LEFT_IRIS:     468,  // left iris centre
  RIGHT_IRIS:    473,  // right iris centre

  // Eye corners for horizontal ratio
  L_EYE_OUTER:   33,
  L_EYE_INNER:   133,
  R_EYE_INNER:   362,
  R_EYE_OUTER:   263,

  // Eye top/bottom for vertical ratio
  L_EYE_TOP:     159,
  L_EYE_BOTTOM:  145,
  R_EYE_TOP:     386,
  R_EYE_BOTTOM:  374,
};

// ─── Head-pose angle thresholds (degrees) ────────────────────────────────────
const HEAD_THRESHOLDS = {
  yaw:            22,
  pitch:          18,
  roll:           20,
  pitchDownGrace: 28,
};

// ─── Iris deviation thresholds (after baseline subtraction) ──────────────────
const IRIS_THRESHOLDS = {
  horizontal: 0.15,   // ratio units
  vertical:   0.18,
};

// ─── Fused gaze score divisors (score >= 1.0 → deviated) ────────────────────
const FUSE = {
  irisH:   0.15,
  headYaw: 25,
  irisV:   0.20,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Clamp a value to [min, max] */
const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

/** Safe ratio; avoids division by zero */
const ratio = (num, denom) => (Math.abs(denom) > 1e-6 ? num / denom : 0);

export class HeadPoseEngine {
  /**
   * @param {object} opts
   * @param {ProctoringLogger}    opts.logger
   * @param {CheatingScoreEngine} opts.scorer
   * @param {function} opts.onGazeChange  - ({ isLookingAway, direction, angles, gazeScore }) => void
   * @param {number}   opts.intervalMs    - detection cadence (default 400 ms)
   */
  constructor({ logger, scorer, onGazeChange, intervalMs = 400 } = {}) {
    this._logger       = logger;
    this._scorer       = scorer;
    this._onGazeChange = onGazeChange;
    this._intervalMs   = intervalMs;

    // Angle smoothers
    this._yawSmoother   = new ExponentialSmoother(0.3);
    this._pitchSmoother = new ExponentialSmoother(0.3);
    this._rollSmoother  = new ExponentialSmoother(0.3);

    // Iris smoothers (lighter — iris moves fast)
    this._irisHSmoother = new ExponentialSmoother(0.45);
    this._irisVSmoother = new ExponentialSmoother(0.45);

    // Temporal filter: 2.5 s window, 70% agreement before "away" is confirmed
    this._awayFilter = new TemporalFilter(2500, 0.70);

    this._faceMesh  = null;
    this._timer     = null;
    this._isAway    = false;
    this._awayStart = null;
    this._violationCooldown  = false;
    this._isBusy   = false;

    // Head-pose internal neutral baseline (built from first stable frames)
    this._neutralBaseline     = null;
    this._calibrationFrames   = [];
    this._calibrationComplete = false;
    this._lastDirection       = 'center';

    // Per-student gaze baseline (set by calibrate())
    this.baseline = null;          // { irisH, irisV, headYaw, headPitch }
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
        refineLandmarks:        true,   // REQUIRED for iris landmarks 468-477
        minDetectionConfidence: 0.65,
        minTrackingConfidence:  0.55,
      });

      this._faceMesh.onResults(r => this._onResults(r));
      console.log('[HeadPoseEngine] MediaPipe FaceMesh ready (iris tracking enabled)');
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
      if (this._isBusy || videoEl.readyState < 2) return;
      this._isBusy = true;
      try {
        await this._faceMesh.send({ image: videoEl });
      } finally {
        this._isBusy = false;
      }
    }, this._intervalMs);
    return true;
  }

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this._yawSmoother.reset();
    this._pitchSmoother.reset();
    this._rollSmoother.reset();
    this._irisHSmoother.reset();
    this._irisVSmoother.reset();
    this._awayFilter.reset();
    this._isAway    = false;
    this._awayStart = null;
    this._isBusy    = false;
    this._neutralBaseline     = null;
    this._calibrationFrames   = [];
    this._calibrationComplete = false;
    this._lastDirection       = 'center';
    this.baseline             = null;
  }

  destroy() {
    this.stop();
    if (this._faceMesh?.close) this._faceMesh.close();
  }

  // ─── Per-Student Calibration ───────────────────────────────────────────────

  /**
   * Collect landmark samples for `durationMs` milliseconds and store the
   * average iris / head-pose values as the personal baseline.
   *
   * @param {function} getLandmarksCallback - async () => landmarks[] | null
   *   Should resolve to the latest MediaPipe landmark array (or null).
   *   In practice you can expose this via a ref that _onResults updates.
   * @param {number}   durationMs  - collection window (default 3000 ms)
   * @returns {Promise<boolean>}   true on success, false if not enough frames
   */
  async calibrate(getLandmarksCallback, durationMs = 3000) {
    console.log('[HeadPoseEngine] Calibration started …');

    const samples = [];
    const interval = 100; // sample every 100 ms
    const ticks    = Math.floor(durationMs / interval);

    for (let i = 0; i < ticks; i++) {
      await new Promise(r => setTimeout(r, interval));
      const lm = await getLandmarksCallback();
      if (!lm) continue;

      const raw   = this._computeAngles(lm);
      const iris  = this._computeIris(lm);
      if (!iris) continue;

      samples.push({
        irisH:    iris.irisHorizontal,
        irisV:    iris.irisVertical,
        headYaw:  raw.yaw,
        headPitch: raw.pitch,
      });
    }

    if (samples.length < 5) {
      console.warn('[HeadPoseEngine] Calibration failed — not enough frames', samples.length);
      return false;
    }

    const avg = samples.reduce(
      (acc, s) => ({
        irisH:     acc.irisH     + s.irisH,
        irisV:     acc.irisV     + s.irisV,
        headYaw:   acc.headYaw   + s.headYaw,
        headPitch: acc.headPitch + s.headPitch,
      }),
      { irisH: 0, irisV: 0, headYaw: 0, headPitch: 0 }
    );

    const n = samples.length;
    this.baseline = {
      irisH:     avg.irisH     / n,
      irisV:     avg.irisV     / n,
      headYaw:   avg.headYaw   / n,
      headPitch: avg.headPitch / n,
    };

    console.log('[HeadPoseEngine] Calibration complete', this.baseline);
    return true;
  }

  // ─── Public gaze deviation check ───────────────────────────────────────────

  /**
   * Returns true when the current gaze data deviates from the baseline
   * beyond the iris deviation thresholds.
   * Returns false if no baseline is set yet (wait for calibration).
   *
   * @param {{ irisH: number, irisV: number, gazeScore: number }} gazeData
   */
  isGazeDeviated(gazeData) {
    if (!this.baseline) return false;   // no calibration yet — don't flag

    const irisH_delta = Math.abs(gazeData.irisH - this.baseline.irisH);
    const irisV_delta = Math.abs(gazeData.irisV - this.baseline.irisV);

    return (
      irisH_delta > IRIS_THRESHOLDS.horizontal ||
      irisV_delta > IRIS_THRESHOLDS.vertical
    );
  }

  // ─── Results handler ───────────────────────────────────────────────────────

  _onResults(results) {
    if (!results.multiFaceLandmarks?.length) return;

    const lm = results.multiFaceLandmarks[0];
    this._lastLandmarks = lm;   // expose for calibrate() callback

    // ── Head pose ─────────────────────────────────────────────────────────
    const raw    = this._computeAngles(lm);
    this._maybeBuildNeutralBaseline(raw);
    const corrected = this._applyNeutralBaseline(raw);
    const angles = {
      yaw:   this._yawSmoother.push(corrected.yaw),
      pitch: this._pitchSmoother.push(corrected.pitch),
      roll:  this._rollSmoother.push(corrected.roll),
    };

    // ── Iris tracking ─────────────────────────────────────────────────────
    const irisRaw = this._computeIris(lm);
    const irisH = irisRaw
      ? this._irisHSmoother.push(irisRaw.irisHorizontal)
      : 0.5;
    const irisV = irisRaw
      ? this._irisVSmoother.push(irisRaw.irisVertical)
      : 0.5;

    // ── Fused gaze score ──────────────────────────────────────────────────
    // iris offset from screen centre (0.5), relative to thresholds
    const irisOffsetH = Math.abs(irisH - 0.5);
    const irisOffsetV = Math.abs(irisV - 0.5);

    const gazeScore = Math.max(
      irisOffsetH           / FUSE.irisH,
      Math.abs(angles.yaw)  / FUSE.headYaw,
      irisOffsetV           / FUSE.irisV,
    );

    // Store on instance so calibrate() / isGazeDeviated() can read it
    this._lastGazeData = { irisH, irisV, gazeScore };

    // ── Decision via temporal filter ──────────────────────────────────────
    const lookingAway = this._isLookingAway(angles) || gazeScore >= 1.0;
    const confirmed   = this._awayFilter.push(lookingAway);
    const direction   = this._direction(angles);

    this._updateState(confirmed, direction, angles, { irisH, irisV, gazeScore });
  }

  // ─── Iris computation ──────────────────────────────────────────────────────

  /**
   * Returns { irisHorizontal, irisVertical } in [0, 1] for the average of
   * both eyes, or null if iris landmarks are unavailable.
   * 0 = far left/up, 0.5 = centre, 1.0 = far right/down.
   */
  _computeIris(lm) {
    // Iris landmarks only exist when refineLandmarks: true
    if (!lm[LM.LEFT_IRIS] || !lm[LM.RIGHT_IRIS]) return null;

    // ── Left eye ──────────────────────────────────────────────────────────
    const lIris  = lm[LM.LEFT_IRIS];
    const lOuter = lm[LM.L_EYE_OUTER];
    const lInner = lm[LM.L_EYE_INNER];
    const lTop   = lm[LM.L_EYE_TOP];
    const lBot   = lm[LM.L_EYE_BOTTOM];

    const lEyeW  = Math.abs(lInner.x - lOuter.x);
    const lEyeH  = Math.abs(lBot.y   - lTop.y);
    const lH     = clamp(ratio(lIris.x - lOuter.x, lEyeW), 0, 1);
    const lV     = clamp(ratio(lIris.y - lTop.y,   lEyeH), 0, 1);

    // ── Right eye ─────────────────────────────────────────────────────────
    const rIris  = lm[LM.RIGHT_IRIS];
    const rInner = lm[LM.R_EYE_INNER];
    const rOuter = lm[LM.R_EYE_OUTER];
    const rTop   = lm[LM.R_EYE_TOP];
    const rBot   = lm[LM.R_EYE_BOTTOM];

    const rEyeW  = Math.abs(rOuter.x - rInner.x);
    const rEyeH  = Math.abs(rBot.y   - rTop.y);
    const rH     = clamp(ratio(rIris.x - rInner.x, rEyeW), 0, 1);
    const rV     = clamp(ratio(rIris.y - rTop.y,   rEyeH), 0, 1);

    return {
      irisHorizontal: (lH + rH) / 2,
      irisVertical:   (lV + rV) / 2,
    };
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
    const eyeSpan = rEye.x - lEye.x;
    const noseL   = nose.x - lEye.x;
    const noseR   = rEye.x - nose.x;
    const yawNorm = eyeSpan > 0 ? (noseR - noseL) / eyeSpan : 0;
    const yaw     = yawNorm * 50;

    // ── Pitch (up/down) ───────────────────────────────────────────────────
    const eyeCY      = (lEye.y + rEye.y) / 2;
    const faceH      = Math.abs(chin.y - eyeCY) || 0.001;
    const pitchNorm  = (nose.y - eyeCY) / faceH - 0.45;
    const pitch      = pitchNorm * 60;

    // ── Roll (tilt) ───────────────────────────────────────────────────────
    const dx   = rEye.x - lEye.x;
    const dy   = rEye.y - lEye.y;
    const roll = Math.atan2(dy, dx) * (180 / Math.PI);

    return { yaw, pitch, roll };
  }

  _isLookingAway({ yaw, pitch, roll }) {
    if (Math.abs(yaw)  > HEAD_THRESHOLDS.yaw)  return true;
    if (Math.abs(roll) > HEAD_THRESHOLDS.roll)  return true;
    if (pitch < -HEAD_THRESHOLDS.pitch)         return true;  // looking up
    if (pitch > HEAD_THRESHOLDS.pitchDownGrace) return true;  // looking far down
    return false;
  }

  _direction({ yaw, pitch }) {
    if (Math.abs(yaw) > Math.abs(pitch)) {
      if (yaw >  HEAD_THRESHOLDS.yaw)  return 'right';
      if (yaw < -HEAD_THRESHOLDS.yaw)  return 'left';
    }
    if (pitch < -HEAD_THRESHOLDS.pitch)         return 'up';
    if (pitch >  HEAD_THRESHOLDS.pitchDownGrace) return 'down';
    return 'center';
  }

  // ─── State machine ─────────────────────────────────────────────────────────

  _updateState(isAway, direction, angles, irisData = {}) {
    const now = Date.now();

    if (isAway && !this._isAway) {
      this._isAway    = true;
      this._awayStart = now;
      this._onGazeChange?.({ isLookingAway: true, direction, angles, ...irisData });
      this._lastDirection = direction;
    }

    if (!isAway && this._isAway) {
      this._isAway    = false;
      this._awayStart = null;
      this._violationCooldown = false;
      this._onGazeChange?.({ isLookingAway: false, direction: 'center', angles, ...irisData });
      this._lastDirection = 'center';
    } else if (direction !== this._lastDirection && this._isAway) {
      this._onGazeChange?.({ isLookingAway: true, direction, angles, ...irisData });
      this._lastDirection = direction;
    }

    // Violation: looking away for > 4 s
    if (this._isAway && this._awayStart && !this._violationCooldown) {
      const duration = (now - this._awayStart) / 1000;
      if (duration >= 4) {
        this._violationCooldown = true;
        const sev = duration > 10
          ? Severity.HIGH
          : duration > 6 ? Severity.MEDIUM : Severity.LOW;

        this._logger?.record(EventType.LOOKING_AWAY, sev, {
          direction,
          durationSec: Math.round(duration),
          angles: {
            yaw:   Math.round(angles.yaw),
            pitch: Math.round(angles.pitch),
            roll:  Math.round(angles.roll),
          },
          gazeScore:    irisData.gazeScore  ? +irisData.gazeScore.toFixed(3)  : null,
          irisH:        irisData.irisH      != null ? +irisData.irisH.toFixed(3) : null,
          irisV:        irisData.irisV      != null ? +irisData.irisV.toFixed(3) : null,
          irisTracking: irisData.irisH      != null,
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

  _maybeBuildNeutralBaseline(rawAngles) {
    if (this._calibrationComplete) return;
    const stable =
      Math.abs(rawAngles.yaw)   < 18 &&
      Math.abs(rawAngles.pitch) < 20 &&
      Math.abs(rawAngles.roll)  < 18;

    if (!stable) return;
    this._calibrationFrames.push(rawAngles);
    if (this._calibrationFrames.length < 12) return;

    const avg = this._calibrationFrames.reduce(
      (acc, a) => ({
        yaw:   acc.yaw   + a.yaw,
        pitch: acc.pitch + a.pitch,
        roll:  acc.roll  + a.roll,
      }),
      { yaw: 0, pitch: 0, roll: 0 }
    );

    const n = this._calibrationFrames.length;
    this._neutralBaseline = {
      yaw:   avg.yaw   / n,
      pitch: avg.pitch / n,
      roll:  avg.roll  / n,
    };
    this._calibrationComplete = true;
  }

  _applyNeutralBaseline(rawAngles) {
    if (!this._neutralBaseline) return rawAngles;
    return {
      yaw:   rawAngles.yaw   - this._neutralBaseline.yaw,
      pitch: rawAngles.pitch - this._neutralBaseline.pitch,
      roll:  rawAngles.roll  - this._neutralBaseline.roll,
    };
  }

  /** Expose latest gaze data for external access (e.g. calibrate callback). */
  get lastGazeData() { return this._lastGazeData ?? null; }

  /** Expose latest landmarks for external access. */
  get lastLandmarks() { return this._lastLandmarks ?? null; }
}
