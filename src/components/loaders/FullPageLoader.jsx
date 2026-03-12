import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FullPageLoader() {
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate stars
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  const letters = ["A", "S", "R", "✈"];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900"
    >
      {/* Deep Space Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/20 to-black/40" />

      {/* Animated Nebula Clouds */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(88, 166, 255, 0.3) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-40 left-40 w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Distant Galaxy Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ASR Animated Loader */}
        <div className="relative flex items-center justify-center w-48 h-48 mb-8">
          {/* Rotating Circle with Gradient Shadow */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full"
            style={{
              animation: "loaderRotate 2s linear infinite",
            }}
          />

          {/* ASR Text with Animation */}
          <div className="relative z-10 flex items-center justify-center gap-1 text-white text-4xl font-light tracking-wider">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block"
                animate={{
                  opacity: [0.4, 1, 0.7, 0.4],
                  scale: [1, 1.15, 1, 1],
                  y: [0, -5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Title */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl font-bold text-white mb-2"
        >
          Ａʟ ɪ c ᴇㅤ☁  E X A M
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80 mb-8 text-lg"
        >
          AI-Powered Proctoring System
        </motion.p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-white via-blue-200 to-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.p
            className="text-white/60 mt-4 text-sm font-medium text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {progress}% Loading...
            <br />
            ‼️ राधे राधे ‼️
          </motion.p>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes loaderRotate {
          0% {
            transform: rotate(90deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset,
              0 60px 60px 0 #471eec inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 10px 0 #d60a47 inset,
              0 40px 60px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset,
              0 60px 60px 0 #471eec inset;
          }
        }
      `}</style>
    </motion.div>
  );
}
