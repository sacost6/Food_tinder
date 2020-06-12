import { createStore, combineReducers } from 'redux';
import users, { gotUsers, gotNewUser } from './users';
import messages, { gotMessages, gotNewMessage } from './messages';
import user, { gotUser } from './user';
import socket from './socket';

let navigate;

const reducers = combineReducers({ users, messages, user });

const store = createStore(reducers);

socket.on('connect', () => {
    console.log("Connected to socket server");
    // get userId from server 
    socket.on('userID', (data) => {
        store.dispatch(gotNewUser(data));
        console.log("data is " + data);
    });
    socket.on('secondGuest', user => {
        store.dispatch(gotNewUser(user));
    })
    socket.on('host-info', (key) => {
        console.log("the host key is " + key);
    });
});

export const sendKey = key => {
    console.log("Key is" + key);
    socket.emit('session-req', key);
};

export default store;
export * from './users';
export * from './messages';