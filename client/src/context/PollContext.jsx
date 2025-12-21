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

  /* ---------- NEW: FINAL VOTE DETAILS ---------- */
  const [finalVoteDetails, setFinalVoteDetails] = useState(null);

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
    setFinalVoteDetails(null); // ✅ NEW RESET
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    /* ---------- POLL ---------- */

    socket.on("poll_started", (data) => {
      setPollState(data);
      setResults(null);
      setLiveCounts({});
      setFinalVoteDetails(null);
    });

    socket.on("poll_update", (counts) => {
      setLiveCounts({ ...counts });
    });

    socket.on("poll_ended", ({ results, correctOption, answerDetails }) => {
      setResults(results);
      setFinalVoteDetails(answerDetails); // ✅ NEW

      setPollState((prev) => {
        if (!prev) return prev;

        setPollHistory((h) => [
          ...h,
          {
            question: prev.question,
            options: prev.options,
            results,
            correctOption,
            answerDetails
          }
        ]);

        return { ...prev, correctOption };
      });
    });

    /* ---------- STUDENT ---------- */

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

    /* ---------- CHAT ---------- */

    socket.on("chat_update", (msgs) => {
      setMessages(msgs);
    });

    socket.on("student_questions_update", (questions) => {
      setStudentQuestions(questions);
    });

    return () => {
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
        finalVoteDetails, // ✅ EXPOSED
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











