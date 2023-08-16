// frontend/src/chatReducer.js
// This file contains the reducer for the chat.

import {
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    SEND_MESSAGE
} from './chatActions';

// Initial state for the chat
const initialState = {
    loading: false,
    messages: [],
    error: ''
};

// Reducer to handle the chat actions
const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_MESSAGES_SUCCESS:
            return {
                loading: false,
                messages: action.payload,
                error: ''
            };
        case FETCH_MESSAGES_FAILURE:
            return {
                loading: false,
                messages: [],
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

export default chatReducer;
