import { useEffect } from "react";
import { usePoll } from "../../context/PollContext";
import "../../styles/StudentResult.css";

const StudentResult = () => {
  const { pollState, results, myAnswer } = usePoll();

  /* ---------- DEBUG LOGS ---------- */
  useEffect(() => {
    console.log("🧠 StudentResult mounted");
    console.log("📊 pollState:", pollState);
    console.log("📈 results:", results);
    console.log("🧑 myAnswer:", myAnswer);
  }, [pollState, results, myAnswer]);

  if (!pollState) {
    console.log("⛔ pollState missing");
    return null;
  }

  if (!Array.isArray(results)) {
    console.log("⛔ results not ready yet");
    return null;
  }

  // total votes
  const totalVotes = results.reduce((sum, val) => sum + val, 0);

  // did student answer correctly?
  const myAnswerIsCorrect =
    myAnswer !== null &&
    pollState.options?.[myAnswer]?.isCorrect === true;

  console.log("✅ myAnswerIsCorrect:", myAnswerIsCorrect);

  return (
    <div className="student-result-wrapper">
      <div className="student-result-container">
        <h3 className="result-title">Results</h3>

        {/* 🔥 STUDENT SUMMARY */}
        {myAnswer !== null ? (
          <div
            className={`my-answer-summary ${
              myAnswerIsCorrect ? "summary-correct" : "summary-wrong"
            }`}
          >
            {myAnswerIsCorrect
              ? "🎉 Congratulations! Your answer is correct."
              : "❌ Oops! Your answer was wrong."}
          </div>
        ) : (
          <div className="my-answer-summary summary-pending">
            ⏳ Waiting for your answer data…
          </div>
        )}

        {/* OPTIONS */}
        {pollState.options.map((opt, index) => {
          const count = results[index] || 0;
          const percent = totalVotes
            ? Math.round((count / totalVotes) * 100)
            : 0;

          const isCorrect = opt.isCorrect === true;
          const isMyAnswer = myAnswer === index;

          return (
            <div
              key={index}
              className={`result-row
                ${isCorrect ? "correct" : "wrong"}
                ${isMyAnswer ? "my-answer" : ""}
              `}
            >
              <div className="result-header">
                <span className="result-option-text">
                  {opt.text}
                </span>

                <span className="result-icon">
                  {isCorrect ? "✅" : "❌"}
                  {isMyAnswer && " 👈 Your choice"}
                </span>
              </div>

              <div className="result-bar">
                <div
                  className={`result-fill ${
                    isCorrect ? "fill-correct" : "fill-wrong"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="result-count">
                {count} vote{count !== 1 ? "s" : ""} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentResult;








