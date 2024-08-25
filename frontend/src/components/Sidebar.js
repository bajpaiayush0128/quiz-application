import React from 'react';

function Sidebar({ questions, currentQuestionIndex, navigateToQuestion, selectedAnswers }) {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Questions</h2>
      <ul className="space-y-2">
        {questions.map((_, index) => (
          <li key={index}>
            <button
              onClick={() => navigateToQuestion(index)}
              className={`w-full py-2 px-4 rounded-lg text-left ${
                currentQuestionIndex === index
                  ? 'bg-blue-500 text-white'
                  : selectedAnswers[index] !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              Question {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
