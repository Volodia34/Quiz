import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../utils/localStorage';

const QuizList: React.FC = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);

    useEffect(() => {
        setQuizzes(getQuizzes());
    }, []);

    const handleDelete = (id: number) => {
        deleteQuiz(id);
        setQuizzes(getQuizzes());
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz List</h1>
            <Link to="/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">Add Quiz</Link>
            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz.id} className="flex justify-between items-center my-2 p-2 border rounded">
                        <span className="flex-1">{quiz.name}</span>
                        <Link to={`/edit/${quiz.id}`} className="mx-2 text-blue-500">Edit</Link>
                        <Link to={`/take/${quiz.id}`} className="mx-2 text-green-500">Take Quiz</Link>
                        <button
                            onClick={() => handleDelete(quiz.id)}
                            className="ml-2 text-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuizList;
