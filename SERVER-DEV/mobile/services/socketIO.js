import io from 'socket.io-client';
import {store} from 'react-dom';

//Initilialize socket.io
const socket = io("http://127.0.0.1:8000",
{
  transports: ['websocket'],
  jsonp: false
});

//export the function to connect and use socket IO:
const startSocketIO = (store) => {
  socket.connect(); 

  socket.on('connect', () => {
    const { userId } = 100;
    console.log("Connected to server");
    socket.on('disconnect', () => {
      console.log('connection to server lost');
    });

  });
  socket.on('location', (msg) => {
    console.log(msg);
  });
};

export default startSocketIO
