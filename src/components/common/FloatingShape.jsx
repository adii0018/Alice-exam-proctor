import React from 'react';

const FloatingShape = ({ delay = 0, duration = 20, size = 'md', position = 'left' }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const positionClasses = {
    left: 'left-[10%] top-[20%]',
    right: 'right-[15%] top-[40%]',
    center: 'left-[45%] top-[60%]',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} pointer-events-none`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div className="relative w-full h-full animate-float-slow">
        {/* Main Sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 
          backdrop-blur-3xl border border-white/5 shadow-2xl shadow-purple-500/10
          animate-pulse-slow" 
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />
        
        {/* Inner Glow */}
        <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-transparent 
          blur-2xl animate-pulse-glow" />
        
        {/* Highlight */}
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full 
          bg-white/10 blur-xl" />
      </div>
    </div>
  );
};

export default FloatingShape;
