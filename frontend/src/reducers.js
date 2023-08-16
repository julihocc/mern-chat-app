// frontend/src/reducers.js
import logger from './utils/logger';
import { combineReducers } from 'redux';
import {
    SET_USER, LOGIN_USER, LOGOUT_USER, FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE,
    FETCH_MESSAGES_REQUEST, FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_FAILURE, SEND_MESSAGE,
    FETCH_CHAT_ROOM_REQUEST, FETCH_CHAT_ROOM_SUCCESS, FETCH_CHAT_ROOM_FAILURE // Include any chat room related action types
} from './actions';

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
        case SET_USER:
            return {...state, user: action.payload, isLoggedIn: true};
        case LOGIN_USER:
            return {...state, isLoggedIn: true};
        case LOGOUT_USER:
            return {...state, isLoggedIn: false, user: null};
        default:
            return state;
    }
};

// const currentUserReducer = (state = initialCurrentUserState, action) => {
//     switch (action.type) {
//         case FETCH_USER_REQUEST:
//             return {...state, loading: true};
//         case FETCH_USER_SUCCESS:
//             return {...state, loading: false, user: action.payload, error: null};
//         case FETCH_USER_FAILURE:
//             return {...state, loading: false, user: null, error: action.payload};
//         default:
//             return state;
//     }
// };

const currentUserReducer = (state = initialCurrentUserState, action) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return {...state, loading: true};
        case FETCH_USER_SUCCESS:
            return {...state, loading: false, user: action.payload, error: null, isLoggedIn: true}; // Adding isLoggedIn here
        case FETCH_USER_FAILURE:
            return {...state, loading: false, user: null, error: action.payload, isLoggedIn: false}; // Adding isLoggedIn here
        default:
            return state;
    }
};


// Chat-related reducer
const chatReducer = (state = initialChatState, action) => {
    logger.debug('Action received in chatReducer:', action.type); // Logging in chatReducer
    logger.debug('Action payload:', action.payload);

    switch (action.type) {
        case FETCH_MESSAGES_REQUEST:
        case FETCH_CHAT_ROOM_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload,
                error: ''
            };
        case FETCH_CHAT_ROOM_SUCCESS:
            return {
                ...state,
                loading: false,
                chatRoom: action.payload, // Handling chat room data
                error: ''
            };
        case FETCH_MESSAGES_FAILURE:
        case FETCH_CHAT_ROOM_FAILURE:
            return {
                loading: false,
                messages: [],
                chatRoom: null, // Reset chat room data on failure
                error: action.payload
            };
        case SEND_MESSAGE:
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
