import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../utils/localStorage';

const QuizList: React.FC = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setQuizzes(getQuizzes());
    }, []);

    const handleDelete = (id: number) => {
        deleteQuiz(id);
        setQuizzes(getQuizzes());
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        return quiz.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-5xl font-bold my-10 text-center text-indigo-600">Quiz List</h1>
            <div className="flex justify-between items-center mb-6">
                <Link to="/add"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300">Add Quiz</Link>
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <ul className='mt-12 space-y-6'>
                {filteredQuizzes.map(quiz => (
                    <li key={quiz.id}
                        className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                        <span className="flex-1 text-xl font-medium text-gray-800">{quiz.name}</span>
                        <div className="flex space-x-4">
                            <Link to={`/edit/${quiz.id}`}
                                  className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-300">Edit</Link>
                            <Link to={`/take/${quiz.id}`}
                                  className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300">Take Quiz</Link>
                            <button
                                onClick={() => handleDelete(quiz.id)}
                                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuizList;
