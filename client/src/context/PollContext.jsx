import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socket";

const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [kicked, setKicked] = useState(false);

  const [pollState, setPollState] = useState(null);
  const [results, setResults] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);

  const [finalVoteDetails, setFinalVoteDetails] = useState(null);
  const [liveCounts, setLiveCounts] = useState({});

  // 🔥 THIS IS THE IMPORTANT STATE
  const [myAnswer, setMyAnswer] = useState(null);

  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentQuestions, setStudentQuestions] = useState([]);

  const askAnotherQuestion = () => {
    setPollState(null);
    setResults(null);
    setLiveCounts({});
    setFinalVoteDetails(null);
    setMyAnswer(null);
  };

  useEffect(() => {
    console.log("🧠 PollContext mounted");

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    // ✅ REGISTER ONCE — NOT INSIDE POLL EVENTS
    socket.on("my_answer", (optionIndex) => {
      console.log("🟢 my_answer received:", optionIndex);
      setMyAnswer(optionIndex);
    });

    socket.on("poll_started", (data) => {
      console.log("🟢 poll_started");

      const normalizedOptions = data.options.map((opt) => ({
        text: typeof opt === "string" ? opt : opt.text,
        isCorrect: opt.isCorrect === true
      }));

      setPollState({
        ...data,
        options: normalizedOptions
      });

      setResults(null);
      setLiveCounts({});
      setFinalVoteDetails(null);
      setMyAnswer(null);
    });

    socket.on("poll_update", (counts) => {
      setLiveCounts({ ...counts });
    });

    socket.on("poll_ended", ({ results, correctOption, answerDetails,myAnswers }) => {
      console.log("🟣 poll_ended");

      setResults(results);
      setFinalVoteDetails(answerDetails);

      setPollState((prev) => {
        if (!prev) return prev;

        setPollHistory((h) => [
          ...h,
          {
            question: prev.question,
            options: prev.options,
            results,
            correctOption,
            answerDetails,
            
          }
        ]);

        return { ...prev, correctOption };
      });
    });

    socket.on("joined_success", ({ studentId, pollState }) => {
      console.log("🟡 joined_success");

      const normalizedOptions =
        pollState?.options?.map((opt) => ({
          text: typeof opt === "string" ? opt : opt.text,
          isCorrect: opt.isCorrect === true
        })) || [];

      setStudentId(studentId);
      setPollState({
        ...pollState,
        options: normalizedOptions
      });
      setKicked(false);
    });

    socket.on("kicked", () => setKicked(true));
    socket.on("student_list", setStudents);
    socket.on("chat_update", setMessages);
    socket.on("student_questions_update", setStudentQuestions);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("poll_started");
      socket.off("poll_update");
      socket.off("poll_ended");
      socket.off("my_answer"); // ✅ SAFE CLEANUP
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
        finalVoteDetails,
        myAnswer, // 🔥 NOW WILL WORK
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












