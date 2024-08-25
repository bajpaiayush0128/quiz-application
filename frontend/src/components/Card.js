import React from "react";

function Card({ title, duration, questionCount, onStart }) {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 p-4">
      <div className="h-full rounded-lg overflow-hidden shadow-lg bg-blue-100 transition-transform transform hover:scale-105 duration-300">
        <div className="px-6 py-10">
          <div className="font-bold text-xl font-sans md:font-serif mb-2 text-gray-900">
            {title}
          </div>
          <p className="text-gray-600 font-sans md:font-serif text-base">
            Duration: {duration}
          </p>
          <p className="text-gray-600 font-sans md:font-serif text-base">
            Number of Questions: {questionCount}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2 flex justify-center">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
