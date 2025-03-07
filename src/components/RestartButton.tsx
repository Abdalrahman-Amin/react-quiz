import { Action } from "../types/types";

interface RestartButtonProps {
   dispatch: React.ActionDispatch<[action: Action]>;
}
function RestartButton({ dispatch }: RestartButtonProps) {
   return (
      <button
         className="btn btn-ui"
         onClick={() => dispatch({ type: "restart" })}
      >
         Restart quiz
      </button>
   );
}

export default RestartButton;
