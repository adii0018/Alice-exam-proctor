import { useEffect, useRef } from 'react';

/**
 * Modern SaaS-style Light Background Component
 * Optimized version with better performance
 * Features: Floating blobs, ambient glows, and glow dots
 * Inspired by Linear, Vercel, and Notion design systems
 */
const ModernLightBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: false // Performance hint
    });
    let animationId;
    let lastTime = 0;
    const fps = 30; // Reduced from 60fps for better performance
    const frameInterval = 1000 / fps;
    let resizeTimeout;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; // Fixed height instead of scrollHeight
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    // Floating blobs configuration (reduced count for performance)
    const blobs = [
      { x: 0.15, y: 0.12, radiusX: 280, radiusY: 320, color: '#c3e6d8', opacity: 0.45, blur: 45, speed: 0.0003, phase: 0 },
      { x: 0.82, y: 0.08, radiusX: 320, radiusY: 280, color: '#b8d8f0', opacity: 0.40, blur: 40, speed: 0.00025, phase: Math.PI },
      { x: 0.88, y: 0.75, radiusX: 300, radiusY: 340, color: '#a8d4c8', opacity: 0.50, blur: 48, speed: 0.00028, phase: Math.PI / 2 },
      { x: 0.08, y: 0.82, radiusX: 340, radiusY: 300, color: '#c0e0f4', opacity: 0.38, blur: 42, speed: 0.00032, phase: Math.PI * 1.5 },
    ];

    // Ambient glow configuration (reduced for performance)
    const glows = [
      { x: 0.25, y: 0.30, radiusX: 450, radiusY: 400, color: '#a0d8c8', opacity: 0.25, blur: 50 },
      { x: 0.70, y: 0.40, radiusX: 480, radiusY: 420, color: '#90c4e8', opacity: 0.22, blur: 52 },
    ];

    // Glow dots configuration (reduced count for performance)
    const dots = [
      { x: 0.12, y: 0.25, radius: 1.8, color: '#9fd4c0', opacity: 0.35, hasHalo: true },
      { x: 0.28, y: 0.15, radius: 2.2, color: '#8ec8e8', opacity: 0.32, hasHalo: false },
      { x: 0.62, y: 0.18, radius: 2.0, color: '#8ec8e8', opacity: 0.30, hasHalo: true },
      { x: 0.78, y: 0.28, radius: 1.7, color: '#9fd4c0', opacity: 0.36, hasHalo: false },
      { x: 0.15, y: 0.55, radius: 1.9, color: '#9fd4c0', opacity: 0.40, hasHalo: true },
      { x: 0.68, y: 0.68, radius: 2.4, color: '#8ec8e8', opacity: 0.34, hasHalo: true },
      { x: 0.82, y: 0.58, radius: 1.8, color: '#9fd4c0', opacity: 0.28, hasHalo: false },
      { x: 0.92, y: 0.85, radius: 2.0, color: '#8ec8e8', opacity: 0.35, hasHalo: false },
    ];

    const drawRadialGradientBackground = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.8;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#eef6f2');
      gradient.addColorStop(1, '#f6f8fa');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawAmbientGlow = (glow) => {
      const x = glow.x * canvas.width;
      const y = glow.y * canvas.height;

      ctx.save();
      ctx.filter = `blur(${glow.blur}px)`;
      ctx.globalAlpha = glow.opacity;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow.radiusX);
      gradient.addColorStop(0, glow.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, glow.radiusX, glow.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBlob = (blob, time) => {
      // Subtle floating animation
      const offsetX = Math.sin(blob.phase + time * blob.speed) * 15;
      const offsetY = Math.cos(blob.phase + time * blob.speed) * 12;

      const x = blob.x * canvas.width + offsetX;
      const y = blob.y * canvas.height + offsetY;

      ctx.save();
      ctx.filter = `blur(${blob.blur}px)`;
      ctx.globalAlpha = blob.opacity;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.radiusX);
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, blob.radiusX, blob.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawGlowDot = (dot) => {
      const x = dot.x * canvas.width;
      const y = dot.y * canvas.height;

      ctx.save();

      // Draw halo if enabled
      if (dot.hasHalo) {
        ctx.filter = 'blur(8px)';
        ctx.globalAlpha = 0.10;
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw main dot
      ctx.filter = 'blur(1px)';
      ctx.globalAlpha = dot.opacity;
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(x, y, dot.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = (currentTime) => {
      // Throttle to 30fps for better performance
      const elapsed = currentTime - lastTime;
      
      if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime - (elapsed % frameInterval);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Base radial gradient background
      drawRadialGradientBackground();

      // 2. Ambient glows (beneath blobs)
      glows.forEach(glow => drawAmbientGlow(glow));

      // 3. Floating blobs
      blobs.forEach(blob => drawBlob(blob, currentTime));

      // 4. Glow dots (static, no animation needed)
      dots.forEach(dot => drawGlowDot(dot));

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', debouncedResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ModernLightBackground;
