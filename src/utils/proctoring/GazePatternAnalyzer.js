/**
 * GazePatternAnalyzer — Detects suspicious REPETITIVE eye movement patterns.
 *
 * Problem it solves:
 *   Single gaze events (student looks left once) are normal.
 *   But repeated directional glances — especially returning to the same spot —
 *   are the hallmark of copying from hidden notes, a phone, or a side screen.
 *
 * Patterns detected:
 *   1. REPEAT_GLANCE   — same direction ≥ N times in a rolling window
 *                         e.g. left 4× in 30s = cheat sheet on the left
 *   2. ALTERNATING     — A → center → A → center → A (oscillating to same spot)
 *                         e.g. down-center-down-center = phone on desk
 *   3. RAPID_SCAN      — many distinct direction changes in short time
 *                         e.g. left-right-up-down in 5s = searching for answers
 *   4. DOWN_REPEAT     — repeated downward glances (phone / notes below desk)
 *                         treated separately with a softer threshold due to reading
 *
 * Usage:
 *   const analyzer = new GazePatternAnalyzer({ onPattern, logger, scorer });
 *   // On each new gaze event (only non-center directions):
 *   analyzer.push(direction, irisData);
 */

export const PatternType = Object.freeze({
  REPEAT_GLANCE: 'REPEAT_GLANCE',
  ALTERNATING:   'ALTERNATING',
  RAPID_SCAN:    'RAPID_SCAN',
  DOWN_REPEAT:   'DOWN_REPEAT',
});

/** Tunable constants — tweak here only. */
const CFG = {
  // ── Rolling window ────────────────────────────────────────────────────────
  WINDOW_MS:          30_000,   // 30 s window for repeat detection
  RAPID_WINDOW_MS:     8_000,   // 8 s window for rapid-scan detection

  // ── Repeat-glance trigger ─────────────────────────────────────────────────
  REPEAT_MIN:              4,   // same direction ≥ 4× = suspicious
  DOWN_REPEAT_MIN:         5,   // downward needs more hits (reading grace)

  // ── Alternating pattern ───────────────────────────────────────────────────
  ALT_MIN_PAIRS:           3,   // A-center-A-center-A = 3 "away" hits needed

  // ── Rapid scan ────────────────────────────────────────────────────────────
  RAPID_SHIFTS_MIN:        5,   // 5+ direction events in RAPID_WINDOW_MS

  // ── Cooldown after each pattern fire ─────────────────────────────────────
  PATTERN_COOLDOWN_MS:  20_000, // 20 s before same pattern type fires again
};

