import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

const QuestionPanel = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onAnswerSelect,
  onMarkForReview,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  allQuestions,
  answers,
  markedForReview,
  onQuestionSelect,
  currentQuestion
}) => {
  const getQuestionStatus = (index) => {
    const q = allQuestions[index];
    if (answers[q.id]) return 'answered';
    if (markedForReview.has(q.id)) return 'marked';
    return 'unanswered';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <button
            onClick={onMarkForReview}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isMarkedForReview
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            {isMarkedForReview ? 'Marked' : 'Mark for Review'}
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <motion.button
              key={option.id}
              onClick={() => onAnswerSelect(option.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left p-4 lg:p-5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Option Letter */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {optionLabel}
                </div>

                {/* Option Text */}
                <div className="flex-1 pt-0.5">
                  <p className={`text-base lg:text-lg ${
                    isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'
                  }`}>
                    {option.text}
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Keyboard Hint */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Keyboard shortcuts: Press <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">1-4</kbd> to select options, 
          <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mx-1">←</kbd> 
          <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">→</kbd> to navigate
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Question Navigator Grid */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h3>
        <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-2">
          {allQuestions.map((q, index) => {
            const status = getQuestionStatus(index);
            const isCurrent = index === currentQuestion;

            return (
              <button
                key={q.id}
                onClick={() => onQuestionSelect(index)}
                className={`aspect-square rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                    : status === 'answered'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : status === 'marked'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></div>
            <span>Marked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
            <span>Not Answered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
