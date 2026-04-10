/**
 * GazeTemporalBuffer — rolling window buffer for gaze deviation samples.
 *
 * Prevents single-frame anomalies from triggering false violations.
 * A violation is only triggered if:
 *   • At least MIN_SAMPLES entries exist in the window, AND
 *   • At least DEVIATION_RATE (70%) of frames are deviated.
 *
 * Entries older than windowMs are auto-purged on every push().
 */
export class GazeTemporalBuffer {
  /**
   * @param {object} opts
   * @param {number} opts.windowMs       - rolling window in ms (default 3000)
   * @param {number} opts.minSamples     - minimum frame count required (default 5)
   * @param {number} opts.deviationRate  - fraction of frames that must be deviated (default 0.70)
   */
  constructor({
    windowMs      = 3000,
    minSamples    = 5,
    deviationRate = 0.70,
  } = {}) {
    this._windowMs      = windowMs;
    this._minSamples    = minSamples;
    this._deviationRate = deviationRate;

    /** @type {Array<{ isDeviated: boolean, timestamp: number }>} */
    this._buffer = [];
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Push a new observation into the buffer.
   * Automatically purges entries older than windowMs.
   *
   * @param {boolean} isDeviated - whether gaze is currently deviated
   * @param {number}  [timestamp] - epoch ms; defaults to Date.now()
   */
  push(isDeviated, timestamp = Date.now()) {
    this._buffer.push({ isDeviated: !!isDeviated, timestamp });
    this._purge(timestamp);
  }

  /**
   * Returns true only if enough samples have been collected AND the majority
   * of frames within the window are deviated.
   *
   * @returns {boolean}
   */
  shouldTriggerViolation() {
    this._purge(Date.now());

    const total = this._buffer.length;
    if (total < this._minSamples) return false;

    const deviatedCount = this._buffer.filter(e => e.isDeviated).length;
    return (deviatedCount / total) >= this._deviationRate;
  }

  /**
   * Current fraction of deviated frames in the window (0–1).
   * Useful for debug overlays.
   */
  get deviationFraction() {
    if (this._buffer.length === 0) return 0;
    return this._buffer.filter(e => e.isDeviated).length / this._buffer.length;
  }

  /** Number of samples currently in the buffer. */
  get sampleCount() { return this._buffer.length; }

  /** Clear all buffered samples. */
  reset() { this._buffer = []; }

  // ─── Internal ──────────────────────────────────────────────────────────────

  _purge(now) {
    const cutoff = now - this._windowMs;
    this._buffer = this._buffer.filter(e => e.timestamp > cutoff);
  }
}
