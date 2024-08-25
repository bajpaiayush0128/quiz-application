import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import CreateQuiz from "./components/CreateQuiz";
import PrivateRoute from "./utils/PrivateRoute";
import Result from "./components/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/" element={<Quiz />} />
        </Route>
        <Route path="/create-quiz" element={<PrivateRoute />}>
          <Route path="/create-quiz" element={<CreateQuiz />} />
        </Route>
        <Route path="/result" element={<PrivateRoute />}>
          <Route path="/result" element={<Result />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
