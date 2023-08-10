const express = require('express');
const app = express();

const path = require('path');

const axios = require('axios');

const bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.json());

async function post_quiz(title, quizDescription, questions) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO Quiz (quizTitle, quizDescription) VALUES('${title}', '${quizDescription}')`, function(error) {
            if(error) {
                console.log(error);
                reject(error);
                return;
            }
            const quizId = this.lastID;
            questions.forEach(question => {
                db.run(`INSERT INTO Question (quizId, questionText, questionType) VALUES('${quizId}', '${question.questionText}', '${question.type}')`, function(error) {
                    if(error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                    const questionId = this.lastID;
                    if(question.type !== 'textAnswer') {
                        question.answers.forEach(answer => {
                            db.run(`INSERT INTO Answer (questionId, answerText) VALUES('${questionId}', '${answer}')`);
                        });
                        db.run(`INSERT INTO CorrectAnswer (questionId, answerText) VALUES('${questionId}', '${question.correctAnswer}')`);
                    } else {
                        db.run(`INSERT INTO CorrectAnswer (questionId, answerText) VALUES('${questionId}', '${question.correctAnswer}')`);
                    }
                });
            });
            resolve(quizId);
        });
    });
}

app.post('/quizzes', function(req, res) {
    post_quiz(req.body.quizTitle, req.body.quizDescription, req.body.questions).then( (id) => {
        res.status(201).json({"id": id});
        console.log("Quiz Created. id:");
        console.log(id);
    });
});

async function get_quizzes() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT quizId, quizTitle, quizDescription FROM Quiz`, function(error, rows) {
            if(error) {
                console.log(error);
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
}

app.get('/quizzes', function(req, res) {
    get_quizzes().then((quizzes) => {
        res.status(200).json(quizzes);
    }).catch((error) => {
        console.log(error);
    });
});

async function get_quiz(quizId) {
    return new Promise((resolve, reject) => {
        const quizData = {
            quizTitle: "",
            quizDescription: "",
            questions: []
        }

        db.get("SELECT quizTitle, quizDescription FROM Quiz WHERE quizId=?", [quizId], function(error, row) {
            if(error) {
                reject(error);
                console.log(error);
                return;
            }
            if(row) {
                quizData.quizTitle = row.quizTitle;
                quizData.quizDescription = row.quizDescription;
            }

            db.all(`SELECT * FROM Question WHERE quizId=?`, [quizId], function(error, rows) {
                if(error) {
                    reject(error);
                    console.log(error);
                    return;
                }
                const questionPromises = rows.map((questionRow) => {
                    return new Promise((resolve, reject) => {
                        const question = {
                            questionId: questionRow.questionId,
                            questionText: questionRow.questionText,
                            questionType: questionRow.questionType,
                            correctAnswer: "",
                            answers: []
                        }
                        db.all(`SELECT * FROM Answer WHERE questionId = ?`, [questionRow.questionId], (error, answerRows) => {
                            if (error) {
                              reject(error);
                              console.log(error);
                              return;
                            }
                            question.answers = answerRows.map((answerRow) => {
                              return {
                                answerId: answerRow.answerId,
                                answerText: answerRow.answerText
                              };
                            });
                            resolve(question);

                        });
                    });
                });
                Promise.all(questionPromises).then((questions) => {
                    quizData.questions = questions;
                    console.log("quizData before resolve");
                    console.log(quizData);
                    resolve(quizData);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            });
        });
    });
}

app.get('/quizzes/:id', function(req, res) {
    get_quiz(req.params.id.trim()).then((quiz) => {
        console.log(quiz);
        res.status(200).json(quiz);
    }).catch((error) => {
        console.log(error);
    });
});

async function get_correctAnswer(questionId) {
    return new Promise((resolve, reject) => {
        const correctAnswerData = {
            questionId: questionId,
            correctAnswer: ""
        }
        db.get(`SELECT answerText FROM CorrectAnswer where questionId='${questionId}'`, function(error, row) {
            if(error) {
                reject(error);
                console.log(error);
                return;
            }
            if(row) {
                correctAnswerData.correctAnswer = row.answerText;
                resolve(correctAnswerData);
            }
        });
    });
}

app.get('/questions/:id/correctAnswer', function(req, res) {
    get_correctAnswer(req.params.id).then((correctAnswer) => {
        res.status(200).json(correctAnswer);
    }).catch((error) => {
        console.log(error);
    });
});

app.use(express.static(path.join(__dirname, '../quiz-wiz/build')));

// Route to React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../quiz-wiz/build', 'index.html'));
});

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database/QuizWiz.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});