import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, saveQuiz } from '../utils/localStorage';

interface Quiz {
    id: number | null;
    name: string;
    questions: Array<{
        question: string;
        answers: string[];
        correctAnswer: number | null;
    }>;
}

const QuizForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz>({
        id: null,
        name: '',
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
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { question: '', answers: [], correctAnswer: null },
            ],
        });
    };

    const handleSaveQuiz = () => {
        saveQuiz(quiz);
        navigate('/');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Quiz' : 'Add Quiz'}</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Quiz Name:</label>
                <input
                    type="text"
                    className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={quiz.name}
                    onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
                />
            </div>
            {quiz.questions.map((q, index) => (
                <div key={index}>
                    <label className="block text-gray-700 font-bold mb-2">Question:</label>
                    <input
                        type="text"
                        className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={q.question}
                        onChange={(e) => {
                            const newQuestions = [...quiz.questions];
                            newQuestions[index].question = e.target.value;
                            setQuiz({ ...quiz, questions: newQuestions });
                        }}
                    />
                    <button
                        className="mt-2 py-2 px-4 bg-red-500 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                            const newQuestions = quiz.questions.filter(
                                (_, i) => i !== index
                            );
                            setQuiz({ ...quiz, questions: newQuestions });
                        }}
                    >
                        Delete Question
                    </button>
                </div>
            ))}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                onClick={handleAddQuestion}
            >
                Add Question
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSaveQuiz}
            >
                Save Quiz
            </button>
        </div>
    );
};

export default QuizForm;
