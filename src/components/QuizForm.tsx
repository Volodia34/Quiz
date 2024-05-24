import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, saveQuiz } from '../utils/localStorage';

interface Quiz {
    id: number | null;
    name: string;
    timer: number;
    questions: Array<{
        question: string;
        answers: string[];
        correctAnswers: number[];
        points: number; // додане поле для кількості балів за питання
    }>;
}

const QuizForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz>({
        id: null,
        name: '',
        timer: 0,
        questions: [],
    });

    useEffect(() => {
        if (id) {
            const existingQuiz = getQuiz(Number(id));
            if (existingQuiz) {
                setQuiz(existingQuiz);
            }
        }
    }, [id]);

    const handleAddQuestion = () => {
        setQuiz(prevQuiz => {
            const newQuestion = {
                question: '',
                answers: [''],
                correctAnswers: [0],
                points: 1 // За замовчуванням 1 бал за питання
            };

            const updatedQuestions = [...prevQuiz.questions, newQuestion];

            return {
                ...prevQuiz,
                questions: updatedQuestions
            };
        });
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = [...quiz.questions];
        newQuestions.splice(index, 1);
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].answers[answerIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleCorrectAnswerChange = (questionIndex: number, answerIndex: number) => {
        const newQuestions = [...quiz.questions];
        const correctAnswers = newQuestions[questionIndex].correctAnswers;
        const index = correctAnswers.indexOf(answerIndex);
        if (index === -1) {
            correctAnswers.push(answerIndex);
        } else {
            correctAnswers.splice(index, 1);
        }
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSaveQuiz = () => {
        const isQuizValid = validateQuiz();
        if (!isQuizValid) {
            alert('Please fill in all required fields.');
            return;
        }

        saveQuiz(quiz);
        navigate('/');
    };

    const validateQuiz = () => {
        if (!quiz.name.trim() || quiz.timer <= 0) {
            return false;
        }

        for (const question of quiz.questions) {
            if (!question.question.trim() || question.answers.some(answer => !answer.trim()) || question.points <= 0) {
                return false;
            }
        }

        return true;
    };

    return (
        <div className="container mx-auto p-6 border border-gray-300 rounded-lg max-w-xl mt-16 bg-white">
            <h1 className="text-3xl font-bold mb-6 text-center">{id ? 'Edit Quiz' : 'Add Quiz'}</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Quiz Name:</label>
                <input
                    type="text"
                    className="border-2 rounded py-2 px-3 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                    placeholder="Enter quiz name"
                    value={quiz.name}
                    onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Timer (in minutes):</label>
                <input
                    type="number"
                    className="border-2 rounded py-2 px-3 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                    placeholder="Enter timer"
                    value={quiz.timer}
                    onChange={(e) => setQuiz({ ...quiz, timer: parseInt(e.target.value) })}
                />
            </div>
            {quiz.questions.map((q, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">Question:</label>
                    <input
                        type="text"
                        className="border rounded py-2 px-3 mb-2 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                        placeholder="Enter question"
                        value={q.question}
                        onChange={(e) => {
                            const newQuestions = [...quiz.questions];
                            newQuestions[questionIndex].question = e.target.value;
                            setQuiz({...quiz, questions: newQuestions});
                        }}
                    />
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">Answers:</label>
                    <div className="flex flex-col space-y-2">
                        {q.answers.map((answer, answerIndex) => (
                            <input
                                key={answerIndex}
                                type="text"
                                className="border rounded py-2 px-3 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder={`Enter answer ${answerIndex + 1}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                            />
                        ))}
                        <div className="flex justify-between">
                            <button
                                className="py-2 px-4 bg-red-500 text-white font-semibold rounded focus:outline
-none focus:shadow-outline"
                                onClick={() => {
                                    const newQuestions = [...quiz.questions];
                                    newQuestions[questionIndex].answers.pop();
                                    setQuiz({...quiz, questions: newQuestions});
                                }}
                            >
                                Remove Answer
                            </button>
                            <button
                                className="py-2 px-4 bg-green-500 text-white font-semibold rounded focus:outline-none focus:shadow-outline"
                                onClick={() => {
                                    const newQuestions = [...quiz.questions];
                                    newQuestions[questionIndex].answers.push('');
                                    setQuiz({...quiz, questions: newQuestions});
                                }}
                            >
                                Add Answer
                            </button>
                        </div>
                    </div>
                    <label className="block text-gray-700 font-semibold mt-4">Correct Answers:</label>
                    {q.answers.map((answer, answerIndex) => (
                        <label key={answerIndex} className="block mt-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={q.correctAnswers.includes(answerIndex) || (answerIndex === 0 && q.correctAnswers.length === 0)}
                                onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                            />
                            {answer}
                        </label>
                    ))}
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">Points:</label>
                    <input
                        type="number"
                        className="border-2 rounded py-2 px-3 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                        placeholder="Enter points"
                        value={q.points}
                        onChange={(e) => {
                            const newQuestions = [...quiz.questions];
                            newQuestions[questionIndex].points = parseInt(e.target.value);
                            setQuiz({...quiz, questions: newQuestions});
                        }}
                    />
                    <button
                        className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleDeleteQuestion(questionIndex)}
                    >
                        Delete Question
                    </button>
                </div>
            ))}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                onClick={handleAddQuestion}
            >
                Add Question
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSaveQuiz}
            >
                Save Quiz
            </button>
        </div>
    );
};

export default QuizForm;
