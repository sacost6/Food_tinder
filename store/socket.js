import io from "socket.io-client"; 
const socket = io("http://161.35.53.205:8000");
console.log("Connected to server from socket.js");
socket.connect();
console.log(socket.connected);
export default socket;

