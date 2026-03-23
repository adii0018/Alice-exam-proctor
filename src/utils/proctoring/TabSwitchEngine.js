/**
 * TabSwitchEngine — robust tab/window focus monitoring.
 *
 * Improvements over the original:
 *  1. Tracks visibilitychange + blur + focus events together.
 *  2. SlidingWindowCounter — rate-based alerting, not instant flag.
 *  3. Minimum absence duration filter (< 1 s ignored as accidental).
 *  4. Fullscreen exit detection.
 *  5. Structured logging + score ingestion.
 */

import { SlidingWindowCounter } from './TemporalFilter.js';
import { EventType, Severity } from './ProctoringLogger.js';

const MIN_ABSENCE_MS   = 1000;  // ignore focus losses shorter than 1 s
const RATE_WINDOW_MS   = 120_000; // 2-minute rolling window for rate calc
const HIGH_RATE_THRESH = 5;     // > 5 switches in 2 min → HIGH severity

export class TabSwitchEngine {
  /**
   * @param {object} opts
   * @param {ProctoringLogger}    opts.logger
   * @param {CheatingScoreEngine} opts.scorer
   * @param {function} opts.onTabSwitch  - ({ count, severity, durationMs }) => void
   */
  constructor({ logger, scorer, onTabSwitch } = {}) {
    this._logger      = logger;
    this._scorer      = scorer;
    this._onTabSwitch = onTabSwitch;

    this._counter     = new SlidingWindowCounter(RATE_WINDOW_MS);
    this._blurTs      = null;
    this._active      = false;

    this._onVisibility = this._handleVisibility.bind(this);
    this._onBlur       = this._handleBlur.bind(this);
    this._onFocus      = this._handleFocus.bind(this);
    this._onFullscreen = this._handleFullscreen.bind(this);
  }

  start() {
    if (this._active) return;
    this._active = true;
    document.addEventListener('visibilitychange', this._onVisibility);
    window.addEventListener('blur',  this._onBlur);
    window.addEventListener('focus', this._onFocus);
    document.addEventListener('fullscreenchange', this._onFullscreen);
  }

  stop() {
    this._active = false;
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener('blur',  this._onBlur);
    window.removeEventListener('focus', this._onFocus);
    document.removeEventListener('fullscreenchange', this._onFullscreen);
    this._counter.reset();
    this._blurTs = null;
  }

  get switchCount() { return this._counter.count(); }

  // ─── Handlers ──────────────────────────────────────────────────────────────

  _handleVisibility() {
    if (document.hidden) {
      this._blurTs = Date.now();
    } else {
      this._recordReturn('TAB_HIDDEN');
    }
  }

  _handleBlur() {
    // Only record if not already tracking a visibility hide
    if (!this._blurTs) this._blurTs = Date.now();
  }

  _handleFocus() {
    this._recordReturn('WINDOW_BLUR');
  }

  _handleFullscreen() {
    if (!document.fullscreenElement) {
      this._logger?.record(EventType.FULLSCREEN_EXIT, Severity.MEDIUM, {
        ts: new Date().toISOString(),
      });
      this._scorer?.ingest(EventType.FULLSCREEN_EXIT, Severity.MEDIUM);
    }
  }

  _recordReturn(source) {
    if (!this._blurTs) return;
    const durationMs = Date.now() - this._blurTs;
    this._blurTs = null;

    // Ignore accidental micro-losses
    if (durationMs < MIN_ABSENCE_MS) return;

    this._counter.record();
    const count = this._counter.count();
    const sev   = count > HIGH_RATE_THRESH ? Severity.HIGH : Severity.MEDIUM;

    this._logger?.record(EventType.TAB_SWITCH, sev, {
      source,
      durationMs,
      totalSwitches: count,
    });
    this._scorer?.ingest(EventType.TAB_SWITCH, sev);
    this._onTabSwitch?.({ count, severity: sev, durationMs });
  }
}
