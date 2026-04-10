/**
 * FaceDetectionEngine — production-grade face detection.
 *
 * Improvements over the original:
 *  1. MediaPipe BlazeFace FULL-RANGE (GPU-accelerated) as primary engine.
 *     Covers 0–5 m distance vs old short-range (0–2 m).
 *  2. face-api.js TinyFaceDetector as fallback with higher input resolution.
 *  3. Bounding-box area filter tuned for long-range detection.
 *  4. Dual-pass detection — second pass on a zoomed crop catches
 *     faces lurking near edges / background.
 *  5. Confidence threshold lowered so far/angled faces are not rejected.
 *  6. TemporalFilter for multi-frame validation (no single-frame spikes).
 *  7. Brightness check — warns instead of false-flagging in low light.
 *  8. Structured logging via ProctoringLogger.
 */

import { TemporalFilter } from './TemporalFilter.js';
import { EventType, Severity } from './ProctoringLogger.js';

// Minimum face bounding-box area as fraction of frame area.
// 0.002 (0.2%) — allows very distant faces (~4-5 m) while still ignoring wall art.
const MIN_FACE_AREA_RATIO = 0.002;

// Minimum confidence score accepted from the detector.
// Far/tilted/partially visible faces have naturally lower scores.
const MIN_CONFIDENCE = 0.45;

// IoU overlap threshold for dedup — keep low (0.25) so two side-by-side real
// faces are never merged into one.
const IOU_DEDUP_THRESHOLD = 0.25;

// Edge-strip zoom definitions: each entry zooms into a perimeter band.
// People entering from any side appear in these regions first.
const EDGE_STRIPS = [
  { id: 'left',   sx: 0,    sy: 0,    sw: 0.40, sh: 1.00 }, // left 40%
  { id: 'right',  sx: 0.60, sy: 0,    sw: 0.40, sh: 1.00 }, // right 40%
  { id: 'top',    sx: 0,    sy: 0,    sw: 1.00, sh: 0.40 }, // top 40%
  { id: 'bottom', sx: 0,    sy: 0.60, sw: 1.00, sh: 0.40 }, // bottom 40%
];

