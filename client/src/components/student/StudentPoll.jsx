import { useState } from "react";
import { usePoll } from "../../context/PollContext";
import Timer from "../common/Timer";
import "../../styles/StudentPoll.css";

const StudentPoll = () => {
  const { pollState, studentId, socket } = usePoll();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // ❌ No active poll
  if (!pollState || !pollState.isActive) return null;

  const results = pollState.results || {};
  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

  const submitAnswer = () => {
    if (selected === null || submitted) return;

    // 🔥 CRITICAL GUARD
    if (!studentId) {
      console.error("❌ studentId is missing while submitting answer");
      return;
    }

    console.log("🟢 submitting answer:", {
      studentId,
      optionIndex: selected
    });

    socket.emit("submit_answer", {
      studentId,
      optionIndex: selected
    });

    setSubmitted(true);
  };

  return (
    <div className="student-poll-wrapper">
      <div className="poll-card">

        {/* Header */}
        <div className="poll-header">
          <span>Question 1</span>
          <Timer
            startTime={pollState.startTime}
            duration={pollState.duration}
          />
        </div>

        {/* Question */}
        <div className="poll-question-box">
          {pollState.question}
        </div>

        {/* Options */}
        <div className="poll-options">
          {pollState.options.map((opt, index) => {
            const count = results[index] || 0;

            const percent =
              totalVotes > 0
                ? Math.round((count / totalVotes) * 100)
                : null;

            return (
              <div
                key={index}
                className={`poll-option ${
                  selected === index ? "selected" : ""
                }`}
                onClick={() => !submitted && setSelected(index)}
              >
                <div className="option-top">
                  <span>{opt.text}</span>

                  {percent !== null && (
                    <span className="vote-count">
                      {percent}%
                    </span>
                  )}
                </div>

                <div className="option-bar">
                  {percent !== null && (
                    <div
                      className="option-fill"
                      style={{ width: `${percent}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit / Waiting */}
        {!submitted ? (
          <button
            className="submit-btn"
            onClick={submitAnswer}
            disabled={selected === null}
          >
            Submit
          </button>
        ) : (
          <p className="submitted-text">
            Answer submitted. Waiting for others…
          </p>
        )}

      </div>
    </div>
  );
};

export default StudentPoll;
