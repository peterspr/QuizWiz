import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../takequiz.css'

export default function TakeQuiz() {
    return (
        <>
        <header>
        <Link to="/" id="quizwiz">QuizWiz</Link>
        </header>
        <main>
          <TakeQuizForm />
        </main>
        </>
  ); 
}

const TakeQuizForm = () => {
  const {quizId} = useParams();
  const [quizData, setQuizData] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [numQuestionsString, setNumQuestionsString] = useState("0");

  useEffect(() => {
    const response = axios.get(`/quizzes/${quizId}`).then((response) => {
      setQuizData(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [quizId]);

  const handleAnswerChange = function(questionId, answerString, answerType) {
    setUserAnswers((prevAnswers) => ({...prevAnswers, [questionId]: {type: answerType, answerString: answerString}}));
  }

  const handleMultipleSelectAnswerChange = (questionId, index, questionAnswers) => {
    setUserAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers[questionId];
      let selectedAnswers = [];
      
      if (existingAnswer && existingAnswer.answerString) {
        selectedAnswers = existingAnswer.answerString.split(',').map(idx => parseInt(idx, 10));
      }
      
      if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(idx => idx !== index);
      } else {
        selectedAnswers.push(index);
      }
  
      const answerString = selectedAnswers.sort().join(',');
  
      return {
        ...prevAnswers,
        [questionId]: {
          type: 'multipleSelection',
          answerString: answerString
        }
      };
    });
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    let score = 0;
    
    try {
      const responses = await Promise.all(
        quizData.questions.map(async (question) => {
          const userAnswer = userAnswers[question.questionId];
          if (!userAnswer) {
            return null;
          }
  
          const response = await axios.get(`/questions/${question.questionId}/correctAnswer`);
          return { question, userAnswer, correctAnswer: response.data.correctAnswer };
        })
      );
  
      responses.forEach(({ question, userAnswer, correctAnswer }) => {
        if (userAnswer.type === "textAnswer" || userAnswer.type === "multipleChoice") {
          if (correctAnswer === userAnswer.answerString) {
            score++;
            console.log("Correct Answer");
          }
        } else if (userAnswer.type === "multipleSelection") {
          let parsedAnswer = userAnswer.answerString.split(',').map((index) => question.answers[parseInt(index, 10)].answerText).join(',');
          if (correctAnswer === parsedAnswer) {
            score++;
            console.log("Correct Answer");
          }
        }
      });
  
      setTotalScore(score);
      setNumQuestionsString(quizData.questions.length.toString());
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{quizData.quizTitle}</h2>
      <p>{quizData.quizDescription}</p>
      {Object.keys(quizData).length > 0 ? (
      <form onSubmit={handleSubmit}>
        {quizData.questions.map((question) => (
          <div className="question-container" key={question.questionId}>
            <h3>{question.questionText}</h3>
            {question.questionType === 'multipleChoice' && (
              <div className="answer-container">
                {question.answers.map((answer) => (
                  <div className="answer-and-check" key={answer.answerId}>
                    <input
                      className="check-box" 
                      type="radio"
                      name={`question_${question.questionId}`}
                      value={answer.answerText}
                      onChange={(e) =>
                        handleAnswerChange(question.questionId, e.target.value/*answer.answerId*/, 'multipleChoice')
                      }
                    />
                    <label>{answer.answerText}</label>
                  </div>
                ))}
              </div>
            )}
            {question.questionType === 'multipleSelection' && (
              <div className="answer-container">
                {question.answers.map((answer, index) => (
                  <div className="answer-and-check" key={answer.answerId}>
                    <input
                      className="check-box" 
                      type="checkbox"
                      name={`question_${question.questionId}`}
                      value={answer.answerId}
                      onChange={(e) => {
                        handleMultipleSelectAnswerChange(question.questionId, index, question.answers);
                        //handleAnswerChange(question.questionId, answer.answerId, 'multipleSelection');
                      }
                      }
                    />
                    <label>{answer.answerText}</label>
                  </div>
                ))}
              </div>
            )}
            {question.questionType === 'textAnswer' && (
              <div>
                <input
                  className="text_input"
                  type="text"
                  name={`question_${question.questionId}`}
                  onChange={(e) =>
                    handleAnswerChange(question.questionId, e.target.value, 'textAnswer')
                  }
                />
              </div>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      ) : (
        <h3>Loading...</h3>
      )}
      <h1>Total Score: {totalScore}/{numQuestionsString}</h1>
    </div>
  );
}