import React, { useEffect, useRef } from "react";
import { Action } from "../types/types";

interface TimerProps {
   dispatch: React.ActionDispatch<[action: Action]>;
   secondsRemaining: number | null;
}

function Timer({ dispatch, secondsRemaining }: TimerProps) {
   const timerRefId: React.RefObject<number | null> = useRef(null);
   const safeSecondsRemaining = secondsRemaining ?? 0;
   const mins = Math.floor(safeSecondsRemaining / 60);
   const seconds = safeSecondsRemaining % 60;
   useEffect(() => {
      timerRefId.current = setInterval(() => {
         dispatch({ type: "tick" });
      }, 1000);
      return () => {
         if (timerRefId.current !== null) {
            clearInterval(timerRefId.current);
         }
      };
   }, [dispatch]);

   return <div className="timer">{mins.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>;
}

export default Timer;
