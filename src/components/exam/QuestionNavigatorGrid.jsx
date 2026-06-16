import PropTypes from 'prop-types';

const QuestionNavigatorGrid = ({ allQuestions, currentQuestion, answers, markedForReview, onQuestionSelect }) => {
  const getQuestionStatus = (index) => {
    const q = allQuestions[index];
    if (answers[q.id]) return 'answered';
    if (markedForReview.has(q.id)) return 'marked';
    return 'unanswered';
  };

  return (
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
  );
};

QuestionNavigatorGrid.propTypes = {
  allQuestions: PropTypes.array.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  markedForReview: PropTypes.object.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
};

export default QuestionNavigatorGrid;
