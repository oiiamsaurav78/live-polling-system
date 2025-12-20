import { useState } from "react";
import { usePoll } from "../../context/PollContext";
import "../../styles/StudentChat.css"; // reuse same CSS

const TeacherChat = () => {
  const { socket, messages } = usePoll();
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    socket.emit("chat_message", {
      sender: "Teacher",
      message: text
    });

    setText("");
  };

  return (
    <div className="student-chat-container">
      {/* Header */}
      <div className="student-chat-header">
        <h3>Class Chat</h3>
      </div>

      {/* Messages */}
      <div className="student-chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`student-chat-message ${
              m.sender === "Teacher" ? "own" : ""
            }`}
          >
            <span className="sender">{m.sender}</span>
            <p>{m.message}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="student-chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default TeacherChat;
