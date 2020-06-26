import io from 'socket.io-client';
const socket = io('http://192.168.1.84:8000');
socket.connect();
export default socket; 