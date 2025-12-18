import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PollProvider } from "./context/PollContext";
import "./styles/common.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <PollProvider>
      <App />
    </PollProvider>
 
);
