import { useState, useEffect } from "react";
import { usePoll } from "../context/PollContext";

import CreatePoll from "../components/teacher/CreatePoll";
import LiveResults from "../components/teacher/LiveResult";
import StudentList from "../components/teacher/StudentList";
import TeacherChat from "../components/teacher/TeacherChat";
import PollHistory from "../components/teacher/PollHistory";

import badge from "../assets/image.png";
import "../styles/teacher.css";

const TeacherPage = () => {
  const { pollState, socket } = usePoll();

  const [showPollHistory, setShowPollHistory] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 🔥 CRITICAL: Register teacher with backend
  useEffect(() => {
    socket.emit("join_teacher");
  }, [socket]);

  return (
    <div className="teacher-container">
      {/* Logo */}
      <img src={badge} alt="Intervue Poll" className="poll-badge" />

      {/* View Poll History */}
      {!showPollHistory && (
        <button
          className="view-history-btn"
          onClick={() => {
            setShowPollHistory(true);
            setShowParticipants(false);
            setShowChat(false);
          }}
        >
          👁 View Poll History
        </button>
      )}

      {/* Create poll until active */}
      {(!pollState || !pollState.isActive) && !showPollHistory && (
        <CreatePoll />
      )}

      {/* Live results when active */}
      {pollState?.isActive && !showPollHistory && (
        <LiveResults />
      )}

      {/* Poll History */}
      {showPollHistory && (
        <PollHistory onClose={() => setShowPollHistory(false)} />
      )}

      {/* Floating chat button */}
      <button
        className="chat-fab"
        onClick={() => {
          setShowParticipants((prev) => !prev);
          setShowChat(false);
        }}
      >
        💬
      </button>

      {/* Participants */}
      {showParticipants && (
        <StudentList
          onChatClick={() => {
            setShowChat(true);
            setShowParticipants(false);
          }}
        />
      )}

      {/* Chat */}
      {showChat && !showParticipants && <TeacherChat />}
    </div>
  );
};

export default TeacherPage;
