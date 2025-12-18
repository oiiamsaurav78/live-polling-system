import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socket";

const PollContext = createContext();

export const PollProvider = ({ children }) => {
  /* ---------- ROLE ---------- */
  const [role, setRole] = useState(null);

  /* ---------- STUDENT ---------- */
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [kicked, setKicked] = useState(false);

  /* ---------- POLL ---------- */
  const [pollState, setPollState] = useState(null);
  const [results, setResults] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);

  /* ---------- LIVE COUNTS ---------- */
  const [liveCounts, setLiveCounts] = useState({});

  /* ---------- REALTIME ---------- */
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentQuestions, setStudentQuestions] = useState([]);

  /* ---------- ACTIONS ---------- */
  const askAnotherQuestion = () => {
    console.log("🟣 Ask another question clicked");
    setPollState(null);
    setResults(null);
    setLiveCounts({});
  };

  useEffect(() => {
    /* ===== SOCKET CONNECTION ===== */
    console.log("🟢 PollContext mounted");

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    /* ===== POLL EVENTS ===== */

    socket.on("poll_started", (data) => {
      console.log("🟡 poll_started:", data);
      setPollState(data);
      setResults(null);
      setLiveCounts({});
    });

    socket.on("poll_update", (counts) => {
      console.log("🟢 poll_update received:", counts);
      setLiveCounts({ ...counts }); // force new reference
    });

    socket.on("poll_ended", ({ results, correctOption }) => {
      setResults(results);

      setPollState((prev) => {
        if (!prev) return prev;

        // ✅ SAVE FULL POLL DATA
        setPollHistory((h) => [
          ...h,
          {
            question: prev.question,
            options: prev.options,
            results,
            correctOption
          }
        ]);

        return { ...prev, correctOption };
      });
    });


    /* ===== STUDENT EVENTS ===== */

    socket.on("joined_success", ({ studentId, pollState }) => {
      console.log("🟠 joined_success:", studentId);
      setStudentId(studentId);
      setPollState(pollState);
      setKicked(false);
    });

    socket.on("kicked", () => {
      console.log("❌ kicked");
      setKicked(true);
    });

    socket.on("student_list", (list) => {
      console.log("👥 student_list:", list);
      setStudents(list);
    });

    /* ===== CHAT ===== */

    socket.on("chat_update", (msgs) => {
      console.log("💬 chat_update:", msgs);
      setMessages(msgs);
    });

    socket.on("student_questions_update", (questions) => {
      console.log("❓ student_questions_update:", questions);
      setStudentQuestions(questions);
    });

    /* ===== CLEANUP ===== */
    return () => {
      console.log("🧹 Cleaning up socket listeners");

      socket.off("connect");
      socket.off("disconnect");
      socket.off("poll_started");
      socket.off("poll_update");
      socket.off("poll_ended");
      socket.off("joined_success");
      socket.off("kicked");
      socket.off("student_list");
      socket.off("chat_update");
      socket.off("student_questions_update");
    };
  }, []);

  return (
    <PollContext.Provider
      value={{
        role,
        setRole,

        studentName,
        setStudentName,
        studentId,
        kicked,

        pollState,
        results,
        pollHistory,
        liveCounts,
        askAnotherQuestion,

        students,
        messages,
        studentQuestions,

        socket
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => useContext(PollContext);
