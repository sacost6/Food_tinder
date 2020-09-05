import io from "socket.io-client";
const socket = io("https://255.255.240.0:5000");
socket.connect();
export default socket;
