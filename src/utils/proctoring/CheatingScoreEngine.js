/**
 * CheatingScoreEngine — weighted multi-signal scoring model.
 *
 * Score range: 0 (clean) → 100 (definite cheating).
 * Each signal contributes a weighted delta; scores decay over time
 * so a student who corrects behaviour sees their score improve.
 */

import { EventType, Severity } from './ProctoringLogger.js';

// ─── Signal weights (tune per deployment) ────────────────────────────────────
const WEIGHTS = {
  [EventType.FACE_MISSING]:    { low: 8,  medium: 15, high: 25 },
  [EventType.MULTIPLE_FACES]:  { low: 10, medium: 20, high: 35 },
  [EventType.LOOKING_AWAY]:    { low: 5,  medium: 10, high: 18 },
  [EventType.TAB_SWITCH]:      { low: 8,  medium: 15, high: 25 },
  [EventType.WINDOW_BLUR]:     { low: 5,  medium: 10, high: 15 },
  [EventType.FULLSCREEN_EXIT]: { low: 6,  medium: 12, high: 20 },
  [EventType.AUDIO_ANOMALY]:   { low: 3,  medium: 7,  high: 12 },
};

// Score thresholds for decision output
export const Decision = Object.freeze({
  CLEAN:    'CLEAN',    // 0–29
  WARNING:  'WARNING',  // 30–59
  SUSPECT:  'SUSPECT',  // 60–79
  CHEATING: 'CHEATING', // 80–100
});

const DECAY_RATE = 0.015; // score units lost per second of clean behaviour

export class CheatingScoreEngine {
  constructor({ logger, decayRate = DECAY_RATE } = {}) {
    this._logger = logger;
    this._decayRate = decayRate;
    this._score = 0;
    this._lastUpdateMs = Date.now();
    this._listeners = [];
    this._decayTimer = null;

    // Start passive decay loop (every 2 s)
    this._decayTimer = setInterval(() => this._applyDecay(), 2000);
  }

  /**
   * Feed a new violation event into the engine.
   * @param {string} type     - EventType
   * @param {string} severity - Severity
   */
  ingest(type, severity = Severity.MEDIUM) {
    const weight = WEIGHTS[type]?.[severity] ?? 5;
    this._score = Math.min(100, this._score + weight);
    this._lastUpdateMs = Date.now();
    this._notify();
  }

  /** Current raw score (0–100). */
  get score() { return Math.round(this._score); }

  /** Human-readable decision based on current score. */
  get decision() {
    if (this._score >= 80) return Decision.CHEATING;
    if (this._score >= 60) return Decision.SUSPECT;
    if (this._score >= 30) return Decision.WARNING;
    return Decision.CLEAN;
  }

  /** Full snapshot for UI / backend. */
  snapshot() {
    return {
      score:    this.score,
      decision: this.decision,
      ts:       new Date().toISOString(),
    };
  }

  /** Subscribe to score changes. Returns unsubscribe fn. */
  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  _applyDecay() {
    if (this._score <= 0) return;
    const elapsed = (Date.now() - this._lastUpdateMs) / 1000;
    const decay = elapsed * this._decayRate;
    this._score = Math.max(0, this._score - decay);
    this._notify();
  }

  _notify() {
    const snap = this.snapshot();
    this._listeners.forEach(fn => fn(snap));
  }

  destroy() {
    if (this._decayTimer) clearInterval(this._decayTimer);
  }
}
