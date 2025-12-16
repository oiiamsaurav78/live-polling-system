import { io } from "socket.io-client";

const BACKEND_URL = "https://live-polling-0eai.onrender.com";

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true
});

export default socket;
