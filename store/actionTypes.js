// Action Types
export const ADD_CURRENT_USER = 'ADD_CURRENT_USER';
export const ADD_HOST = 'ADD_HOST';
export const ADD_GUEST = 'ADD_GUEST';
export const SESSION_KEY = 'SESSION_KEY';

// Action creators 
export function CurrentUser(socket) {
    return { type: ADD_CURRENT_USER, socket };
}

export function host(userID) {
    return { type: ADD_HOST, userID };
}

export function guest(userID) {
    return { type: ADD_GUEST, userID };
}

export function SessionKey(key) {
    return { type: SESSION_KEY, key };
}
