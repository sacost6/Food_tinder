import { combineReducers } from 'redux'

import { ADD_HOST, ADD_GUEST, ADD_CURRENT_USER, SESSION_KEY } from './actionTypes';

function getHost(state = -1, action) {
    switch (action.type) {
        case ADD_HOST:
            return action.userID;
        default:
            return state;
    }
}

function guest(state = -1, action) {
    switch (action.type) {
        case ADD_GUEST:
            return action.userID;
        default:
            return state;
    }
}

function addCurrentUser(state = 0, action) {
    switch (action.type) {
        case ADD_CURRENT_USER:
            return action.socket;
        default:
            return state;
    }
}

function GetSessionKey(state = '', action) {
    switch (action.type) {
        case SESSION_KEY:
            return action.key;
        default:
            return state;
    }
}


const foodApp = combineReducers({
    getHost,
    guest,
    addCurrentUser,
    GetSessionKey
})

export default foodApp;