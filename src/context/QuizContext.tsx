import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Action, QuizContextType, State } from "../types/types";

export const QuizContext = createContext<QuizContextType | null>(null);

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
        secondsRemaining: state.secondsRemaining && state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action is Unknown");
  }
};

interface QuizProviderProps {
  children: ReactNode;
}

const QuizProvider = ({ children }: QuizProviderProps) => {
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

  const contextValue: QuizContextType = {
    questions,
    question: questions[index],
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    numQuestions,
    totalPoints,
    dispatch,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === null) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

export { QuizProvider, useQuiz };
