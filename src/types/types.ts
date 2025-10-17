import { Dispatch } from "react";

export interface Question {
  question: string;
  options: [string];
  correctOption: 0 | 1 | 2 | 3;
  points: 10 | 20 | 30;
}

export type Status = "loading" | "error" | "ready" | "active" | "finished";

export interface State {
  questions: [Question] | [];
  status: Status;
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  secondsRemaining: number | null;
}
export type Action =
  | { type: "dataReceived"; payload: [Question] }
  | { type: "dataFailed" }
  | { type: "start" }
  | { type: "newAnswer"; payload: number }
  | { type: "nextQuestion" }
  | { type: "finish" }
  | { type: "restart" }
  | { type: "tick" };

export type QuizContextType = State & {
  dispatch: Dispatch<Action>;
  numQuestions: number;
  totalPoints: number;
  question: Question;
};
