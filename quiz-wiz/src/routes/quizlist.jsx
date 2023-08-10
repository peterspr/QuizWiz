import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../quizlist.css'

export default function QuizList() {
    return (
        <>
        <header>
        <Link to="/" id="quizwiz">QuizWiz</Link>
        </header>
        <main>
          <QuizListDisplay />
        </main>
        </>
  ); 
}

const QuizListDisplay = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const handleGetQuizzes = async () => {
      try {
        const response = await axios.get('/quizzes');
        setQuizzes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetQuizzes();
  }, []);

  return (
    <div className="top-container">
      <h2>Quiz List</h2>
      <div className="list-container">
        {quizzes.length > 0 ? (
          <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.quizId}>
              <Link to={`/quiz/${quiz.quizId}`} className="quiz-link">
                <h3 className="quiz-title">{quiz.quizTitle}</h3>
                <p>{quiz.quizDescription}</p>
              </Link>
            </li>
          ))}
          </ul>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    </div>

  );
};