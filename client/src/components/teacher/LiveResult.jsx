import { usePoll } from "../../context/PollContext";
import "../../styles/LiveResult.css";

const LiveResults = () => {
  const { pollState, results, liveCounts, askAnotherQuestion } = usePoll();

  // No poll at all
  if (!pollState || !pollState.options) return null;

  const isPollEnded = Array.isArray(results);

  // Use liveCounts during active poll, results after poll ends
  const counts = isPollEnded
    ? results
    : Array.isArray(liveCounts)
      ? liveCounts
      : [];

  const totalVotes = counts.reduce((sum, v) => sum + v, 0);

  return (
    <div className="live-results-wrapper">
      <h3 className="live-results-title">
        {isPollEnded ? "Final Results" : "Live Results"}
      </h3>

      <div className="live-results-card">
        {pollState.options.map((opt, index) => {
          const count = counts[index] ?? 0;
          const percent = totalVotes
            ? Math.round((count / totalVotes) * 100)
            : 0;

          return (
            <div key={index} className="live-result-row">
              <div className="live-result-header">
                <span className="live-option-text">
                  {typeof opt === "string" ? opt : opt.text}
                </span>
                <span className="live-percent">
                  {percent}%
                </span>
              </div>

              <div className="live-bar">
                <div
                  className="live-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="live-votes">
                {count} vote{count !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {isPollEnded && (
        <button
          className="ask-another-btn"
          onClick={askAnotherQuestion}
        >
          Ask Another Question
        </button>
      )}
    </div>
  );
};

export default LiveResults;
