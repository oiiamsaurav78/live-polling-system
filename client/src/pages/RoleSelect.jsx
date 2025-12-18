import { useState } from "react";
import { usePoll } from "../context/PollContext";
import "../styles/roleSelect.css";
import badge from "../assets/image.png";

const RoleSelect = () => {
  const { setRole, socket } = usePoll();
  const [selected, setSelected] = useState("student");

  const handleContinue = () => {
    setRole(selected);

    // ✅ DO NOT manually connect socket
    // socket.connect(); ❌ REMOVED

    if (selected === "teacher") {
      socket.emit("join_teacher");
    }
  };

  return (
    <div className="role-container">
      <img src={badge} alt="Intervue Poll" className="poll-badge" />
      <h1>
        Welcome to the <span id="live-polling">Live Polling System</span>
      </h1>
      <p>
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="role-cards">
        <div
          className={`role-card ${selected === "student" ? "active" : ""}`}
          onClick={() => setSelected("student")}
        >
          <h3>I’m a Student</h3>
          <p>Ready to answer polls</p>
        </div>

        <div
          className={`role-card ${selected === "teacher" ? "active" : ""}`}
          onClick={() => setSelected("teacher")}
        >
          <h3>I’m a Teacher</h3>
          <p>Submit answers and view live poll results in real-time</p>
        </div>
      </div>

      <button className="continue-btn" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default RoleSelect;
