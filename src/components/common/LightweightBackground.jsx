/**
 * Premium Light-Mode Background
 * Aurora-style SaaS background — mint/teal/sky palette
 * Used in Teacher & Student dashboards when light mode is active
 */
const LightweightBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 50%, #eef6f2 0%, #f6f8fa 100%)',
    }}>

      {/* ── Ambient Glow Layer (deepest, most blurred) ── */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: '900px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, #a0d8c8 0%, transparent 70%)',
        opacity: 0.25, filter: 'blur(60px)',
        animation: 'glow1 38s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '5%',
        width: '960px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, #90c4e8 0%, transparent 70%)',
        opacity: 0.22, filter: 'blur(65px)',
        animation: 'glow2 42s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '30%',
        width: '880px', height: '720px', borderRadius: '50%',
        background: 'radial-gradient(circle, #b8e8d8 0%, transparent 70%)',
        opacity: 0.20, filter: 'blur(58px)',
        animation: 'glow3 35s ease-in-out infinite',
      }} />

      {/* ── Floating Blob Layer ── */}
      <div style={{
        position: 'absolute', top: '6%', left: '10%',
        width: '580px', height: '660px', borderRadius: '50%',
        background: 'radial-gradient(circle, #c3e6d8 0%, transparent 70%)',
        opacity: 0.45, filter: 'blur(48px)',
        animation: 'float1 26s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '4%', right: '12%',
        width: '660px', height: '580px', borderRadius: '50%',
        background: 'radial-gradient(circle, #b8d8f0 0%, transparent 70%)',
        opacity: 0.40, filter: 'blur(44px)',
        animation: 'float2 30s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '18%', right: '8%',
        width: '620px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, #a8d4c8 0%, transparent 70%)',
        opacity: 0.50, filter: 'blur(52px)',
        animation: 'float3 32s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '12%', left: '4%',
        width: '700px', height: '620px', borderRadius: '50%',
        background: 'radial-gradient(circle, #c0e0f4 0%, transparent 70%)',
        opacity: 0.38, filter: 'blur(46px)',
        animation: 'float4 28s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '38%',
        width: '640px', height: '640px', borderRadius: '50%',
        background: 'radial-gradient(circle, #d4ede4 0%, transparent 70%)',
        opacity: 0.35, filter: 'blur(50px)',
        animation: 'float5 34s ease-in-out infinite',
      }} />

      {/* ── Glow Dots ── */}
      {[
        { top: '12%',  left: '8%',   color: '#9fd4c0', s: '4px',   halo: true,  delay: '0s'   },
        { top: '22%',  left: '26%',  color: '#8ec8e8', s: '3px',   halo: false, delay: '1.8s' },
        { top: '8%',   left: '55%',  color: '#9fd4c0', s: '5px',   halo: true,  delay: '3.2s' },
        { top: '16%',  right: '20%', color: '#8ec8e8', s: '3.5px', halo: false, delay: '0.6s' },
        { top: '35%',  left: '6%',   color: '#9fd4c0', s: '4px',   halo: false, delay: '2.4s' },
        { top: '48%',  right: '14%', color: '#8ec8e8', s: '5px',   halo: true,  delay: '4s'   },
        { top: '60%',  left: '18%',  color: '#9fd4c0', s: '3px',   halo: false, delay: '1.2s' },
        { top: '55%',  right: '30%', color: '#8ec8e8', s: '4px',   halo: false, delay: '3.6s' },
        { bottom: '28%', left: '42%', color: '#9fd4c0', s: '3.5px', halo: true, delay: '2s'  },
        { bottom: '18%', right: '22%', color: '#8ec8e8', s: '4px',  halo: false, delay: '0.4s' },
        { bottom: '10%', left: '12%', color: '#9fd4c0', s: '5px',   halo: false, delay: '5s'  },
        { bottom: '8%',  right: '8%', color: '#8ec8e8', s: '3px',   halo: true,  delay: '1.6s' },
        { top: '75%',  left: '60%',  color: '#9fd4c0', s: '4px',   halo: false, delay: '2.8s' },
        { top: '30%',  right: '42%', color: '#8ec8e8', s: '3.5px', halo: false, delay: '4.4s' },
      ].map((dot, i) => (
        <div key={i} style={{ position: 'absolute', ...dot, width: dot.s, height: dot.s }}>
          {/* halo ring */}
          {dot.halo && (
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${dot.color}1a 0%, transparent 70%)`,
              filter: 'blur(3px)',
            }} />
          )}
          <div style={{
            width: dot.s, height: dot.s,
            borderRadius: '50%',
            backgroundColor: dot.color,
            opacity: 0.34,
            filter: 'blur(0.8px)',
            boxShadow: `0 0 8px ${dot.color}88`,
            animation: `pulse 3s ease-in-out infinite ${dot.delay}`,
            position: 'relative', zIndex: 1,
          }} />
        </div>
      ))}

      {/* ── Grain / Noise Texture (SVG fractalNoise) ── */}
      <svg
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          opacity: 0.05, mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes float1 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(16px,-14px); }
          66%      { transform: translate(-13px,11px); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(-20px,16px); }
          66%      { transform: translate(15px,-11px); }
        }
        @keyframes float3 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(13px,20px); }
          66%      { transform: translate(-16px,-13px); }
        }
        @keyframes float4 {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(-15px,-18px); }
          66%      { transform: translate(18px,15px); }
        }
        @keyframes float5 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(10px,-10px) scale(1.04); }
        }
        @keyframes glow1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(22px,-18px) scale(1.06); }
        }
        @keyframes glow2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-20px,22px) scale(1.06); }
        }
        @keyframes glow3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(14px,16px) scale(1.04); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.28; }
          50%      { opacity: 0.40; }
        }
      `}</style>
    </div>
  );
};

export default LightweightBackground;
