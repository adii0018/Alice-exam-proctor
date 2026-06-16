import { useState, useEffect } from 'react';
import soundManager from '../utils/soundEffects';

export const useExamTimer = ({ initialDurationSeconds, exam, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialDurationSeconds || 3600);

  // Initialize timer when exam loads
  useEffect(() => {
    if (exam && exam.duration) {
      setTimeRemaining(exam.duration * 60);
    }
  }, [exam]);

  // Handle countdown
  useEffect(() => {
    if (!exam || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 10 && prev > 1) {
          soundManager.playTick();
        }
        if (prev <= 1) {
          soundManager.playExamEnd();
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [exam, timeRemaining, onTimeUp]);

  return { timeRemaining, setTimeRemaining };
};
