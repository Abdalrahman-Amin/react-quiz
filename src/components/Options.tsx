import { useQuiz } from "../context/QuizContext";

function Options() {
  const { answer, question, dispatch } = useQuiz();
  const hasAnswered: boolean = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          disabled={hasAnswered}
          className={`btn btn-option ${index === answer ? "answer" : ""}
               ${
                 hasAnswered
                   ? index === question.correctOption
                     ? "correct"
                     : "wrong"
                   : ""
               }
               `}
          key={option}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
