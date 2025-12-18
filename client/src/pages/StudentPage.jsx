import { useState } from "react";
import { usePoll } from "../context/PollContext";

import StudentJoin from "../components/student/StudentJoin";
import StudentPoll from "../components/student/StudentPoll";
import StudentResult from "../components/student/StudentResult";
import StudentChat from "../components/student/StudentChat";
import StudentWaiting from "../components/student/StudentWaiting";
import '../styles/student.css'

const StudentPage = () => {
  const { studentName, pollState, results, kicked } = usePoll();
  const [showChat, setShowChat] = useState(false);

  if (kicked) {
    return (
      <div className="kicked-container">
        <div className="kicked-card">
          <h2>🚫 You’ve been kicked out</h2>
          <p>Please contact the teacher if this was a mistake.</p>
        </div>
      </div>
    );
  }


  if (!studentName) {
    return <StudentJoin />;
  }

  let mainContent = null;

  if (results !== null) {
    mainContent = <StudentResult />;
  } else if (pollState && pollState.isActive && pollState.question) {
    mainContent = <StudentPoll />;
  } else {
    mainContent = <StudentWaiting />;
  }

  return (
    <>
      {/* 🔵 Student Header */}
      <div className="student-header">
        <span className="student-name">
          👤 {studentName}
        </span>
      </div>

      {mainContent}

      <button
        className="chat-fab"
        onClick={() => setShowChat((prev) => !prev)}
      >
        💬
      </button>

      {showChat && <StudentChat />}
    </>
  );
};

export default StudentPage;
