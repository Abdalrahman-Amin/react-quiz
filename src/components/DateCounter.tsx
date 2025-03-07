import React, { useReducer } from "react";
interface State {
   count: number;
   step: number;
}
type Action =
   | { type: "dec" }
   | { type: "inc" }
   | { type: "setCount"; payload: number }
   | { type: "setStep"; payload: number }
   | { type: "reset" };

const initialState: State = { count: 0, step: 1 };

const reducer: React.Reducer<State, Action> = (state, action) => {
   switch (action.type) {
      case "dec":
         return { ...state, count: state.count - state.step };
      case "inc":
         return { ...state, count: state.count + state.step };
      case "setCount":
         return { ...state, count: action.payload };
      case "setStep":
         return { ...state, step: action.payload };
      case "reset":
         return { count: 0, step: 1 };

      default:
         throw new Error("unkown action");
   }
};

function DateCounter() {
   //    const [count, setCount] = useState(0);
   const [{ count, step }, dispatch] = useReducer(reducer, initialState);

   // This mutates the date object.
   const date = new Date("june 21 2027");
   date.setDate(date.getDate() + count);

   const dec = function () {
      dispatch({ type: "dec" });
   };

   const inc = function () {
      dispatch({ type: "inc" });
   };

   const defineCount = function (e: React.ChangeEvent<HTMLInputElement>) {
      const value = parseFloat(e.target.value) || 0;
      dispatch({ type: "setCount", payload: value });
   };

   const defineStep = function (e: React.ChangeEvent<HTMLInputElement>) {
      const value = parseFloat(e.target.value) || 1;
      dispatch({ type: "setStep", payload: value });
   };

   const reset = function () {
      dispatch({ type: "reset" });
   };

   return (
      <div className="counter">
         <div>
            <input
               type="range"
               min="0"
               max="10"
               value={step}
               onChange={defineStep}
            />
            <span>{step}</span>
         </div>

         <div>
            <button onClick={dec}>-</button>
            <input value={count} onChange={defineCount} />
            <button onClick={inc}>+</button>
         </div>

         <p>{date.toDateString()}</p>

         <div>
            <button onClick={reset}>Reset</button>
         </div>
      </div>
   );
}
export default DateCounter;
