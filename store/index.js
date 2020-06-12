import { createStore, combineReducers } from 'redux';
import socket from './socket';

let navigate;

socket.on('connect', () => {
    console.log("Connected to socket server");
    // get userId from server 
    socket.on('userID', (data) => {
        this.state.userName = data;
        console.log("data is " + data);
    });
    socket.on('host-info', (key) => {
        console.log("the host key is " + key);
    });
});

export default store;