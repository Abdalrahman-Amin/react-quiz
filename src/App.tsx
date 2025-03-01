import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
interface Question {
   question: string;
   options: [string];
   correctOption: 0 | 1 | 2 | 3;
   points: 10 | 20 | 30;
}

type Status = "loading" | "error" | "ready" | "active" | "finished";

interface State {
   questions: [Question] | [];
   status: Status;
}
type Action =
   | { type: "dataReceived"; payload: [Question] }
   | { type: "dataFailed" };

const initialState: State = {
   questions: [],
   //'loading', 'error', 'ready', 'active', 'finished'
   status: "loading",
};
const reducer: React.Reducer<State, Action> = (state, action) => {
   switch (action.type) {
      case "dataReceived":
         return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
         return { ...state, status: "error" };
      default:
         throw new Error("Action is Unknown");
   }
};
function App() {
   const [state, dispatch] = useReducer(reducer, initialState);
   console.log("DEBUG: ~ App ~ state:", state);

   useEffect(() => {
      const controller = new AbortController();
      async function getQestions() {
         try {
            const res = await fetch("http://localhost:8000/questions", {
               signal: controller.signal,
            });
            const questions = await res.json();
            dispatch({ type: "dataReceived", payload: questions });
         } catch (error: unknown) {
            if (error instanceof Error && error.name !== "AbortError") {
               dispatch({ type: "dataFailed" });
            }
         }
      }
      getQestions();

      return function () {
         controller.abort();
      };
   }, []);
   return (
      <div className="app">
         <Header />
         <Main>
            <p>1/15</p>
         </Main>
      </div>
   );
}

export default App;
