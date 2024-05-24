import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../utils/localStorage';
import QuizItem from './QuizItem';
import {logDOM} from "@testing-library/react";

interface Quiz {
    id: number;
    name: string;
    timer: number;
    questions: Array<{
        question: string;
        answers: string[];
        correctAnswers: number[];
        points?: number; // Додали опціональне поле points
    }>;
}

const QuizTaker: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [reviewMode, setReviewMode] = useState(false);


    useEffect(() => {
        const fetchedQuiz = getQuiz(Number(id));
        if (fetchedQuiz) {
            setQuiz(fetchedQuiz);
            setAnswers(Array(fetchedQuiz.questions.length).fill([]));
            setTimeLeft(fetchedQuiz.timer * 60);
        }
    }, [id]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    const handleNext = () => {
        if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleAnswerChange = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = [answerIndex];
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        let newScore = 0;
        answers.forEach((answerPair, index) => {
            answerPair.forEach(answer => {
                if (quiz && quiz.questions[index].correctAnswers.includes(answer)) {
                    newScore += quiz.questions[index].points ?? 1; // Додали points до розрахунку
                }
            });
        });
        setScore(newScore);
    };

    const handleReview = () => {
        setReviewMode(true);
    };

    if (!quiz) return <div>Loading...</div>;

    const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
    const seconds = timeLeft !== null ? timeLeft % 60 : 0;

    if (reviewMode) {
        return (
            <div className="container mx-auto mt-8 w-3/4 p-4 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">{quiz.name}</h1>
                {quiz.questions.map((question, index) => (
                    <QuizItem
                        key={index}
                        question={question.question}
                        answers={question.answers}
                        userAnswers={answers[index]}
                        correctAnswers={question.correctAnswers}
                    />
                ))}
            </div>
        );
    }

    const points = quiz.questions[currentQuestion]?.points ?? 0; // Додали points

    return (
        <div className="container mx-auto mt-40 w-3/4 p-4 bg-white rounded-lg shadow-lg ">
            <h1 className="text-4xl font-semibold mb-6">{quiz.name}</h1>
            <div className="mb-6 flex justify-between items-center text-lg">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}:</span>
            </div>
            <div className="mx-auto">
                <p className="text-lg mb-8">{quiz.questions[currentQuestion].question}</p>
                {quiz.questions[currentQuestion].answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center border bg-gray-200 h-12 p-3 mb-3 rounded-lg transition duration-300 hover:bg-gray-300">
                        <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            id={`question-${currentQuestion}-answer-${answerIndex}`}
                            checked={answers[currentQuestion].includes(answerIndex)}
                            onChange={() => handleAnswerChange(answerIndex)}
                            className="mr-4"
                        />
                        <label htmlFor={`question-${currentQuestion}-answer-${answerIndex}`}>{answer}</label>
                    </div>
                ))}
                <div>
                    {currentQuestion > 0 && (
                        <button
                            onClick={handlePrev}
                            className="bg-blue-400 hover:bg-blue-500 text-white text-lg mt-6 py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Prev
                        </button>
                    )}
                    {currentQuestion < (quiz.questions.length ?? 0) - 1 && (
                        <button
                            onClick={handleNext}
                            className="bg-green-500 hover:bg-green-600 text-white text-lg mt-6 py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Next
                        </button>
                    )}
                    {timeLeft !== null && (
                        <div className="mb-8 text-right">
                            <span className="text-lg">{minutes}m {seconds}s</span>
                        </div>
                    )}
                </div>
            </div>
            {(currentQuestion === (quiz.questions.length ?? 0) - 1 || timeLeft === 0) && (
                <button
                    onClick={handleSubmit}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                >
                    Submit
                </button>
            )}
            {score !== null && (
                <div>
                    <div className="text-lg mt-6 mb-4">Your score: {score}</div>
                    <button
                        onClick={handleReview}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Review Answers
                    </button>
                </div>
            )}
        </div>
    );
}

export default QuizTaker;
