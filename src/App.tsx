import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import { Action, State } from "./types/types";
import NextButton from "./components/NextButton";

const initialState: State = {
   questions: [],
   //'loading', 'error', 'ready', 'active', 'finished'
   status: "loading",
   index: 0,
   answer: null,
   points: 0,
};
const reducer: React.Reducer<State, Action> = (state, action) => {
   switch (action.type) {
      case "dataReceived":
         return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
         return { ...state, status: "error" };
      case "start":
         return { ...state, status: "active" };

      case "newAnswer": {
         const question = state.questions[state.index];
         return {
            ...state,
            answer: action.payload,
            points:
               question.correctOption === action.payload
                  ? state.points + question.points
                  : state.points,
         };
      }

      case "nextQuestion":
         return { ...state, index: state.index + 1, answer: null };
      default:
         throw new Error("Action is Unknown");
   }
};
function App() {
   const [{ questions, status, index, answer }, dispatch] = useReducer(
      reducer,
      initialState
   );

   const numQuestions = questions.length;

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
            {status === "loading" && <Loader />}
            {status === "error" && <ErrorMessage />}
            {status === "ready" && (
               <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
            )}
            {status === "active" && (
               <>
                  <Question
                     question={questions[index]}
                     dispatch={dispatch}
                     answer={answer}
                  />
                  <NextButton answer={answer} dispatch={dispatch} />
               </>
            )}
         </Main>
      </div>
   );
}

export default App;
