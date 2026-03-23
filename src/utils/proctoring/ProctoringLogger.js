/**
 * ProctoringLogger — structured event log with export support.
 * Every detection module writes here; the scoring engine reads it.
 */

export const EventType = Object.freeze({
  FACE_MISSING:     'FACE_MISSING',
  MULTIPLE_FACES:   'MULTIPLE_FACES',
  LOOKING_AWAY:     'LOOKING_AWAY',
  TAB_SWITCH:       'TAB_SWITCH',
  WINDOW_BLUR:      'WINDOW_BLUR',
  FULLSCREEN_EXIT:  'FULLSCREEN_EXIT',
  AUDIO_ANOMALY:    'AUDIO_ANOMALY',
  SYSTEM:           'SYSTEM',
});

export const Severity = Object.freeze({
  LOW:    'low',
  MEDIUM: 'medium',
  HIGH:   'high',
});

export class ProctoringLogger {
  constructor({ maxEvents = 2000 } = {}) {
    this._log = [];
    this._maxEvents = maxEvents;
    this._listeners = [];
  }

  /**
   * Record a proctoring event.
   * @param {string} type      - EventType constant
   * @param {string} severity  - Severity constant
   * @param {object} meta      - arbitrary extra data (angles, faceCount, etc.)
   */
  record(type, severity = Severity.MEDIUM, meta = {}) {
    const entry = {
      id:        crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      type,
      severity,
      timestamp: new Date().toISOString(),
      epochMs:   Date.now(),
      ...meta,
    };

    this._log.push(entry);
    if (this._log.length > this._maxEvents) this._log.shift();

    this._listeners.forEach(fn => fn(entry));
    return entry;
  }

  /** Subscribe to new events. Returns unsubscribe fn. */
  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  /** All events, optionally filtered by type. */
  getEvents(type = null) {
    return type ? this._log.filter(e => e.type === type) : [...this._log];
  }

  /** Events in the last N milliseconds. */
  getRecent(ms = 60_000) {
    const cutoff = Date.now() - ms;
    return this._log.filter(e => e.epochMs >= cutoff);
  }

  /** Count events by type in the last N ms. */
  countRecent(type, ms = 60_000) {
    return this.getRecent(ms).filter(e => e.type === type).length;
  }

  /** Export as JSON string (for backend submission). */
  export() {
    return JSON.stringify(this._log);
  }

  /** Summary object for backend API payload. */
  summary() {
    const counts = {};
    for (const e of this._log) {
      counts[e.type] = (counts[e.type] || 0) + 1;
    }
    return {
      totalEvents: this._log.length,
      byType: counts,
      firstEvent: this._log[0]?.timestamp ?? null,
      lastEvent:  this._log[this._log.length - 1]?.timestamp ?? null,
    };
  }

  clear() { this._log = []; }
}
