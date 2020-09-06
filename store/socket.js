import io from "socket.io-client";
const socket = io("ws://255.255.240.0:8000");
socket.connect();
export default socket;

