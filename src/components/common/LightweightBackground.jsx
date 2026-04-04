/**
 * Lightweight CSS-based Background Component
 * Ultra-smooth performance with pure CSS animations
 * No canvas, no JavaScript animation loops
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
      background: 'radial-gradient(circle at 50% 50%, #eef6f2 0%, #f6f8fa 100%)',
    }}>
      {/* Floating Blobs */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '12%',
        width: '560px',
        height: '640px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #c3e6d8 0%, transparent 70%)',
        opacity: 0.45,
        filter: 'blur(45px)',
        animation: 'float1 25s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '15%',
        width: '640px',
        height: '560px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #b8d8f0 0%, transparent 70%)',
        opacity: 0.40,
        filter: 'blur(40px)',
        animation: 'float2 28s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '600px',
        height: '680px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #a8d4c8 0%, transparent 70%)',
        opacity: 0.50,
        filter: 'blur(48px)',
        animation: 'float3 30s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '680px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #c0e0f4 0%, transparent 70%)',
        opacity: 0.38,
        filter: 'blur(42px)',
        animation: 'float4 26s ease-in-out infinite',
      }} />

      {/* Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '20%',
        width: '900px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #a0d8c8 0%, transparent 70%)',
        opacity: 0.25,
        filter: 'blur(50px)',
        animation: 'glow1 35s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '35%',
        right: '25%',
        width: '960px',
        height: '840px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #90c4e8 0%, transparent 70%)',
        opacity: 0.22,
        filter: 'blur(52px)',
        animation: 'glow2 38s ease-in-out infinite',
      }} />

      {/* Glow Dots */}
      {[
        { top: '25%', left: '12%', color: '#9fd4c0', size: '4px', delay: '0s' },
        { top: '15%', left: '28%', color: '#8ec8e8', size: '5px', delay: '2s' },
        { top: '18%', right: '38%', color: '#8ec8e8', size: '4px', delay: '4s' },
        { top: '28%', right: '22%', color: '#9fd4c0', size: '3.5px', delay: '1s' },
        { top: '55%', left: '15%', color: '#9fd4c0', size: '4px', delay: '3s' },
        { top: '68%', right: '32%', color: '#8ec8e8', size: '5px', delay: '5s' },
        { top: '58%', right: '18%', color: '#9fd4c0', size: '3.5px', delay: '2.5s' },
        { bottom: '15%', right: '8%', color: '#8ec8e8', size: '4px', delay: '1.5s' },
      ].map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...dot,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: dot.color,
            opacity: 0.35,
            filter: 'blur(1px)',
            boxShadow: `0 0 20px ${dot.color}`,
            animation: `pulse 3s ease-in-out infinite ${dot.delay}`,
          }}
        />
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15px, -12px); }
          66% { transform: translate(-12px, 10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-18px, 15px); }
          66% { transform: translate(14px, -10px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(12px, 18px); }
          66% { transform: translate(-15px, -12px); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-14px, -16px); }
          66% { transform: translate(16px, 14px); }
        }
        
        @keyframes glow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.05); }
        }
        
        @keyframes glow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-18px, 20px) scale(1.05); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.40; }
        }
      `}</style>
    </div>
  );
};

export default LightweightBackground;
