import io from "socket.io-client";
const socket = io("http://10.107.209.5:8000");
socket.connect();
export default socket;
