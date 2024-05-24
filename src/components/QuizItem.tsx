import React from 'react';

interface QuizItemProps {
    question: string;
    answers: string[];
    userAnswers: number[];
    correctAnswers: number[];
}

const QuizItem: React.FC<QuizItemProps> = ({ question, answers, userAnswers, correctAnswers }) => {
    return (
        <div className="border border-gray-300 rounded-md shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">{question}</h3>
            <div className="space-y-2">
                {answers.map((answer, answerIndex) => {
                    const isUserAnswer = userAnswers.includes(answerIndex);
                    const isCorrectAnswer = correctAnswers.includes(answerIndex);
                    const backgroundColor = isUserAnswer && isCorrectAnswer ? 'bg-green-100' : isUserAnswer && !isCorrectAnswer ? 'bg-red-100' : 'bg-gray-100';
                    const borderColor = isUserAnswer && isCorrectAnswer ? 'border-green-500' : isUserAnswer && !isCorrectAnswer ? 'border-red-500' : 'border-gray-300';
                    return (
                        <div key={answerIndex} className={`flex items-center border ${borderColor} rounded-md h-10 p-3 ${backgroundColor} hover:bg-gray-200 hover:border-gray-400 transition duration-300 ease-in-out`}>
                            <input type="radio" disabled={true} className="mr-2" checked={isUserAnswer} />
                            <label>{answer}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizItem;
