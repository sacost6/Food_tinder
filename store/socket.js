import io from "socket.io-client";
const socket = io("http://192.168.0.20:8000");
socket.connect();
export default socket;
