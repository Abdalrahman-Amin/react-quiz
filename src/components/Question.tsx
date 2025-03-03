import React from "react";
import { Action, Question as QuestionType } from "../types/types";
import Options from "./Options";

interface QuestionProps {
   question: QuestionType;
   dispatch: React.ActionDispatch<[action: Action]>;
   answer: null | number;
}
function Question({ question, dispatch, answer }: QuestionProps) {
   return (
      <div>
         <h4>{question.question}</h4>
         <Options question={question} dispatch={dispatch} answer={answer} />
      </div>
   );
}

export default Question;
