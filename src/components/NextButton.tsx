import React from "react";
import { Action } from "../types/types";

interface NextButtonProps {
   dispatch: React.ActionDispatch<[action: Action]>;
   answer: number | null;
}
function NextButton({ dispatch, answer }: NextButtonProps) {
   if (answer === null) return null;
   return (
      <button
         className="btn btn-ui"
         onClick={() => dispatch({ type: "nextQuestion" })}
      >
         Next
      </button>
   );
}

export default NextButton;
