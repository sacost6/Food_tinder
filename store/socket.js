import io from "socket.io-client";
const socket = io("http://161.35.53.205:8000");
socket.connect();
export default socket;
