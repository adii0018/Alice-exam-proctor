import { useState, useCallback, useEffect } from 'react';
import soundManager from '../utils/soundEffects';

export const useQuiz = (exam) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());

  const handleAnswerSelect = useCallback((questionId, optionId) => {
    soundManager.playClick();
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleMarkForReview = useCallback((questionId) => {
    setMarkedForReview(prev => {
      const s = new Set(prev);
      s.has(questionId) ? s.delete(questionId) : s.add(questionId);
      return s;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (exam && currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(p => p + 1);
    }
  }, [exam, currentQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(p => p - 1);
    }
  }, [currentQuestion]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
      else if (['1','2','3','4'].includes(e.key) && exam?.questions[currentQuestion]) {
        const opt = exam.questions[currentQuestion].options[parseInt(e.key) - 1];
        if (opt) handleAnswerSelect(exam.questions[currentQuestion].id, opt.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentQuestion, exam, handlePrevious, handleNext, handleAnswerSelect]);

  const calculateResults = useCallback(() => {
    let correctCount = 0;
    let wrongCount = 0;
    const transformedAnswers = {};

    Object.keys(answers).forEach(qId => {
      const question = exam.questions.find(q => String(q.id) === String(qId));
      if (!question) return;

      const selectedOptionId = Number(answers[qId]);
      transformedAnswers[qId] = selectedOptionId;

      const correctOptionId = Number(question.correctAnswer);
      if (Number.isFinite(correctOptionId) && correctOptionId >= 0 && String(question.correctAnswer).trim() !== '') {
        if (selectedOptionId === correctOptionId) correctCount++;
        else wrongCount++;
        return;
      }

      // Fallback: compare answer text
      const selectedOption = question.options[selectedOptionId];
      const selectedText = selectedOption?.text;
      if (selectedText !== undefined && selectedText === question.correctAnswer) correctCount++;
      else wrongCount++;
    });

    return { correctCount, wrongCount, transformedAnswers };
  }, [answers, exam]);

  return {
    currentQuestion,
    setCurrentQuestion,
    answers,
    markedForReview,
    handleAnswerSelect,
    handleMarkForReview,
    handleNext,
    handlePrevious,
    calculateResults
  };
};
