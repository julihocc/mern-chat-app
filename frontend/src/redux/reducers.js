// frontend/src/reducers.js
import logger from '../utils/logger';
import { combineReducers } from 'redux';
import { actionType } from './actions';

const initialUserState = {
    user: null,
    isLoggedIn: false,
};

const initialCurrentUserState = {
    loading: false,
    user: null,
    error: null
};

const initialChatState = {
    loading: false,
    messages: [],
    error: '',
    chatRoom: null // Added chatRoom to the state
};

// User-related reducers
const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionType.SET_USER:
            return {...state, user: action.payload, isLoggedIn: true};
        case actionType.LOGIN_USER:
            return {...state, isLoggedIn: true};
        case actionType.LOGOUT_USER:
            return {...state, isLoggedIn: false, user: null};
        default:
            return state;
    }
};

const currentUserReducer = (state = initialCurrentUserState, action) => {
    switch (action.type) {
        case action.FETCH_USER_REQUEST:
            return {...state, loading: true};
        case actionType.FETCH_USER_SUCCESS:
            return {...state, loading: false, user: action.payload, error: null, isLoggedIn: true}; // Adding isLoggedIn here
        case actionType.FETCH_USER_FAILURE:
            return {...state, loading: false, user: null, error: action.payload, isLoggedIn: false}; // Adding isLoggedIn here
        default:
            return state;
    }
};


// Chat-related reducer
const chatReducer = (state = initialChatState, action) => {
    switch (action.type) {
        case actionType.FETCH_MESSAGES_REQUEST:
        case actionType.FETCH_CHAT_ROOM_REQUEST:
            return {
                ...state,
                loading: true
            };
        case actionType.FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload,
                error: ''
            };
        case actionType.FETCH_CHAT_ROOM_SUCCESS:
            return {
                ...state,
                loading: false,
                chatRoom: action.payload, // Handling chat room data
                error: ''
            };
        case actionType.FETCH_MESSAGES_FAILURE:
        case actionType.FETCH_CHAT_ROOM_FAILURE:
            return {
                loading: false,
                messages: [],
                chatRoom: null, // Reset chat room data on failure
                error: action.payload
            };
        case actionType.SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        default:
            return state;
    }
};

// Combining the reducers into a single rootReducer
const rootReducer = combineReducers({
    user: userReducer,
    currentUser: currentUserReducer,
    chat: chatReducer
});

export default rootReducer;
