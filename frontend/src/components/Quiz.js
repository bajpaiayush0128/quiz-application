import React, { useState, useEffect, useCallback, useId } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Card from "./Card";
import Sidebar from "./Sidebar";
import Timer from "./Timer";
import Logout from "./LogOut";

function Quiz() {
  const navigate = useNavigate();
  const [showFullScreenPrompt, setShowFullScreenPrompt] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState([]);

  const timerDuration = selectedBatch?.duration * 60 || 600;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizResponse = await axios.get(
          "http://127.0.0.1:8000/api/quizapi/"
        );
        const resultResponse = await axios.get(
          "http://127.0.0.1:8000/api/results/"
        );

        const quizData = quizResponse.data;
        const resultData = resultResponse.data;

        const userId = localStorage.getItem("userid");
        console.log(typeof resultData[0].user);
        // console.log(typeof userId);
        const userIdNum = parseInt(userId);
        console.log(typeof userIdNum);

        const filteredQuizzes = quizData.filter(
          (quiz) =>
            !resultData.some(
              (result) => result.user === userIdNum && result.quiz === quiz.id
            )
        );

        const transformedData = filteredQuizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          duration: quiz.quiz_duration,
          passPercent: quiz.pass_percent,
          totalMarks: quiz.total_marks,
          questions: quiz.questions.map((question) => ({
            id: question.id,
            question: question.desc,
            options: question.options,
            marks: question.marks,
          })),
        }));

        setBatches(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFullScreenChange = useCallback(() => {
    if (!document.fullscreenElement && !quizCompleted) {
      setShowFullScreenPrompt(true);
    }
  }, [quizCompleted]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [handleFullScreenChange]);

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
    setShowFullScreenPrompt(false);
  };

  const handleStartQuiz = async (batch) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    requestFullScreen();

    setSelectedBatch(batch);
    setSelectedAnswers(Array(batch.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setStartTime(Date.now());
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleAnswerSelect = (index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < selectedBatch.questions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        selectedAnswers[i] = null;
      }
    }

    setQuizCompleted(true);

    if (document.fullscreenElement) {
      try {
        document.exitFullscreen();
      } catch (error) {
        console.error("Failed to exit fullscreen mode:", error);
      }
    }

    const submissionData = selectedBatch.questions.map((question, index) => ({
      question_id: question.id,
      selected_option:
        selectedAnswers[index] !== null
          ? question.options[selectedAnswers[index]]
          : null,
    }));

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/quizapi/${selectedBatch.id}/submit_result/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: submissionData }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const responseData = await response.json();
      const score = responseData.result;
      const totalMarks = selectedBatch.totalMarks;
      const passPercent = selectedBatch.passPercent;
      const resultPercentage = (score / totalMarks) * 100;
      const resultMessage =
        resultPercentage >= passPercent
          ? "You have passed the Quiz"
          : "You have failed the Quiz";

      navigate("/result", {
        state: { score, totalMarks, passPercent, resultMessage },
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredBatches = batches.filter(
    (batch) => !userResults.some((result) => result.quiz === batch.id)
  );

  if (showFullScreenPrompt) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="mb-4 text-lg font-semibold">
            This quiz can only be taken in full screen mode.
          </p>
          <button
            onClick={requestFullScreen}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Enter Full Screen Mode
          </button>
        </div>
      </div>
    );
  }

  if (!selectedBatch) {
    return (
      <div className="flex flex-wrap justify-center">
        <Logout />
        <div className="w-full flex justify-end p-4">
          <a
            href="/create-quiz"
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
          >
            Create Quiz
          </a>
        </div>
        {filteredBatches.map((batch, index) => (
          <Card
            key={index}
            title={batch.title}
            duration={batch.duration}
            questionCount={batch.questions.length}
            onStart={() => handleStartQuiz(batch)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      {!quizCompleted && (
        <Sidebar
          questions={selectedBatch.questions}
          currentQuestionIndex={currentQuestionIndex}
          navigateToQuestion={navigateToQuestion}
          selectedAnswers={selectedAnswers}
        />
      )}
      <div className="flex-grow p-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            {selectedBatch.title} Quiz
          </h1>
          <Timer
            startTime={startTime}
            duration={timerDuration}
            onTimeUp={handleTimeUp}
          />
          <p className="text-lg mb-4">
            {selectedBatch.questions[currentQuestionIndex].question}
          </p>
          <div className="grid grid-cols-1 gap-4">
            {selectedBatch.questions[currentQuestionIndex].options.map(
              (option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full py-3 px-4 rounded-lg border-2 ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              )
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex <= 0}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < selectedBatch.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-green-500 text-white rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
