import { useQuiz } from "../context/QuizContext";

function FinishScreen() {
  const { points, totalPoints, highscore } = useQuiz();
  const persentage: number = (points / totalPoints) * 100;

  let emojie;
  if (persentage === 100) emojie = "🥇";
  if (persentage >= 80 && persentage < 100) emojie = "🎉";
  if (persentage >= 50 && persentage < 80) emojie = "🙃";
  if (persentage > 0 && persentage < 50) emojie = "🫤";
  if (persentage === 0) emojie = "🤦‍♂️";
  return (
    <>
      <p className="result">
        <span>{emojie}</span> You scored <strong>{points}</strong> out of{" "}
        {totalPoints} ({Math.ceil(persentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
    </>
  );
}

export default FinishScreen;
