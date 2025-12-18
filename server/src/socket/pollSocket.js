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
    setPollState(null);
    setResults(null);
    setLiveCounts({});
  };

  useEffect(() => {
    /* ===== POLL ===== */

    socket.on("poll_started", (data) => {
      setPollState(data);
      setResults(null);
      setLiveCounts({});
    });

    socket.on("poll_update", (counts) => {
      setLiveCounts({ ...counts });
    });

    // 🔥 FIXED: STORE FULL POLL DATA IN HISTORY
    socket.on("poll_ended", ({ results, correctOption }) => {
      setResults(results);

      setPollState((prev) => {
        if (!prev) return prev;

        setPollHistory((h) => {
          // ❌ prevent duplicate question
          if (h.some(p => p.question === prev.question)) return h;

          return [
            ...h,
            {
              question: prev.question,
              options: prev.options,
              results,
              correctOption
            }
          ];
        });

        return { ...prev, correctOption };
      });
    });


    /* ===== STUDENT ===== */

    socket.on("joined_success", ({ studentId, pollState }) => {
      setStudentId(studentId);
      setPollState(pollState);
      setKicked(false);
    });

    socket.on("kicked", () => {
      setKicked(true);
    });

    socket.on("student_list", (list) => {
      setStudents(list);
    });

    /* ===== CHAT ===== */

    socket.on("chat_update", (msgs) => {
      setMessages(msgs);
    });

    socket.on("student_questions_update", (questions) => {
      setStudentQuestions(questions);
    });

    /* ===== CLEANUP ===== */
    return () => {
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
