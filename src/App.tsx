import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import { Action, State } from "./types/types";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import RestartButton from "./components/RestartButton";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;

const initialState: State = {
   questions: [],
   //'loading', 'error', 'ready', 'active', 'finished'
   status: "loading",
   index: 0,
   answer: null,
   points: 0,
   highscore: 0,
   secondsRemaining: null,
};
const reducer: React.Reducer<State, Action> = (state, action) => {
   switch (action.type) {
      case "dataReceived":
         return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
         return { ...state, status: "error" };
      case "start":
         return {
            ...state,
            status: "active",
            secondsRemaining: state.questions.length * SECS_PER_QUESTION,
         };

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
      case "finish":
         return {
            ...state,
            status: "finished",
            highscore:
               state.points > state.highscore ? state.points : state.highscore,
         };

      case "restart":
         return {
            ...initialState,
            questions: state.questions,
            status: "ready",
            highscore: state.highscore,
         };
      case "tick":
         return {
            ...state,
            secondsRemaining:
               state.secondsRemaining && state.secondsRemaining - 1,
            status: state.secondsRemaining === 0 ? "finished" : state.status,
         };
      default:
         throw new Error("Action is Unknown");
   }
};
function App() {
   const [
      { questions, status, index, answer, points, highscore, secondsRemaining },
      dispatch,
   ] = useReducer(reducer, initialState);

   const numQuestions = questions.length;
   const totalPoints = questions.reduce((pre, curr) => curr.points + pre, 0);

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
                  <Progress
                     index={index}
                     numQuestions={numQuestions}
                     points={points}
                     totalPoints={totalPoints}
                     answer={answer}
                  />
                  <Question
                     question={questions[index]}
                     dispatch={dispatch}
                     answer={answer}
                  />
                  <Footer>
                     <Timer
                        dispatch={dispatch}
                        secondsRemaining={secondsRemaining}
                     />
                     <NextButton
                        answer={answer}
                        dispatch={dispatch}
                        index={index}
                        numQuestions={numQuestions}
                     />
                  </Footer>
               </>
            )}
            {status === "finished" && (
               <>
                  <FinishScreen
                     points={points}
                     totalPoints={totalPoints}
                     highscore={highscore}
                  />
                  <RestartButton dispatch={dispatch} />
               </>
            )}
         </Main>
      </div>
   );
}

export default App;
