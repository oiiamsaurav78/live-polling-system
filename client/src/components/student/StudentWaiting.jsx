import "../../styles/StudentWaiting.css";

const StudentWaiting = () => {
  return (
    <div className="student-waiting-wrapper">
      <div className="student-waiting-container">
        <div className="student-spinner"></div>

        <h2 className="student-waiting-title">
          Waiting for the teacher
        </h2>

        <p className="student-waiting-subtitle">
          The teacher will start the poll shortly. Please stay on this screen.
        </p>
      </div>
    </div>
  );
};

export default StudentWaiting;
