import { usePoll } from "../../context/PollContext";
import "../../styles/LiveResult.css";

const LiveResults = () => {
  const {
    pollState,
    results,
    liveCounts,
    askAnotherQuestion,
    finalVoteDetails
  } = usePoll();

  // ❌ No poll loaded
  if (!pollState || !pollState.options) return null;

  // ✅ Poll ended or live
  const isPollEnded = Array.isArray(results);

  // ✅ Counts source
  const counts = isPollEnded
    ? results
    : Array.isArray(liveCounts)
      ? liveCounts
      : [];

  const totalVotes = counts.reduce((sum, v) => sum + v, 0);

  // ✅ COUNT: how many students chose correct answer
  const correctVotesCount =
    isPollEnded && finalVoteDetails
      ? finalVoteDetails.find(
          d => pollState.options[d.optionIndex]?.isCorrect
        )?.students.length || 0
      : 0;

  return (
    <div className="live-results-wrapper">

      {/* Title */}
      <h3 className="live-results-title">
        {isPollEnded ? "Final Results" : "Live Results"}
      </h3>

      {/* Question */}
      {pollState.question && (
        <div className="question-block">
          <span className="question-label">Question</span>
          <h2 className="live-question">
            {pollState.question}
          </h2>
        </div>
      )}

      {/* ✅ Correct Answer Summary */}
      {isPollEnded && (
        <div className="correct-summary">
          🎯 <strong>{correctVotesCount}</strong>{" "}
          student{correctVotesCount !== 1 ? "s" : ""} chose the correct answer
        </div>
      )}

      {/* Results */}
      <div className="live-results-card">
        {pollState.options.map((opt, index) => {
          const count = counts[index] ?? 0;
          const percent = totalVotes
            ? Math.round((count / totalVotes) * 100)
            : 0;

          // ✅ SAME SOURCE AS STUDENT SIDE
          const isCorrect = isPollEnded && opt.isCorrect;
          const isWrong = isPollEnded && !opt.isCorrect;

          const voters =
            isPollEnded && finalVoteDetails
              ? finalVoteDetails.find(d => d.optionIndex === index)?.students || []
              : [];

          return (
            <div
              key={index}
              className={`live-result-row ${
                isCorrect
                  ? "option-correct winner-glow"
                  : isWrong
                  ? "option-wrong"
                  : ""
              }`}
            >
              {/* Header */}
              <div className="live-result-header">
                <span className="live-option-text">
                  {opt.text}
                </span>

                {isPollEnded && (
                  <span
                    className={`result-badge ${
                      isCorrect ? "badge-correct" : "badge-wrong"
                    }`}
                  >
                    {isCorrect ? "✔ Correct" : "✖ Wrong"}
                  </span>
                )}
              </div>

              {/* Bar */}
              <div className="live-bar">
                <div
                  className={`live-bar-fill ${
                    isCorrect
                      ? "bar-correct"
                      : isWrong
                      ? "bar-wrong"
                      : ""
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Meta */}
              <div className="result-meta">
                <span className="live-votes">
                  {count} vote{count !== 1 ? "s" : ""}
                </span>
                <span className="live-percent">
                  {percent}%
                </span>
              </div>

              {/* Students */}
              {isPollEnded && (
                <div className="vote-names">
                  {voters.length === 0 ? (
                    <span className="no-votes">
                      No student selected this
                    </span>
                  ) : (
                    voters.map((name, i) => (
                      <span
                        key={i}
                        className={`vote-name-chip ${
                          isCorrect ? "chip-correct" : "chip-wrong"
                        }`}
                      >
                        {name}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {isPollEnded && (
        <button
          className="ask-another-btn"
          onClick={askAnotherQuestion}
        >
          ➕ Ask Another Question
        </button>
      )}
    </div>
  );
};

export default LiveResults;


