import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [passPercent, setPassPercent] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: null,
    marks: "",
  });
  const [step, setStep] = useState(1);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = e.target.value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (
      currentQuestion.question &&
      currentQuestion.options.every((opt) => opt) &&
      currentQuestion.correctAnswer !== null &&
      currentQuestion.marks
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        marks: "",
      });
    } else {
      alert("Please fill out all fields for the current question.");
    }
  };

  const handleQuizSubmit = async () => {
    const formattedQuestions = questions.map((question) => ({
      desc: question.question,
      options: question.options,
      correct: question.options[question.correctAnswer],
      marks: Number(question.marks),
    }));

    const quiz = {
      title: quizTitle,
      pass_percent: Number(passPercent),
      questions: formattedQuestions,
      quiz_duration: Number(quizDuration),
    };

    console.log("Quiz Details:", JSON.stringify(quiz, null, 2));

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No token found, please log in again.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/quizapi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error details:", errorData);
        if (response.status === 400) {
          alert(
            `Bad Request: ${errorData.detail || "Please check the input data."}`
          );
        } else if (response.status === 401) {
          alert("Unauthorized: Please check your login credentials.");
        } else {
          throw new Error("Failed to create quiz");
        }
        return;
      }

      const result = await response.json();
      console.log("Quiz created:", result);
      alert("Quiz created successfully!");

      // Clear form fields
      setQuizTitle("");
      setPassPercent("");
      setQuestions([]);
      setQuizDuration("");
      setStep(1);

      // Navigate to home route
      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Error creating quiz. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (quizTitle && passPercent && quizDuration) {
      setStep(2);
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create a Quiz</h2>
      {userRole === "UE" ? (
        step === 1 ? (
          <>
            <input
              type="text"
              placeholder="Enter quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Enter Pass percentage"
              value={passPercent}
              onChange={(e) => setPassPercent(e.target.value)}
              min="0"
              max="100"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Enter quiz duration (minutes)"
              value={quizDuration}
              onChange={(e) => setQuizDuration(e.target.value)}
              min="1"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleNextStep}
              className="inline-flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/")}
              className="mt-4 inline-flex items-center justify-center w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter question"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {currentQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            ))}
            <select
              value={
                currentQuestion.correctAnswer === null
                  ? ""
                  : currentQuestion.correctAnswer
              }
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  correctAnswer: Number(e.target.value),
                })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select correct answer</option>
              {currentQuestion.options.map((option, index) => (
                <option key={index} value={index}>
                  {`Option ${index + 1}`}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Enter marks (1-10)"
              value={currentQuestion.marks}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  marks: e.target.value,
                })
              }
              min="1"
              max="10"
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddQuestion}
              className="inline-flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Add Question
            </button>
            <button
              onClick={handleQuizSubmit}
              className="mt-4 inline-flex items-center justify-center w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 ease-in-out"
            >
              Submit Quiz
            </button>
          </div>
        )
      ) : (
        <p>You do not have permission to create quizzes.</p>
      )}
    </div>
  );
}

export default CreateQuiz;
