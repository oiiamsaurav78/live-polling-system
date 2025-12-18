import { usePoll } from "../../context/PollContext";
import "../../styles/PollHistory.css";

const PollHistory = ({ onClose }) => {
  const { pollHistory } = usePoll();

  // If no history → don't render
  if (!Array.isArray(pollHistory) || pollHistory.length === 0) {
    return null;
  }

  return (
    <div className="poll-history-overlay">
      <div className="poll-history-modal">
        {/* Header */}
        <div className="poll-history-header">
          <h3>Poll History</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="poll-history-content">
          {pollHistory.map((poll, index) => {
            if (!poll || !poll.question) return null;

            const options = Array.isArray(poll.options)
              ? poll.options
              : [];

            const totalVotes = Array.isArray(poll.results)
              ? poll.results.reduce((a, b) => a + b, 0)
              : 0;

            return (
              <div key={index} className="poll-history-item">
                <p className="poll-question">
                  {poll.question}
                </p>

                {options.length === 0 ? (
                  <p className="no-options">
                    No options available
                  </p>
                ) : (
                  options.map((opt, idx) => {
                    const votes = poll.results?.[idx] || 0;
                    const percent = totalVotes
                      ? Math.round((votes / totalVotes) * 100)
                      : 0;

                    return (
                      <div key={idx} className="poll-option-row">
                        <div className="poll-option-header">
                          <span className="poll-option-text">
                            {typeof opt === "string" ? opt : opt.text}
                          </span>
                          <span className="poll-option-percent">
                            {percent}%
                          </span>
                        </div>

                        <div className="poll-option-bar">
                          <div
                            className="poll-option-bar-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <span className="poll-option-votes">
                          {votes} vote{votes !== 1 ? "s" : ""}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;
