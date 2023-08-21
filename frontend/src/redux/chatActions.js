// frontend/src/chatActions.js
// This file contains the action creators for fetching messages and sending messages.
// Action types for the ChatRoomViewer component
export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

// Action creators for fetching messages
export const fetchMessagesRequest = () => ({
    type: FETCH_MESSAGES_REQUEST
});

export const fetchMessagesSuccess = (messages) => ({
    type: FETCH_MESSAGES_SUCCESS,
    payload: messages
});

export const fetchMessagesFailure = (error) => ({
    type: FETCH_MESSAGES_FAILURE,
    payload: error
});

// Action creator for sending a message
export const sendMessage = (message) => ({
    type: SEND_MESSAGE,
    payload: message
});
