import { useEffect, useRef, useCallback } from 'react'

/**
 * useWebcamScreenshot - Captures periodic screenshots from webcam
 * 
 * @param {Object} options
 * @param {React.RefObject} options.videoRef - Video element reference
 * @param {boolean} options.enabled - Enable/disable screenshot capture
 * @param {number} options.intervalMs - Interval between screenshots (default: 30000ms = 30s)
 * @param {Function} options.onScreenshot - Callback with screenshot data (base64)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 */
const useWebcamScreenshot = ({
  videoRef,
  enabled = true,
  intervalMs = 30000, // 30 seconds
  onScreenshot = null,
  quality = 0.8,
} = {}) => {
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)

  // Capture screenshot from video element
  const captureScreenshot = useCallback(() => {
    if (!videoRef?.current || !enabled) return null

    const video = videoRef.current
    if (video.readyState < 2) return null // Video not ready

    try {
      // Create canvas if not exists
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }

      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to base64 JPEG
      const screenshot = canvas.toDataURL('image/jpeg', quality)
      
      if (onScreenshot) {
        onScreenshot({
          data: screenshot,
          timestamp: new Date().toISOString(),
          width: canvas.width,
          height: canvas.height,
        })
      }

      return screenshot
    } catch (error) {
      console.error('[useWebcamScreenshot] Capture failed:', error)
      return null
    }
  }, [videoRef, enabled, quality, onScreenshot])

  // Setup periodic screenshot capture
  useEffect(() => {
    if (!enabled || !videoRef?.current) return

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Start periodic capture
    intervalRef.current = setInterval(() => {
      captureScreenshot()
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, videoRef, intervalMs, captureScreenshot])

  return {
    captureScreenshot, // Manual capture function
  }
}

export default useWebcamScreenshot
