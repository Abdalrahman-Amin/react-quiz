import { Action, Question } from "../types/types";

interface OptionsProps {
   question: Question;
   dispatch: React.ActionDispatch<[action: Action]>;
   answer: null | number;
}

function Options({ question, answer, dispatch }: OptionsProps) {
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
