import io from "socket.io-client"; 
const socket = io("http://192.168.0.14:8000", {
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax' : 5000,
    'reconnectionAttempts': 5
});
console.log("Connected to server from socket.js");
socket.connect();
console.log(socket.connected);
export default socket;


