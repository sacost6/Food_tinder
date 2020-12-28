import io from "socket.io-client";
const socket = io("http://10.0.0.210:8000");
console.log("Connected to server from socket.js");
socket.connect();
export default socket;