export class FaceDetectionEngine {
  /**
   * @param {object} opts
   * @param {ProctoringLogger} opts.logger
   * @param {CheatingScoreEngine} opts.scorer
   * @param {function} opts.onFaceCountChange  - (count: number) => void
   * @param {number}   opts.intervalMs         - detection cadence (default 800 ms)
   */
  constructor({ logger, scorer, onFaceCountChange, intervalMs = 600 } = {}) {
    this._logger = logger;
    this._scorer = scorer;
    this._onFaceCountChange = onFaceCountChange;
    this._intervalMs = intervalMs; // Reduced from 800ms → 600ms for faster alerts

    // Multi-frame validators — tighter windows for faster response
    // Missing: 2000ms window, 60% agreement
    this._missingFilter  = new TemporalFilter(2000, 0.60);
    // Multiple: 1800ms window, 50% agreement — just over half the frames need to agree.
    // Catches an intruder who appears even briefly without too many false positives.
    this._multipleFilter = new TemporalFilter(1800, 0.50);

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
    // Shared canvas for all zoom/strip passes
    this._canvas2    = document.createElement('canvas');
    this._ctx2       = this._canvas2.getContext('2d', { willReadFrequently: true });
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
          // FULL-RANGE model: 0–5 m coverage (was short_range: 0–2 m)
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_full_range/float16/1/blaze_face_full_range.tflite',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        minDetectionConfidence: MIN_CONFIDENCE,
        minSuppressionThreshold: 0.3, // Allow closely-spaced faces to both be reported
      });
      this._engine = 'mediapipe';
      console.log('[FaceDetectionEngine] Using MediaPipe BlazeFace FULL-RANGE (GPU)');
      return true;
    } catch { return false; }
  }

  async _tryFaceApi() {
    try {
      if (!window.faceapi) return false;
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
      await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      this._engine = 'faceapi';
      // Store options with higher inputSize (416 vs 224) for better small-face detection
      this._faceApiOpts = new window.faceapi.TinyFaceDetectorOptions({
        inputSize: 416,           // was 224 — higher res catches far/small faces
        scoreThreshold: MIN_CONFIDENCE,
      });
      console.log('[FaceDetectionEngine] Using face-api.js TinyFaceDetector 416px (fallback)');
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
        const vw = videoEl.videoWidth;
        const vh = videoEl.videoHeight;
        let ts = Date.now();

        // Pass 1 — full frame (native resolution)
        const p1 = (await this._detector.detect(videoEl, ts)).detections ?? [];
        ts++;

        // Pass 2 — centre zoom 1.5× (catches faces that are too small at 1×)
        const p2 = await this._detectCrop(videoEl, ts++,
          vw * 0.167, vh * 0.167, vw * 0.667, vh * 0.667);

        // Pass 3 — centre zoom 2× (catches very far faces)
        const p3 = await this._detectCrop(videoEl, ts++,
          vw * 0.25,  vh * 0.25,  vw * 0.50,  vh * 0.50);

        // Passes 4-7 — edge strips (catches intruders entering from any side)
        const edgePasses = await Promise.all(
          EDGE_STRIPS.map((s, i) => this._detectCrop(
            videoEl, ts + i,
            s.sx * vw, s.sy * vh, s.sw * vw, s.sh * vh
          ))
        );

        let merged = [...p1];
        for (const dets of [p2, p3, ...edgePasses]) {
          merged = this._mergeDetections(merged, dets, vw, vh);
        }
        return merged;
      }
      if (this._engine === 'faceapi') {
        if (!this._faceApiOpts) {
          this._faceApiOpts = new window.faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: MIN_CONFIDENCE,
          });
        }
        return await window.faceapi.detectAllFaces(videoEl, this._faceApiOpts);
      }
    } catch (e) {
      console.warn('[FaceDetectionEngine] detect error', e);
    }
    return [];
  }

  /**
   * Detect faces within an arbitrary crop of the video frame.
   * The crop is defined in PIXEL coordinates of the source video.
   * Detected bounding-boxes are mapped back to original frame space.
   *
   * @param {HTMLVideoElement} videoEl
   * @param {number} ts   - timestamp token (must be unique per call)
   * @param {number} sx   - crop origin X in source pixels
   * @param {number} sy   - crop origin Y in source pixels
   * @param {number} sw   - crop width  in source pixels
   * @param {number} sh   - crop height in source pixels
   */
  async _detectCrop(videoEl, ts, sx, sy, sw, sh) {
    try {
      const vw = videoEl.videoWidth;
      const vh = videoEl.videoHeight;

      // Clamp to valid region
      sx = Math.max(0, Math.round(sx)); sy = Math.max(0, Math.round(sy));
      sw = Math.min(vw - sx, Math.round(sw)); sh = Math.min(vh - sy, Math.round(sh));
      if (sw <= 0 || sh <= 0) return [];

      // Scale crop up to full-frame size so classifier sees full-resolution pixels
      this._canvas2.width  = vw;
      this._canvas2.height = vh;
      this._ctx2.clearRect(0, 0, vw, vh);
      this._ctx2.drawImage(videoEl, sx, sy, sw, sh, 0, 0, vw, vh);

      const result = await this._detector.detect(this._canvas2, ts);
      const dets = result.detections ?? [];

      // Re-map bounding boxes from canvas-space back to original frame-space
      const scaleX = sw / vw;
      const scaleY = sh / vh;
      return dets.map(d => {
        if (!d.boundingBox) return d;
        const bb = d.boundingBox;
        return {
          ...d,
          boundingBox: {
            originX: sx + bb.originX * scaleX,
            originY: sy + bb.originY * scaleY,
            width:   bb.width  * scaleX,
            height:  bb.height * scaleY,
          },
          _cropRegion: { sx, sy, sw, sh },
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Merge accumulator + new detections; suppress near-duplicates via IoU.
   * Uses IOU_DEDUP_THRESHOLD (0.25) — low enough that two adjacent faces
   * are never collapsed into one.
   */
  _mergeDetections(accumulator, incoming, frameW, frameH) {
    const all = [...accumulator];
    for (const det of incoming) {
      const isDup = accumulator.some(
        existing => this._iou(existing, det, frameW, frameH) > IOU_DEDUP_THRESHOLD
      );
      if (!isDup) all.push(det);
    }
    return all;
  }

  /** Compute Intersection-over-Union for two MediaPipe detections. */
  _iou(a, b, frameW, frameH) {
    const toRect = (d) => {
      const bb = d.boundingBox;
      if (!bb) return null;
      return {
        x1: bb.originX  / frameW,
        y1: bb.originY  / frameH,
        x2: (bb.originX + bb.width)  / frameW,
        y2: (bb.originY + bb.height) / frameH,
      };
    };
    const ra = toRect(a); const rb = toRect(b);
    if (!ra || !rb) return 0;
    const ix1 = Math.max(ra.x1, rb.x1); const iy1 = Math.max(ra.y1, rb.y1);
    const ix2 = Math.min(ra.x2, rb.x2); const iy2 = Math.min(ra.y2, rb.y2);
    const inter = Math.max(0, ix2 - ix1) * Math.max(0, iy2 - iy1);
    if (inter === 0) return 0;
    const areaA = (ra.x2 - ra.x1) * (ra.y2 - ra.y1);
    const areaB = (rb.x2 - rb.x1) * (rb.y2 - rb.y1);
    return inter / (areaA + areaB - inter);
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