export class GazePatternAnalyzer {
  /**
   * @param {object} opts
   * @param {function} opts.onPattern  - ({ patternType, direction, count, windowMs, severity }) => void
   * @param {object}   opts.logger     - ProctoringLogger instance (optional)
   * @param {object}   opts.scorer     - CheatingScoreEngine instance (optional)
   */
  constructor({ onPattern, logger, scorer } = {}) {
    this._onPattern = onPattern;
    this._logger    = logger;
    this._scorer    = scorer;

    /**
     * History of non-center gaze events.
     * @type {Array<{ direction: string, timestamp: number, irisH?: number, irisV?: number }>}
     */
    this._history = [];

    /** Per-pattern-type cooldown timestamps. */
    this._lastFired = {};   // { [PatternType]: epochMs }
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Call this whenever the student looks away (direction !== 'center').
   * Also call with 'center' to record return-to-center (feeds alternating logic).
   *
   * @param {string}  direction  - 'left' | 'right' | 'up' | 'down' | 'center'
   * @param {object}  [irisData] - { irisH, irisV, gazeScore } from HeadPoseEngine
   */
  push(direction, irisData = {}) {
    const now = Date.now();
    this._history.push({ direction, timestamp: now, ...irisData });
    this._purge(now);
    this._analyze(direction, now);
  }

  /** Clear all history (call on exam reset or calibration). */
  reset() {
    this._history = [];
    this._lastFired = {};
  }

  /** Returns a summary counts object for debugging overlays. */
  get stats() {
    const now = Date.now();
    const recent = this._history.filter(e => now - e.timestamp <= CFG.WINDOW_MS);
    const counts = { left: 0, right: 0, up: 0, down: 0, center: 0 };
    for (const e of recent) {
      if (counts[e.direction] !== undefined) counts[e.direction]++;
    }
    return counts;
  }

  // ─── Core analysis ─────────────────────────────────────────────────────────

  _analyze(latestDirection, now) {
    const windowEvents = this._history.filter(
      e => now - e.timestamp <= CFG.WINDOW_MS
    );
    const rapidEvents  = this._history.filter(
      e => now - e.timestamp <= CFG.RAPID_WINDOW_MS
    );

    // ── 1. Repeat glance in same direction ───────────────────────────────
    if (latestDirection !== 'center') {
      const awayEvents   = windowEvents.filter(e => e.direction === latestDirection);
      const threshold    = latestDirection === 'down' ? CFG.DOWN_REPEAT_MIN : CFG.REPEAT_MIN;
      const patternType  = latestDirection === 'down'
        ? PatternType.DOWN_REPEAT
        : PatternType.REPEAT_GLANCE;

      if (awayEvents.length >= threshold) {
        this._maybeFire(patternType, {
          direction:  latestDirection,
          count:      awayEvents.length,
          windowMs:   CFG.WINDOW_MS,
          severity:   awayEvents.length >= threshold + 2 ? 'high' : 'medium',
        }, now);
      }
    }

    // ── 2. Alternating pattern (A → center → A → center → A) ────────────
    if (latestDirection !== 'center') {
      const altCount = this._countAlternating(windowEvents, latestDirection);
      if (altCount >= CFG.ALT_MIN_PAIRS) {
        this._maybeFire(PatternType.ALTERNATING, {
          direction:  latestDirection,
          count:      altCount,
          windowMs:   CFG.WINDOW_MS,
          severity:   altCount >= CFG.ALT_MIN_PAIRS + 2 ? 'high' : 'medium',
        }, now);
      }
    }

    // ── 3. Rapid multi-directional scan ──────────────────────────────────
    const rapidAwayCount = rapidEvents.filter(e => e.direction !== 'center').length;
    if (rapidAwayCount >= CFG.RAPID_SHIFTS_MIN) {
      // Only fire if at least 2 distinct directions are involved (genuine scan)
      const dirs = new Set(rapidEvents.filter(e => e.direction !== 'center').map(e => e.direction));
      if (dirs.size >= 2) {
        this._maybeFire(PatternType.RAPID_SCAN, {
          direction:  [...dirs].join('+'),
          count:      rapidAwayCount,
          windowMs:   CFG.RAPID_WINDOW_MS,
          severity:   dirs.size >= 3 ? 'high' : 'medium',
        }, now);
      }
    }
  }

  /**
   * Count how many times `direction` appears in an A-center-A-center-A sequence
   * at the tail of the history window.
   */
  _countAlternating(events, direction) {
    // Walk backwards: count contiguous alternating blocks
    let count      = 0;
    let expectAway = true;     // start expecting an "away" event

    for (let i = events.length - 1; i >= 0; i--) {
      const dir = events[i].direction;

      if (expectAway) {
        if (dir === direction) { count++; expectAway = false; }
        else if (dir !== 'center') break;   // different away — pattern broken
      } else {
        if (dir === 'center') { expectAway = true; }
        else if (dir === direction) { count++; }  // consecutive away — ok
        else break;  // different direction — pattern broken
      }
    }
    return count;
  }

  // ─── Pattern firing ────────────────────────────────────────────────────────

  _maybeFire(patternType, meta, now) {
    const last    = this._lastFired[patternType] ?? 0;
    if (now - last < CFG.PATTERN_COOLDOWN_MS) return;   // still in cooldown

    this._lastFired[patternType] = now;

    const payload = { patternType, ...meta, timestamp: now };

    // Notify caller (ExamPage / useProctoring can show a custom warning)
    this._onPattern?.(payload);

    // Log to ProctoringLogger under LOOKING_AWAY type (keeps pipeline intact)
    if (this._logger) {
      const { Severity, EventType } = this._getLoggerConsts();
      const sev = meta.severity === 'high' ? Severity.HIGH : Severity.MEDIUM;
      this._logger.record(EventType.LOOKING_AWAY, sev, {
        subType:     patternType,
        direction:   meta.direction,
        repeatCount: meta.count,
        windowMs:    meta.windowMs,
        description: this._description(patternType, meta),
      });
    }

    // Feed into cheating score engine
    if (this._scorer) {
      const { Severity, EventType } = this._getLoggerConsts();
      const sev = meta.severity === 'high' ? Severity.HIGH : Severity.MEDIUM;
      this._scorer.ingest(EventType.LOOKING_AWAY, sev);
    }
  }

  _description(patternType, meta) {
    switch (patternType) {
      case PatternType.REPEAT_GLANCE:
        return `Looked ${meta.direction} ${meta.count}× in ${meta.windowMs / 1000}s — possible cheat sheet`;
      case PatternType.ALTERNATING:
        return `Alternated gaze to ${meta.direction} ${meta.count}× — possible note copying`;
      case PatternType.RAPID_SCAN:
        return `Rapid gaze scanning (${meta.direction}) ${meta.count} shifts in ${meta.windowMs / 1000}s`;
      case PatternType.DOWN_REPEAT:
        return `Repeated downward glances (${meta.count}×) — possible phone/notes below`;
      default:
        return `Suspicious gaze pattern: ${patternType}`;
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  _purge(now) {
    // Keep only events within the longest window we care about
    const cutoff = now - Math.max(CFG.WINDOW_MS, CFG.RAPID_WINDOW_MS);
    this._history = this._history.filter(e => e.timestamp > cutoff);
  }

  /** Lazy-load logger constants to avoid circular-import issues in tests. */
  _getLoggerConsts() {
    // Dynamic import avoids circular deps; synchronous because module is already loaded
    try {
      const mod = require('./ProctoringLogger.js');
      return { Severity: mod.Severity, EventType: mod.EventType };
    } catch {
      // ESM fallback — these were tree-shaken in; values are stable
      return {
        Severity:  { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' },
        EventType: { LOOKING_AWAY: 'LOOKING_AWAY' },
      };
    }
  }
}
