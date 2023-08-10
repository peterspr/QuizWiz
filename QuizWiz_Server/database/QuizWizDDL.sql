-- DROP TABLE IF EXISTS User;
-- CREATE TABLE User (
--     userId INTEGER NOT NULL PRIMARY KEY,
--     firstName VARCHAR(255) NOT NULL,
--     lastName VARCHAR(255),
--     email VARCHAR(320) NOT NULL
-- );

DROP TABLE IF EXISTS Quiz;
CREATE TABLE Quiz (
	quizId INTEGER PRIMARY KEY,
    -- creatorId INTEGER NOT NULL,
	quizTitle VARCHAR(255) NOT NULL,
	quizDescription VARCHAR(1023) NOT NULL
    -- FOREIGN KEY(creatorId) REFERENCES User(userId) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Question;
CREATE TABLE Question (
    questionId INTEGER PRIMARY KEY,
    quizId INTEGER NOT NULL,
    questionText VARCHAR(1023) NOT NULL,
    questionType VARCHAR(63) NOT NULL,
    FOREIGN KEY(quizId) REFERENCES Quiz(quizId) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Answer;
CREATE TABLE Answer (
	answerId INTEGER PRIMARY KEY,
    questionId INTEGER NOT NULL,
    answerText VARCHAR(1023) NOT NULL,
    FOREIGN KEY(questionId) REFERENCES Question(questionId) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS CorrectAnswer;
CREATE TABLE CorrectAnswer (
    correctAnswerId INTEGER PRIMARY KEY,
    questionId INTEGER NOT NULL,
    answerText VARCHAR(1023) NOT NULL,
    FOREIGN KEY(questionId) REFERENCES Question(questionId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DROP TABLE IF EXISTS User_Quiz;
-- CREATE TABLE User_Quiz (
--     userQuizId INTEGER NOT NULL PRIMARY KEY,
--     userId INTEGER NOT NULL,
--     quizId INTEGER NOT NULL,
--     FOREIGN KEY(userId) REFERENCES User(userId) ON DELETE SET NULL ON UPDATE CASCADE,
--     FOREIGN KEY(quizId) REFERENCES Quiz(quizId) ON DELETE SET NULL ON UPDATE CASCADE
-- );

-- DROP TABLE IF EXISTS UserResponse;
-- CREATE TABLE UserResponse (
--     userResponseId INTEGER NOT NULL PRIMARY KEY,
--     userQuizId INTEGER NOT NULL,
--     questionId INTEGER NOT NULL,
--     questionResponse VARCHAR(1023) NOT NULL,
--     FOREIGN KEY(userQuizId) REFERENCES User_Quiz(userQuizId) ON DELETE SET NULL ON UPDATE CASCADE,
--     FOREIGN KEY(questionId) REFERENCES Question(questionId) ON DELETE SET NULL ON UPDATE CASCADE
-- );

INSERT INTO Quiz(quizTitle, quizDescription)
VALUES('Quiz 1', 'Arithmetic'),
('Quiz 2', 'Fractions'),
('Quiz 3', 'Sample Description');
