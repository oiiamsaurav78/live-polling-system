import { v4 as uuidv4 } from "uuid";
import { pollState, students, pollHistory } from "../data/pollStore.js";
import { startPollTimer, clearPollTimer } from "../utils/timer.js";

/* ---------- IN-MEMORY STORES ---------- */
const studentQuestions = [];
const chatMessages = [];

const registerPollSocket = (io) => {
  const emitStudentList = () => {
    const list = Object.entries(students).map(([socketId, s]) => ({
      socketId,
      name: s.name
    }));
    io.emit("student_list", list);
  };

  const endPoll = () => {
    pollState.isActive = false;

    const results = pollState.options.map((_, index) =>
      Object.values(pollState.answers).filter(a => a === index).length
    );

    pollHistory.push({
      question: pollState.question,
      options: pollState.options,
      results,
      correctOption: pollState.correctOption,
      timestamp: new Date()
    });

    io.emit("poll_ended", {
      results,
      correctOption: pollState.correctOption
    });

    pollState.question = null;
    pollState.options = [];
    pollState.answers = {};
    pollState.startTime = null;

    clearPollTimer();
  };

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    /* ---------- TEACHER ---------- */
    socket.on("join_teacher", () => {
      socket.emit("current_state", pollState);
      socket.emit("chat_update", chatMessages);
      socket.emit("student_questions_update", studentQuestions);
      emitStudentList();
    });

    socket.on("create_poll", ({ question, options, duration, correctOption }) => {
      if (pollState.isActive) return;

      pollState.isActive = true;
      pollState.question = question;
      pollState.options = options;
      pollState.correctOption = correctOption;
      pollState.answers = {};
      pollState.startTime = Date.now();
      pollState.duration = duration || 60;

      Object.values(students).forEach(s => (s.hasAnswered = false));

      io.emit("poll_started", pollState);
      startPollTimer(pollState.duration, endPoll);
    });

    socket.on("kick_student", (studentSocketId) => {
      if (students[studentSocketId]) {
        io.to(studentSocketId).emit("kicked");
        delete students[studentSocketId];
        emitStudentList();
      }
    });

    /* ---------- STUDENT ---------- */
    socket.on("join_student", ({ name }) => {
      const studentId = uuidv4();

      students[socket.id] = {
        studentId,
        name,
        hasAnswered: false
      };

      socket.emit("joined_success", {
        studentId,
        pollState
      });

      socket.emit("chat_update", chatMessages);
      emitStudentList();
    });

    socket.on("submit_answer", ({ studentId, optionIndex }) => {
      if (!pollState.isActive) return;

      const student = students[socket.id];
      if (!student || student.hasAnswered) return;

      pollState.answers[studentId] = optionIndex;
      student.hasAnswered = true;

      const counts = pollState.options.map((_, index) =>
        Object.values(pollState.answers).filter(a => a === index).length
      );

      io.emit("poll_update", counts);

      // ✅ END POLL WHEN ALL STUDENTS ANSWER
      if (Object.keys(pollState.answers).length === Object.keys(students).length) {
        endPoll();
      }
    });


    /* ---------- STUDENT QUESTIONS ---------- */
    socket.on("student_question", ({ name, question }) => {
      studentQuestions.push({ name, question, time: new Date() });
      io.emit("student_questions_update", studentQuestions);
    });

    /* ---------- CHAT (SINGLE SOURCE OF TRUTH) ---------- */
    socket.on("chat_message", ({ sender, message }) => {
      console.log("💬 CHAT:", sender, message);

      const msg = { sender, message, time: new Date() };
      chatMessages.push(msg);

      io.emit("chat_update", chatMessages);
    });

    socket.on("disconnect", () => {
      delete students[socket.id];
      emitStudentList();
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

export default registerPollSocket;
