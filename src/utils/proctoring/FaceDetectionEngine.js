/**
 * FaceDetectionEngine — production-grade face detection.
 *
 * Improvements over the original:
 *  1. MediaPipe BlazeFace (GPU-accelerated) as primary engine.
 *  2. face-api.js TinyFaceDetector as fallback.
 *  3. Bounding-box area filter — ignores tiny/background faces.
 *  4. Confidence threshold per detection.
 *  5. TemporalFilter for multi-frame validation (no single-frame spikes).
 *  6. Brightness check — warns instead of false-flagging in low light.
 *  7. Structured logging via ProctoringLogger.
 */

import { TemporalFilter } from './TemporalFilter.js';
import { EventType, Severity } from './ProctoringLogger.js';

// Minimum face bounding-box area as fraction of frame area.
// Faces smaller than this are treated as background noise.
const MIN_FACE_AREA_RATIO = 0.015; // 1.5 % of frame

// Minimum confidence score accepted from the detector.
const MIN_CONFIDENCE = 0.65;

export class FaceDetectionEngine {
  /**
   * @param {object} opts
   * @param {ProctoringLogger} opts.logger
   * @param {CheatingScoreEngine} opts.scorer
   * @param {function} opts.onFaceCountChange  - (count: number) => void
   * @param {number}   opts.intervalMs         - detection cadence (default 800 ms)
   */
  constructor({ logger, scorer, onFaceCountChange, intervalMs = 800 } = {}) {
    this._logger = logger;
    this._scorer = scorer;
    this._onFaceCountChange = onFaceCountChange;
    this._intervalMs = intervalMs;

    // Multi-frame validators
    this._missingFilter  = new TemporalFilter(2500, 0.65); // 65 % of frames in 2.5 s
    this._multipleFilter = new TemporalFilter(3000, 0.60);

    this._detector   = null;
    this._engine     = null; // 'mediapipe' | 'faceapi'
    this._timer      = null;
    this._lastCount  = -1;
    this._lowLight   = false;
    this._missingActive = false;
    this._multipleActive = false;
    this._lastMissingLogMs = 0;
    this._lastMultipleLogMs = 0;
    this._canvas     = document.createElement('canvas');
    this._ctx        = this._canvas.getContext('2d', { willReadFrequently: true });
  }

  // ─── Initialisation ────────────────────────────────────────────────────────

  async init() {
    if (await this._tryMediaPipe()) return true;
    if (await this._tryFaceApi())   return true;
    console.error('[FaceDetectionEngine] No engine available');
    return false;
  }

  async _tryMediaPipe() {
    try {
      if (!window.FaceDetection) return false;
      const resolver = await window.FaceDetection.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      this._detector = await window.FaceDetection.FaceDetector.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        minDetectionConfidence: MIN_CONFIDENCE,
      });
      this._engine = 'mediapipe';
      console.log('[FaceDetectionEngine] Using MediaPipe BlazeFace (GPU)');
      return true;
    } catch { return false; }
  }

  async _tryFaceApi() {
    try {
      if (!window.faceapi) return false;
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
      await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      this._engine = 'faceapi';
      console.log('[FaceDetectionEngine] Using face-api.js TinyFaceDetector (fallback)');
      return true;
    } catch { return false; }
  }

  // ─── Monitoring ────────────────────────────────────────────────────────────

  start(videoEl) {
    if (!this._detector && this._engine !== 'faceapi') return false;
    this.stop();
    this._timer = setInterval(() => this._tick(videoEl), this._intervalMs);
    return true;
  }

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this._missingFilter.reset();
    this._multipleFilter.reset();
    this._lastCount = -1;
    this._missingActive = false;
    this._multipleActive = false;
  }

  destroy() {
    this.stop();
    if (this._detector?.close) this._detector.close();
  }

  // ─── Detection tick ────────────────────────────────────────────────────────

  async _tick(videoEl) {
    if (!videoEl || videoEl.readyState < 2 || !videoEl.videoWidth) return;

    // Brightness check — skip detection in very dark frames
    const brightness = this._measureBrightness(videoEl);
    if (brightness < 20) {
      if (!this._lowLight) {
        this._lowLight = true;
        this._logger?.record(EventType.SYSTEM, Severity.LOW, {
          message: 'Low light detected — face detection may be unreliable',
          brightness,
        });
      }
      return;
    }
    this._lowLight = false;

    const faces = await this._detect(videoEl);
    const filtered = this._filterFaces(faces, videoEl.videoWidth, videoEl.videoHeight);
    this._process(filtered.length);
  }

  async _detect(videoEl) {
    try {
      if (this._engine === 'mediapipe') {
        const result = await this._detector.detect(videoEl, Date.now());
        return result.detections ?? [];
      }
      if (this._engine === 'faceapi') {
        return await window.faceapi.detectAllFaces(
          videoEl,
          new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: MIN_CONFIDENCE })
        );
      }
    } catch (e) {
      console.warn('[FaceDetectionEngine] detect error', e);
    }
    return [];
  }

  /**
   * Filter out low-confidence and tiny bounding boxes.
   * MediaPipe returns { categories, boundingBox }; face-api returns { score, box }.
   */
  _filterFaces(detections, frameW, frameH) {
    const frameArea = frameW * frameH;
    return detections.filter(d => {
      // Confidence
      const conf = d.categories?.[0]?.score ?? d.score ?? 1;
      if (conf < MIN_CONFIDENCE) return false;

      // Bounding box area
      const box = d.boundingBox ?? d.box;
      if (!box) return true; // can't filter, keep
      const area = (box.width ?? box.w ?? 0) * (box.height ?? box.h ?? 0);
      return area / frameArea >= MIN_FACE_AREA_RATIO;
    });
  }

  // ─── State machine ─────────────────────────────────────────────────────────

  _process(rawCount) {
    const isMissing  = this._missingFilter.push(rawCount === 0);
    const isMultiple = this._multipleFilter.push(rawCount > 1);
    const now = Date.now();

    // Determine validated count for UI
    let validatedCount = rawCount;
    if (isMissing)  validatedCount = 0;
    if (isMultiple) validatedCount = rawCount; // keep real count for display

    if (validatedCount !== this._lastCount) {
      this._lastCount = validatedCount;
      this._onFaceCountChange?.(validatedCount);
    }

    // Log only on state-entry (plus periodic reminder), not on every tick.
    if (isMissing && (!this._missingActive || now - this._lastMissingLogMs > 8000)) {
      this._logger?.record(EventType.FACE_MISSING, Severity.HIGH, { rawCount });
      this._scorer?.ingest(EventType.FACE_MISSING, Severity.HIGH);
      this._lastMissingLogMs = now;
    } else if (isMultiple && (!this._multipleActive || now - this._lastMultipleLogMs > 8000)) {
      const sev = rawCount > 2 ? Severity.HIGH : Severity.MEDIUM;
      this._logger?.record(EventType.MULTIPLE_FACES, sev, { faceCount: rawCount });
      this._scorer?.ingest(EventType.MULTIPLE_FACES, sev);
      this._lastMultipleLogMs = now;
    }

    this._missingActive = isMissing;
    this._multipleActive = isMultiple;
  }

  // ─── Brightness helper ─────────────────────────────────────────────────────

  _measureBrightness(videoEl) {
    const W = 64, H = 48; // tiny sample for speed
    this._canvas.width  = W;
    this._canvas.height = H;
    this._ctx.drawImage(videoEl, 0, 0, W, H);
    const data = this._ctx.getImageData(0, 0, W, H).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Perceived luminance
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return sum / (W * H); // 0–255
  }
}
