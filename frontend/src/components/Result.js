import React from "react";
import { useLocation, Link } from "react-router-dom";

function Result() {
  const location = useLocation();
  const { score, totalMarks, resultMessage } = location.state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
        <p className="text-lg font-semibold mb-2">
          Your final score is: {score}/{totalMarks}
        </p>
        <p className="text-lg mt-4">{resultMessage}</p>
        <p className="text-lg mt-4">
          Congratulations! You have completed the quiz.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default Result;
