/**
 * SmartAudioDetection — Enhanced AI-powered exam proctoring audio monitoring
 *
 * Original features:
 *   1. Ambient noise calibration (3s baseline, dynamic threshold)
 *   2. Duration tracking (frame-based, <0.5s ignored)
 *   3. Severity levels LOW/MEDIUM/HIGH with risk score (0-100)
 *
 * Accuracy fixes applied:
 *   FIX 1 — Spectral Flatness  : whisper detection via FFT geometry
 *   FIX 2 — Adaptive Cooldown  : severity-based cooldown + LOW→MEDIUM upgrade
 *   FIX 3 — Recalibrate on Resume: visibility/AudioContext interruption handling
 *   FIX 4 — Voice Pattern Scoring: time-decayed risk score (×0.85 every 60s)
 */

import { EventType, Severity } from './ProctoringLogger.js';

export class SmartAudioDetection {
  constructor({
    onViolation  = null,   // (violationObject) => void
    onRiskUpdate = null,   // ({ riskScore, decayedRiskScore }) => void
    onCalibration = null   // (status, progress) => void
  } = {}) {
    this.onViolation  = onViolation;
    this.onRiskUpdate = onRiskUpdate;
    this.onCalibration = onCalibration;

    // ── Calibration ──────────────────────────────────────────────────────────
    this.baseline           = 0;
    this.dynamicThreshold   = 25;   // fallback before calibration
    this.isCalibrated       = false;
    this.calibrationVersion = 0;    // FIX 3: increments on every (re)calibration

    // ── Duration tracking ────────────────────────────────────────────────────
    this.voiceFrameCount = 0;
    this.silenceFrameCount = 0;
    this.hangoverFrames = 8; // slightly longer grace to keep low-volume side speech continuous
    this.noiseFloorEma = 0;

    // ── FIX 2: Adaptive cooldown ─────────────────────────────────────────────
    this.lastViolationTime = 0;
    this.recentLowTimestamps = [];  // track LOW violations for upgrade logic

    // ── FIX 4: Time-decayed risk score ───────────────────────────────────────
    this.riskScore        = this._loadRiskScore();
    this.decayedRiskScore = this.riskScore;
    this._decayIntervalId = null;   // setInterval handle

    // ── Audio context ────────────────────────────────────────────────────────
    this.audioContext = null;
    this.analyser     = null;
    this.stream       = null;
    this.animationId  = null;

    // ── FIX 3: Visibility / interruption tracking ────────────────────────────
    this._hiddenAt            = null;
    this._visibilityHandler   = null;
    this._audioStateHandler   = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CALIBRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Full 3-second calibration — call before startVoiceMonitoring().
   * Also used internally for silent re-calibration (FIX 3).
   *
   * @param {object} opts
   * @param {number} opts.durationMs   - sample window (default 3000)
   * @param {boolean} opts.silent      - suppress onCalibration callbacks
   */
  async calibrateAmbientNoise({ durationMs = 3000, silent = false } = {}) {
    try {
      if (!silent) this.onCalibration?.('starting', 0);

      // Reuse existing stream/context if already open (re-calibration path)
      if (!this.stream) {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioContext();
      }
      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        const source = this.audioContext.createMediaStreamSource(this.stream);
        source.connect(this.analyser);
      }

      // ── FIX 3: attach AudioContext interruption listener once ────────────
      if (!this._audioStateHandler) {
        this._audioStateHandler = () => {
          if (this.audioContext?.state === 'interrupted') {
            console.warn('[SmartAudio] AudioContext interrupted — scheduling recalibration');
            this._scheduleQuickRecalibration('audio_interrupted');
          }
        };
        this.audioContext.addEventListener('statechange', this._audioStateHandler);
      }

      const sampleInterval = 100;
      const totalSamples   = durationMs / sampleInterval;
      const samples        = [];

      for (let i = 0; i < totalSamples; i++) {
        await new Promise(resolve => setTimeout(resolve, sampleInterval));

        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        samples.push(avg);

        if (!silent) {
          this.onCalibration?.('calibrating', ((i + 1) / totalSamples) * 100);
        }
      }

      this.baseline         = samples.reduce((a, b) => a + b, 0) / samples.length;
      this.dynamicThreshold = this.baseline + 15;
      this.noiseFloorEma    = this.baseline;
      this.isCalibrated     = true;
      this.calibrationVersion++;

      console.log(
        `[SmartAudio] Calibration v${this.calibrationVersion} — ` +
        `baseline: ${this.baseline.toFixed(1)}, threshold: ${this.dynamicThreshold.toFixed(1)}`
      );

      if (!silent) this.onCalibration?.('complete', 100);
      return true;

    } catch (error) {
      console.error('[SmartAudio] Calibration failed:', error);
      if (!silent) this.onCalibration?.('error', 0);
      this.dynamicThreshold = 25;
      this.isCalibrated     = false;
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONITORING
  // ═══════════════════════════════════════════════════════════════════════════

  async startVoiceMonitoring() {
    if (!this.stream || !this.audioContext || !this.analyser) {
      throw new Error('[SmartAudio] Must call calibrateAmbientNoise() first');
    }

    // ── FIX 4: start decay timer ─────────────────────────────────────────────
    this._startDecayTimer();

    // ── FIX 3: attach visibility listener ────────────────────────────────────
    this._attachVisibilityListener();

    const detect = this._buildDetectFn();
    detect();

    // Return cleanup
    return () => this._cleanup();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE DETECTION FRAME (shared by monitoring + recalibration resume)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Builds and returns the rAF detection callback.
   *
   * VOICE BAND FIX: human speech spans 80 Hz – 3 400 Hz.
   *   The old code used only 85–255 Hz (~9 of 1024 FFT bins),
   *   making voicePct > 30 physically impossible.
   *   New range covers fundamental + all formants + consonants.
   *
   * THRESHOLD FIX:
   *   voicePct > 15 for normal voice  (was 30 — impossible with old band)
   *   voicePct >  8 for whisper       (was 20 — same problem)
   *   rawLoud   fallback: if overall avg is ≥ 2× threshold, flag anyway.
   */
  _buildDetectFn() {
    const sampleRate = this.audioContext.sampleRate;
    const binSize    = (sampleRate / 2) / this.analyser.frequencyBinCount;

      // Full speech band: 80 Hz – 3 400 Hz
    const lowBin  = Math.max(0, Math.floor(80   / binSize));
    const highBin = Math.min(this.analyser.frequencyBinCount - 1,
                             Math.ceil(3400 / binSize));
      const peakLowBin  = Math.max(0, Math.floor(120 / binSize));
      const peakHighBin = Math.min(this.analyser.frequencyBinCount - 1,
                                   Math.ceil(3800 / binSize));

    console.log(
      `[SmartAudio] Detection band: ${(lowBin  * binSize).toFixed(0)}–` +
      `${(highBin * binSize).toFixed(0)} Hz  ` +
      `(bins ${lowBin}–${highBin} of ${this.analyser.frequencyBinCount})`
    );

    const detect = () => {
      if (!this.analyser) return;

      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(data);

      const total       = data.reduce((a, b) => a + b, 0);
      const voiceBand   = [...data].slice(lowBin, highBin + 1);
      const voiceEnergy = voiceBand.reduce((a, b) => a + b, 0);
      const avg         = total / data.length;
      const voiceAvg    = voiceBand.reduce((a, b) => a + b, 0) / voiceBand.length;
      const voicePct    = total > 0 ? (voiceEnergy / total) * 100 : 0;
      const peakIndex   = data.reduce((maxIdx, v, i, arr) => (v > arr[maxIdx] ? i : maxIdx), 0);
      const peakInSpeechRange = peakIndex >= peakLowBin && peakIndex <= peakHighBin;

      // ── FIX 1: Spectral Flatness ────────────────────────────────────────
      const spectralFlatness = this._calcSpectralFlatness(data);
      const adaptiveThreshold = Math.max(this.dynamicThreshold, (this.noiseFloorEma || this.baseline) + 7);

      // ── Detection conditions ─────────────────────────────────────────────
      // Strong speech path
      const isNormalVoice =
        avg > adaptiveThreshold &&
        voicePct > 10 &&
        peakInSpeechRange;

      // Loud fallback (shout / nearby speaker)
      const isRawLoud = avg > adaptiveThreshold * 1.85;

      // Weak speech path (side whisper / low voice)
      const isWhisper = spectralFlatness < 0.5 && voicePct > 6.5 &&
                        voiceAvg > (this.baseline + 4);

      // Speech likelihood score (0..1), improves side/background speech capture
      const loudnessNorm = Math.min(1, avg / Math.max(1, adaptiveThreshold * 1.35));
      const voicePctNorm = Math.min(1, voicePct / 18);
      const flatnessNorm = Math.max(0, Math.min(1, (0.7 - spectralFlatness) / 0.7));
      const peakNorm = peakInSpeechRange ? 1 : 0.25;
      const speechLikelihood =
        (0.34 * loudnessNorm) +
        (0.33 * voicePctNorm) +
        (0.23 * flatnessNorm) +
        (0.10 * peakNorm);

      const isLikelySpeech =
        speechLikelihood > 0.55 &&
        voicePct > 5 &&
        avg > (this.noiseFloorEma + 2.5);

      if (isNormalVoice || isRawLoud || isWhisper || isLikelySpeech) {
        this.voiceFrameCount++;
        this.silenceFrameCount = 0;
        this._lastSpectralFlatness = spectralFlatness;
        this._lastAvg              = avg;
        this._lastVoicePct         = voicePct;

        // Debug every 30 frames (~0.5 s) so you can see it working
        if (this.voiceFrameCount % 30 === 1) {
          console.log(
            `[SmartAudio] Voice detected — avg:${avg.toFixed(1)} ` +
            `thr:${adaptiveThreshold.toFixed(1)} ` +
            `voicePct:${voicePct.toFixed(1)}% ` +
            `flatness:${spectralFlatness.toFixed(3)} ` +
            `likelihood:${speechLikelihood.toFixed(3)} ` +
            `frames:${this.voiceFrameCount}`
          );
        }
      } else {
        // Slowly adapt to changing ambient noise only when no speech is detected.
        if (this.noiseFloorEma === 0) this.noiseFloorEma = avg;
        this.noiseFloorEma = (this.noiseFloorEma * 0.98) + (avg * 0.02);

        if (this.voiceFrameCount > 0) {
          this.silenceFrameCount++;
          if (this.silenceFrameCount >= this.hangoverFrames) {
            this._handleVoiceEnd();
            this.silenceFrameCount = 0;
          }
        }
      }

      this.animationId = requestAnimationFrame(detect);
    };

    return detect;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL — voice end handler
  // ═══════════════════════════════════════════════════════════════════════════

  _handleVoiceEnd() {
    const now            = Date.now();
    const voiceDurationMs = this.voiceFrameCount * 16; // ~16ms per rAF frame

    // ── Duration gate: ignore < 0.5s ─────────────────────────────────────────
    if (voiceDurationMs < 300) {
      this.voiceFrameCount = 0;
      this.silenceFrameCount = 0;
      return;
    }

    // ── Severity from duration ────────────────────────────────────────────────
    let severity;
    if (voiceDurationMs < 2000)      severity = 'low';
    else if (voiceDurationMs < 5000) severity = 'medium';
    else                             severity = 'high';

    // ── FIX 2: LOW→MEDIUM upgrade (3 LOWs within 10s) ────────────────────────
    if (severity === 'low') {
      this.recentLowTimestamps = this.recentLowTimestamps.filter(t => now - t < 10_000);
      this.recentLowTimestamps.push(now);
      if (this.recentLowTimestamps.length >= 3) {
        severity = 'medium';
        this.recentLowTimestamps = []; // reset after upgrade
        console.log('[SmartAudio] 3× LOW within 10s → upgraded to MEDIUM');
      }
    }

    // ── FIX 2: Adaptive cooldown ──────────────────────────────────────────────
    const cooldown = this._getCooldown(severity);
    if (now - this.lastViolationTime < cooldown) {
      this.voiceFrameCount = 0;
      return;
    }

    // ── FIX 4: Update both raw and decayed risk scores ────────────────────────
    const points = this._riskPoints(severity);
    this.riskScore        = Math.min(100, this.riskScore + points);
    this.decayedRiskScore = Math.min(100, this.decayedRiskScore + points);
    this._saveRiskScore();

    // ── Build violation object ────────────────────────────────────────────────
    const violation = {
      type:               'audio',
      severity,
      volume:             Math.round(this._lastAvg ?? 0),
      voicePercent:       Math.round(this._lastVoicePct ?? 0),
      voiceDurationMs,
      spectralFlatness:   parseFloat((this._lastSpectralFlatness ?? 1).toFixed(4)), // FIX 1
      riskScore:          this.riskScore,                                            // raw audit
      decayedRiskScore:   Math.round(this.decayedRiskScore),                        // FIX 4
      dynamicThreshold:   Math.round(this.dynamicThreshold),
      calibrationVersion: this.calibrationVersion,                                  // FIX 3
      timestamp:          new Date().toISOString(),
    };

    this.onViolation?.(violation);
    this.onRiskUpdate?.({ riskScore: this.riskScore, decayedRiskScore: this.decayedRiskScore });

    this._logRiskLevel();

    this.lastViolationTime = now;
    this.voiceFrameCount   = 0;
    this.silenceFrameCount = 0;

    console.log('[SmartAudio] Violation:', violation);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 1 — Spectral Flatness
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Wiener entropy / spectral flatness.
   * Returns value in [0, 1]:
   *   ~1.0 = white noise / flat spectrum (AC hum, fan) → ignore
   *   ~0.0 = tonal / structured signal (voice, whisper) → flag
   */
  _calcSpectralFlatness(data) {
    // Use only non-zero bins to avoid log(0)
    const nonZero = [...data].filter(v => v > 0);
    if (nonZero.length === 0) return 1; // silence → treat as noise

    const logSum     = nonZero.reduce((acc, v) => acc + Math.log(v), 0);
    const geometricMean = Math.exp(logSum / nonZero.length);
    const arithmeticMean = nonZero.reduce((a, b) => a + b, 0) / nonZero.length;

    return arithmeticMean > 0 ? geometricMean / arithmeticMean : 1;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 2 — Adaptive Cooldown helpers
  // ═══════════════════════════════════════════════════════════════════════════

  _getCooldown(severity) {
    switch (severity) {
      case 'high':   return 500;
      case 'medium': return 1500;
      case 'low':
      default:       return 3000;
    }
  }

  _riskPoints(severity) {
    switch (severity) {
      case 'high':   return 30;
      case 'medium': return 15;
      case 'low':
      default:       return 5;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 3 — Recalibrate on Resume
  // ═══════════════════════════════════════════════════════════════════════════

  _attachVisibilityListener() {
    if (this._visibilityHandler) return; // already attached

    this._visibilityHandler = () => {
      if (document.hidden) {
        this._hiddenAt = Date.now();
      } else {
        const hiddenMs = this._hiddenAt ? Date.now() - this._hiddenAt : 0;
        this._hiddenAt = null;

        if (hiddenMs > 5000) {
          console.log(`[SmartAudio] Tab resumed after ${(hiddenMs / 1000).toFixed(1)}s — recalibrating`);
          this._scheduleQuickRecalibration('tab_resume');
        }
      }
    };

    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  _detachVisibilityListener() {
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
      this._visibilityHandler = null;
    }
  }

  /**
   * Silent 2-second recalibration — no UI modal, just updates threshold.
   * Logs a system event for audit trail.
   */
  async _scheduleQuickRecalibration(reason) {
    // Pause detection loop during recalibration
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    console.log(`[SmartAudio] Quick recalibration starting (reason: ${reason})`);

    await this.calibrateAmbientNoise({ durationMs: 2000, silent: true });

    // Log system event for admin audit
    const systemEvent = {
      type:               'recalibration',
      reason,
      newThreshold:       Math.round(this.dynamicThreshold),
      calibrationVersion: this.calibrationVersion,
      timestamp:          new Date().toISOString(),
    };
    console.log('[SmartAudio] Recalibration event:', systemEvent);
    // Forward as a non-violation system event if caller wants it
    this.onViolation?.({ ...systemEvent, _isSystemEvent: true });

    // Resume detection loop using shared _buildDetectFn (same thresholds as main loop)
    if (this.analyser) {
      const detect = this._buildDetectFn();
      detect();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 4 — Time-decayed risk score
  // ═══════════════════════════════════════════════════════════════════════════

  _startDecayTimer() {
    if (this._decayIntervalId) return;

    this._decayIntervalId = setInterval(() => {
      if (this.decayedRiskScore > 0) {
        this.decayedRiskScore = Math.max(0, this.decayedRiskScore * 0.85);
        this.onRiskUpdate?.({
          riskScore:        this.riskScore,
          decayedRiskScore: Math.round(this.decayedRiskScore),
        });
      }
    }, 60_000); // every 60 seconds
  }

  _stopDecayTimer() {
    if (this._decayIntervalId) {
      clearInterval(this._decayIntervalId);
      this._decayIntervalId = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  _logRiskLevel() {
    const score = this.decayedRiskScore; // FIX 4: warnings use decayed score
    if      (score > 90) console.warn('[SmartAudio] HIGH RISK — exam flagged for review');
    else if (score > 60) console.warn('[SmartAudio] MEDIUM-HIGH RISK — admin alert');
    else if (score > 30) console.warn('[SmartAudio] MEDIUM RISK — student warning');
  }

  getRiskLevelDescription(useDecayed = true) {
    const score = useDecayed ? this.decayedRiskScore : this.riskScore;
    if (score <= 30) return 'No suspicious activity';
    if (score <= 60) return 'Minor concerns';
    if (score <= 90) return 'Suspicious behaviour';
    return 'High risk — review required';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════

  _saveRiskScore() {
    try {
      localStorage.setItem('examAudioRiskScore',        this.riskScore.toString());
      localStorage.setItem('examAudioDecayedRiskScore', this.decayedRiskScore.toString());
    } catch (_) { /* storage unavailable */ }
  }

  _loadRiskScore() {
    try {
      const saved = localStorage.getItem('examAudioRiskScore');
      return saved ? Math.min(100, Math.max(0, parseInt(saved, 10))) : 0;
    } catch (_) { return 0; }
  }

  resetRiskScore() {
    this.riskScore        = 0;
    this.decayedRiskScore = 0;
    this._saveRiskScore();
    this.onRiskUpdate?.({ riskScore: 0, decayedRiskScore: 0 });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE / CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════

  getState() {
    return {
      isCalibrated:       this.isCalibrated,
      calibrationVersion: this.calibrationVersion,
      baseline:           this.baseline,
      dynamicThreshold:   this.dynamicThreshold,
      riskScore:          this.riskScore,
      decayedRiskScore:   Math.round(this.decayedRiskScore),
      riskLevel:          this.getRiskLevelDescription(),
      voiceFrameCount:    this.voiceFrameCount,
    };
  }

  _cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this._stopDecayTimer();
    this._detachVisibilityListener();

    if (this._audioStateHandler && this.audioContext) {
      this.audioContext.removeEventListener('statechange', this._audioStateHandler);
      this._audioStateHandler = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Legacy function wrapper — same signature, all 4 fixes included
// ═══════════════════════════════════════════════════════════════════════════

export async function startVoiceMonitoring(onViolationCallback) {
  const detector = new SmartAudioDetection({
    onViolation:  onViolationCallback,
    onRiskUpdate: ({ riskScore, decayedRiskScore }) => {
      console.log(`[SmartAudio] Risk — raw: ${riskScore}, decayed: ${decayedRiskScore}`);
    },
    onCalibration: (status, progress) => {
      if (status === 'calibrating') {
        console.log(`[SmartAudio] Calibrating... ${progress.toFixed(0)}%`);
      }
    },
  });

  await detector.calibrateAmbientNoise();
  return detector.startVoiceMonitoring();
}

export async function calibrateAmbientNoise() {
  const detector = new SmartAudioDetection({
    onCalibration: (status, progress) =>
      console.log(`[SmartAudio] ${status}: ${progress.toFixed(0)}%`),
  });
  return detector.calibrateAmbientNoise();
}

export default SmartAudioDetection;
