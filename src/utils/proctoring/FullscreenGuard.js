/**
 * FullscreenGuard — Prevents on-screen AI/overlay cheating by enforcing fullscreen mode.
 *
 * Detects:
 *   1. Fullscreen exit (ESC key, browser UI)
 *   2. Window resize / split-screen attempt
 *   3. Window focus loss (another window clicked on top)
 *   4. DevTools open attempt
 *
 * Response:
 *   Strike 1 → Warning + force re-enter fullscreen
 *   Strike 2 → Strong warning + flag admin
 *   Strike 3 → Exam terminate callback
 */

export class FullscreenGuard {
  constructor({
    onViolation    = null,  // (violationObject) => void — called on every strike
    onTerminate    = null,  // () => void — called when strike limit is reached
    maxStrikes     = 3,
    onStrikeUpdate = null,  // (strikeCount) => void — UI update
  } = {}) {
    this.onViolation    = onViolation;
    this.onTerminate    = onTerminate;
    this.onStrikeUpdate = onStrikeUpdate;
    this.maxStrikes     = maxStrikes;

    this.strikeCount       = 0;
    this.isActive          = false;
    this._cooldownUntil    = 0;          // prevent rapid duplicate strikes
    this._cooldownMs       = 3000;       // 3 seconds between strikes
    this._resizeTimeoutId  = null;

    // Bound handlers (so we can remove them later)
    this._onFullscreenChange = this._onFullscreenChange.bind(this);
    this._onWindowBlur       = this._onWindowBlur.bind(this);
    this._onResize           = this._onResize.bind(this);
    this._onKeyDown          = this._onKeyDown.bind(this);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start guarding. Call this after entering fullscreen.
   */
  start() {
    if (this.isActive) return;
    this.isActive = true;

    document.addEventListener('fullscreenchange',       this._onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this._onFullscreenChange);
    document.addEventListener('mozfullscreenchange',    this._onFullscreenChange);
    window.addEventListener('blur',   this._onWindowBlur);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('keydown', this._onKeyDown);

    console.log('[FullscreenGuard] Started — monitoring for on-screen cheating');
  }

  /**
   * Stop guarding. Call on exam submission or cleanup.
   */
  stop() {
    this.isActive = false;

    document.removeEventListener('fullscreenchange',       this._onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this._onFullscreenChange);
    document.removeEventListener('mozfullscreenchange',    this._onFullscreenChange);
    window.removeEventListener('blur',   this._onWindowBlur);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('keydown', this._onKeyDown);

    if (this._resizeTimeoutId) {
      clearTimeout(this._resizeTimeoutId);
      this._resizeTimeoutId = null;
    }

    console.log('[FullscreenGuard] Stopped');
  }

  /**
   * Request fullscreen programmatically.
   * Returns a promise that resolves to true if successful.
   */
  async requestFullscreen() {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen)            await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen)    await el.mozRequestFullScreen();
      return true;
    } catch (err) {
      console.warn('[FullscreenGuard] requestFullscreen failed:', err);
      return false;
    }
  }

  /**
   * Check if currently in fullscreen.
   */
  get isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );
  }

  get strikes() {
    return this.strikeCount;
  }

  resetStrikes() {
    this.strikeCount = 0;
    this.onStrikeUpdate?.(0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  _onFullscreenChange() {
    if (!this.isActive) return;

    if (!this.isFullscreen) {
      console.warn('[FullscreenGuard] Fullscreen exit detected!');
      this._handleViolation('FULLSCREEN_EXIT', 'high', 'Student exited fullscreen mode');
    }
  }

  _onWindowBlur() {
    if (!this.isActive) return;

    // Only flag if we're supposed to be in fullscreen
    // A blur while NOT in fullscreen is already flagged by fullscreenchange
    // This catches overlay windows that appear on top without exiting fullscreen
    if (this.isFullscreen) {
      console.warn('[FullscreenGuard] Window blur while in fullscreen — possible overlay!');
      this._handleViolation('WINDOW_BLUR_OVERLAY', 'medium', 'Another window appeared on top of exam');
    }
  }

  _onResize() {
    if (!this.isActive) return;

    // Debounce resize events (they fire continuously while dragging)
    if (this._resizeTimeoutId) clearTimeout(this._resizeTimeoutId);

    this._resizeTimeoutId = setTimeout(() => {
      const smallerThanScreen =
        window.innerWidth  < screen.width  - 100 ||
        window.innerHeight < screen.height - 100;

      if (smallerThanScreen && !this.isFullscreen) {
        console.warn('[FullscreenGuard] Window resized — possible split screen!');
        this._handleViolation('WINDOW_RESIZED', 'medium', 'Window resized — possible split screen detected');
      }
    }, 500);
  }

  _onKeyDown(e) {
    if (!this.isActive) return;

    // Block F12 (DevTools), Ctrl+Shift+I/J/C (DevTools shortcuts)
    const isDevTools =
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key?.toLowerCase()));

    // Block PrintScreen
    const isPrintScreen = e.key === 'PrintScreen';

    if (isDevTools) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('[FullscreenGuard] DevTools shortcut blocked!');
      this._handleViolation('DEVTOOLS_ATTEMPT', 'high', 'Attempted to open browser DevTools');
    }

    if (isPrintScreen) {
      e.preventDefault();
      console.warn('[FullscreenGuard] PrintScreen blocked!');
      this._handleViolation('SCREENSHOT_ATTEMPT', 'medium', 'Attempted to take a screenshot');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIOLATION HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  _handleViolation(type, severity, message) {
    const now = Date.now();

    // Cooldown gate — prevent rapid duplicate strikes
    if (now < this._cooldownUntil) {
      console.log(`[FullscreenGuard] Violation (${type}) in cooldown — skipping`);
      return;
    }
    this._cooldownUntil = now + this._cooldownMs;

    this.strikeCount++;
    this.onStrikeUpdate?.(this.strikeCount);

    const violation = {
      type,
      severity,
      message,
      strike:    this.strikeCount,
      maxStrikes: this.maxStrikes,
      timestamp: new Date().toISOString(),
    };

    console.warn(`[FullscreenGuard] Strike ${this.strikeCount}/${this.maxStrikes} — ${type}`);
    this.onViolation?.(violation);

    // Auto re-enter fullscreen on exit (give browser a moment first)
    if (type === 'FULLSCREEN_EXIT') {
      setTimeout(() => {
        if (!this.isFullscreen && this.isActive) {
          console.log('[FullscreenGuard] Auto re-requesting fullscreen...');
          this.requestFullscreen().then(ok => {
            if (!ok) {
              console.warn('[FullscreenGuard] Could not re-enter fullscreen automatically');
            }
          });
        }
      }, 800);
    }

    // Terminate on max strikes
    if (this.strikeCount >= this.maxStrikes) {
      console.error(`[FullscreenGuard] Max strikes (${this.maxStrikes}) reached — terminating exam`);
      this.stop();
      this.onTerminate?.();
    }
  }
}

export default FullscreenGuard;
