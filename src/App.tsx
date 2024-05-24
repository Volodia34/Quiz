import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import QuizList from "./components/QuizList";
import QuizForm from "./components/QuizForm";
import QuizTaker from "./components/QuizTaker";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/add" element={<QuizForm />} />
          <Route path="/edit/:id" element={<QuizForm />} />
          <Route path="/take/:id" element={<QuizTaker />} />
        </Routes>
      </Router>
  );
}

export default App;
