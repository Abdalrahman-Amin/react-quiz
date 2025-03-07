interface ProgressProps {
   index: number;
   numQuestions: number;
   points: number;
   totalPoints: number;
   answer: number | null;
}
function Progress({
   index,
   numQuestions,
   points,
   totalPoints,
   answer,
}: ProgressProps) {
   return (
      <header className="progress">
         <progress max={numQuestions} value={index + Number(answer !== null)} />
         <p>
            Question <strong>{index + 1}</strong> / {numQuestions}
         </p>
         <p>
            <strong>{points}</strong> / {totalPoints} points
         </p>
      </header>
   );
}

export default Progress;
