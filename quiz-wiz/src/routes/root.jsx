import { Link } from "react-router-dom";

export default function Root() {
    return (
        <>
        <header>
        <Link to="/" id="quizwiz">QuizWiz</Link>
        </header>
        <main>
            <div class="button-container">
            <Link to="/create" class="link-wrapper link-wrapper-left">
                <button class="large-button left-button" id="my-quizzes">
                    Create Quiz
                    <span>Create quizzes for all users to take.</span>
                </button>
            </Link>
            <Link to="/quizlist" class="link-wrapper link-wrapper-right">
                <button class="large-button right-button" id="assigned-quizzes">
                    Quizzes
                    <span>View all quizzes you can take.</span>
                </button>
            </Link>
            </div>
        </main>
        </>
  );
}