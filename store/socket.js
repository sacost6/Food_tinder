import io from "socket.io-client";
const socket = io("http://192.168.0.13:8000");
console.log("Connected to server from socket.js");
socket.connect();
export default socket;
