export const getQuizzes = (): any[] => {
    const quizzes = localStorage.getItem('quizzes');
    return quizzes ? JSON.parse(quizzes) : [];
};

export const getQuiz = (id: number): any => {
    const quizzes = getQuizzes();
    return quizzes.find(quiz => quiz.id === id);
};

export const saveQuiz = (quiz: any): void => {
    const quizzes = getQuizzes();
    if (quiz.id === null) {
        quiz.id = Date.now();
        quizzes.push(quiz);
    } else {
        const index = quizzes.findIndex(q => q.id === quiz.id);
        quizzes[index] = quiz;
    }
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
};

export const deleteQuiz = (id: number): void => {
    const quizzes = getQuizzes().filter(quiz => quiz.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
};
