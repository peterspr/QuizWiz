import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import '../create.css';

export default function CreateQuiz() {
    return (
        <>
        <header>
        <Link to="/" id="quizwiz">QuizWiz</Link>
        </header>
        <main>
            <QuizForm />
        </main>
        </>
  );
}

const QuizForm = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({
    type: '',
    questionText: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  const handlePostQuiz = async () => {
    const quizData = {
      quizTitle,
      quizDescription,
      questions,
    };

    try {
      // const response = await fetch('/quizzes', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(quizData),
      // });
      const response = await axios.post('/quizzes', quizData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);


      if (response.ok) {
        console.log("Quiz Created");
      } else {
      }
    } catch (error) {
    }
  };


  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleQuizDescriptionChange = (event) => {
    setQuizDescription(event.target.value);
  };

  const handleQuestionTypeChange = (event) => {
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      type: event.target.value,
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      [field]: value,
    }));
  };
  
  const handleAddQuestion = () => {
    if(currentQuestion.type && currentQuestion.questionText && currentQuestion.answers.length > 0 && currentQuestion.correctAnswer) {
      if(selectedQuestionIndex !== null) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((questionText, index) =>
            index === selectedQuestionIndex ? currentQuestion : questionText
          )
        );
        setSelectedQuestionIndex(null);
      } else {
        setQuestions((prevQuestions) => [...prevQuestions, currentQuestion])
      }
      setCurrentQuestion({
        type: '',
        questionText: '',
        answers: ['', '', '', ''],
        correctAnswer: '',
      });
    } else {
      console.log("Failed add question?");
    }
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit);
    setSelectedQuestionIndex(index);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddQuestion();

    //Send Rest Creation.

    handlePostQuiz();


    setQuizTitle('');
    setQuizDescription('')
    setQuestions([]);
    setCurrentQuestion({
      type: '',
      questionText: '',
      answers: ['', '', '', ''],
      correctAnswer: '',
    });
    setSelectedQuestionIndex(null);
  };

  return (
    <div className="form-container">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div id="title-div">
          <label htmlFor="quizTitle">Quiz Title:</label>
          <input
            type="text"
            id="quizTitle"
            value={quizTitle}
            onChange={handleQuizTitleChange}
          />
          <div id="description-div">
            <label htmlFor="quizDescription">Quiz Description:</label>
            <input
              type="text"
              id="quizDescription"
              value={quizDescription}
              onChange={handleQuizDescriptionChange}
            />
          </div>
        </div>
        <div className="new-question-box">
          <h2>Current Question</h2>
          <label htmlFor="questionType">Select Question Type:</label>
          <select
            id="questionType"
            value={currentQuestion.type}
            onChange={handleQuestionTypeChange}
          >
            <option value="">Select Type</option>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="multipleSelection">Multiple Selection</option>
            <option value="textAnswer">Text Answer</option>
          </select>`

          {currentQuestion.type === 'multipleChoice' && (
            <MultipleChoiceQuestion
              questionText={currentQuestion.questionText}
              answers={currentQuestion.answers}
              correctAnswer={currentQuestion.correctAnswer}
              onQuestionChange={handleQuestionChange}
            />
          )}

          {currentQuestion.type === 'multipleSelection' && (
            <MultipleSelectQuestion
              questionText={currentQuestion.questionText}
              answers={currentQuestion.answers}
              correctAnswer={currentQuestion.correctAnswer}
              onQuestionChange={handleQuestionChange}
            />
          )}

          {currentQuestion.type === 'textAnswer' && (
            <TextQuestion
              questionText={currentQuestion.questionText}
              correctAnswer={currentQuestion.correctAnswer}
              onQuestionChange={handleQuestionChange}
            />
          )}
        </div>

        {questions.length === 0 ? (
          <p>No Questions Yet</p>
        ): (questions.map((question, index) => (
          <div key={index} className="question-box">
            <h3>Question {index+1}</h3>
            <p>Type: {question.type}</p>
            <p>Question: {question.questionText}</p>
            <button type="button" onClick={() => handleEditQuestion(index)}>Edit</button>
          </div>
        )))}
        <button type="button" onClick={handleAddQuestion}>
            {selectedQuestionIndex !== null ? 'Update Question' : 'Add Question'}
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );

};

const MultipleChoiceQuestion = ({ questionText, answers, correctAnswer, onQuestionChange }) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(
    correctAnswer ? answers.indexOf(correctAnswer) : -1
  );

  const handleQuestionTextChange = (event) => {
    onQuestionChange('questionText', event.target.value);
  };

  const handleAnswerSelectionChange = (index, event) => {
    setSelectedAnswerIndex(index);
    onQuestionChange('correctAnswer', answers[index]);
  }

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    onQuestionChange('answers', newAnswers);
    if(selectedAnswerIndex === index) {
      onQuestionChange('correctAnswer', answers[index]);
    }
  }

  return (
    <>
      <label htmlFor="question">Question:</label>
      <input type="text" id="question" value={questionText} onChange={handleQuestionTextChange} />
      <label>Displayed Answers:</label>
      <div className="answer-container">
      {answers.map((answer, index) => (
        <div className="answer-and-check" key={index}>
          <input className="check-box" type="radio" checked={selectedAnswerIndex === index} onChange={() => handleAnswerSelectionChange(index)} />
          <input type="text" value={answer} onChange={(event) => handleAnswerChange(index, event)} />
        </div>
      ))}
      </div>
    </>
  );
};


const MultipleSelectQuestion = ({ questionText, answers, correctAnswer, onQuestionChange }) => {
  const [selectedAnswerIndexes, setSelectedAnswerIndexes] = useState(
    correctAnswer ? (correctAnswer.split(',').map((correctAnswer) => answers.indexOf(correctAnswer))) : []
  );

  const handleQuestionTextChange = (event) => {
    onQuestionChange('questionText', event.target.value);
  };

  const handleAnswerSelectionChange = (index) => {
    const updatedIndexes = selectedAnswerIndexes.includes(index)
    ? selectedAnswerIndexes.filter((i) => i !== index)
    : [...selectedAnswerIndexes, index];
    setSelectedAnswerIndexes(updatedIndexes);
    const updatedCorrectAnswer = updatedIndexes.sort().map((index) => answers[index]).join(',');
    console.log(updatedCorrectAnswer);
    onQuestionChange('correctAnswer', updatedCorrectAnswer);
    // onQuestionChange('correctAnswer', selectedAnswerIndexes.sort().map((index) => answers[index]).join(','));
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    onQuestionChange('answers', newAnswers);
    const updatedCorrectAnswer = selectedAnswerIndexes.sort().map((index) => answers[index]).join(',');
    onQuestionChange('correctAnswer', updatedCorrectAnswer);
    // onQuestionChange('correctAnswer', selectedAnswerIndexes.sort().map((index) => answers[index]).join(','));
  };

  return (
    <>
      <label htmlFor="question">Question:</label>
      <input type="text" id="question" value={questionText} onChange={handleQuestionTextChange} />
      <label>Displayed Answers:</label>
      {answers.map((answer, index) => (
        <div className="answer-and-check" key={index}>
          <input className="check-box" type="checkbox" checked={selectedAnswerIndexes.includes(index)} onChange={() => handleAnswerSelectionChange(index)} />
          <input type="text" value={answer} onChange={(event) => handleAnswerChange(index, event)} />
        </div>
      ))}
    </>
  );
};

const TextQuestion = ({questionText, correctAnswer, onQuestionChange}) => {

  const handleQuestionTextChange = (event) => {
    onQuestionChange('questionText', event.target.value);
  };

  const handleAnswerChange = (event) => {
    onQuestionChange('correctAnswer', event.target.value);
  }

  return (
    <>
      <label htmlFor="question">Question:</label>
      <input type="text" id="question" value={questionText} onChange={handleQuestionTextChange} />
      <label htmlFor="correctAnswer">Correct Answer:</label>
      <input type="text" id="correctAnswer" value={correctAnswer} onChange={handleAnswerChange} />
    </>
  );
};
