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
            <h1 className="text-2xl font-bold">{id ? 'Edit Quiz' : 'Add Quiz'}</h1>
            <div>
                <label>Quiz Name:</label>
                <input
                    type="text"
                    value={quiz.name}
                    onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
                />
            </div>
            {quiz.questions.map((q, index) => (
                <div key={index}>
                    <label>Question:</label>
                    <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                            const newQuestions = [...quiz.questions];
                            newQuestions[index].question = e.target.value;
                            setQuiz({ ...quiz, questions: newQuestions });
                        }}
                    />
                    <button
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
            <button onClick={handleAddQuestion}>Add Question</button>
            <button onClick={handleSaveQuiz}>Save Quiz</button>
        </div>
    );
};

export default QuizForm;
