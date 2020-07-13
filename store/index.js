import { createStore } from 'redux';
import socket from './socket';

// New import statements 
import foodApp from './reducers'
import { CurrentUser } from './actionTypes';

export const store = createStore(foodApp);

socket.on('connect', () => {
    console.log("Connected to socket server");
    store.dispatch(CurrentUser(socket));
    console.log("User socket is " + store.getState());
    // get userId from server 
    socket.on('userID', (data) => {
        console.log("data is " + data);
    });
    socket.on('secondGuest', (user) => {
        console.log("Added new user")
    })
    socket.on('host-info', (key) => {
        console.log("the host key is " + key);
    });
});

export const sendKey = key => {
    console.log("Key is" + key);
    socket.emit('session-req', key);
};
