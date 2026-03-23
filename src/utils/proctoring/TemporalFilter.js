/**
 * TemporalFilter — multi-frame validation & noise reduction
 * Prevents single-frame anomalies from triggering false positives.
 */
export class TemporalFilter {
  /**
   * @param {number} windowMs   - sliding window size in ms (e.g. 2500)
   * @param {number} threshold  - fraction of frames that must agree (0–1, e.g. 0.6)
   */
  constructor(windowMs = 2500, threshold = 0.6) {
    this.windowMs = windowMs;
    this.threshold = threshold;
    this._frames = []; // { ts: number, value: boolean }
  }

  /** Push a new boolean observation. Returns the smoothed decision. */
  push(value) {
    const now = Date.now();
    this._frames.push({ ts: now, value });
    // Evict frames outside the window
    this._frames = this._frames.filter(f => now - f.ts <= this.windowMs);
    return this.decision();
  }

  /** Current smoothed decision without adding a new frame. */
  decision() {
    if (this._frames.length === 0) return false;
    const trueCount = this._frames.filter(f => f.value).length;
    return trueCount / this._frames.length >= this.threshold;
  }

  reset() { this._frames = []; }
}

/**
 * ExponentialSmoother — low-pass filter for continuous values (angles, scores).
 * @param {number} alpha - smoothing factor 0 (heavy smooth) → 1 (no smooth)
 */
export class ExponentialSmoother {
  constructor(alpha = 0.25) {
    this.alpha = alpha;
    this._value = null;
  }

  push(raw) {
    if (this._value === null) { this._value = raw; return raw; }
    this._value = this.alpha * raw + (1 - this.alpha) * this._value;
    return this._value;
  }

  get value() { return this._value; }
  reset() { this._value = null; }
}

/**
 * SlidingWindowCounter — counts events in a rolling time window.
 * Useful for tab-switch rate limiting.
 */
export class SlidingWindowCounter {
  constructor(windowMs = 60_000) {
    this.windowMs = windowMs;
    this._events = [];
  }

  record() {
    const now = Date.now();
    this._events.push(now);
    this._evict(now);
  }

  count() {
    this._evict(Date.now());
    return this._events.length;
  }

  _evict(now) {
    this._events = this._events.filter(t => now - t <= this.windowMs);
  }

  reset() { this._events = []; }
}
