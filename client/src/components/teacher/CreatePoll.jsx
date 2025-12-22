import { useState } from "react";
import { usePoll } from "../../context/PollContext";
import "../../styles/CreatePoll.css";

const CreatePoll = () => {
  const { socket, pollState } = usePoll();

  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);

  // Each option has text + isCorrect
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const updateOptionText = (index, value) => {
    const copy = [...options];
    copy[index].text = value;
    setOptions(copy);
  };

  /* 🔥 CORE FIX
     - YES → this option true, all others false
     - NO  → this option false only
  */
  const setCorrectValue = (index, value) => {
    const updated = options.map((opt, i) => {
      if (value === true) {
        // Only ONE YES allowed
        return { ...opt, isCorrect: i === index };
      } else {
        // NO just clears this option
        return i === index ? { ...opt, isCorrect: false } : opt;
      }
    });

    setOptions(updated);
  };

  const createPoll = () => {
    if (!question.trim()) return;

    const correctOption = options.findIndex(opt => opt.isCorrect === true);

    if (correctOption === -1) {
      alert("Please mark one option as correct (Yes)");
      return;
    }

    socket.emit("create_poll", {
      question,
      options,
      duration,
      correctOption
    });

    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ]);
  };

  if (pollState?.isActive) {
    return <p className="poll-active-text">Poll is active. Wait for it to end.</p>;
  }

  return (
    <div className="create-poll-wrapper">
      <div className="create-poll-container">
        <h2 className="create-title">Let’s Get Started</h2>

        <div className="create-poll-card">
          {/* Question */}
          <div className="field-group">
            <div className="question-header">
              <label className="field-label">Enter your question</label>

              <select
                className="timer-select"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
              </select>
            </div>

            <textarea
              className="question-input"
              placeholder="Type your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="options-section">
            <div className="options-header">
              <span>Edit Options</span>
              <span>Is it Correct?</span>
            </div>

            {options.map((opt, index) => (
              <div className="option-row" key={index}>
                <div className="option-left">
                  <span className="option-index">{index + 1}</span>
                  <input
                    className="option-input"
                    placeholder={`Option ${index + 1}`}
                    value={opt.text}
                    onChange={(e) =>
                      updateOptionText(index, e.target.value)
                    }
                  />
                </div>

                {/* YES / NO */}
                <div className="option-right">
                  <label>
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={opt.isCorrect === true}
                      onChange={() => setCorrectValue(index, true)}
                    />
                    Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={opt.isCorrect === false}
                      onChange={() => setCorrectValue(index, false)}
                    />
                    No
                  </label>
                </div>
              </div>
            ))}

            <button className="add-option-btn" onClick={addOption}>
              + Add more option
            </button>
          </div>

          <button className="ask-btn" onClick={createPoll}>
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;





