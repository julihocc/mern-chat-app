// frontend/src/redux/slices/chatSlice.js

// Importing createSlice from Redux Toolkit to create a Redux slice
import { createSlice } from '@reduxjs/toolkit';

// Initial state object for chat, including loading status, messages, error, and chatRoom data
const initialChatState = {
    loading: false,
    messages: [],
    error: '',
    chatRoom: null,
};

// Creating a slice of the Redux store for chat features
const chatSlice = createSlice({
    name: 'chat', // Slice name
    initialState: initialChatState, // Initial state
    reducers: {
        // Action to indicate that fetching messages has started
        fetchMessagesRequest: (state) => { state.loading = true; },
        // Action to handle the successful fetching of messages
        fetchMessagesSuccess: (state, action) => {
            state.loading = false;
            state.messages = action.payload;
            state.error = '';
        },
        // Action to indicate that fetching a chat room has started
        fetchChatRoomRequest: (state) => { state.loading = true; },
        // Action to handle the successful fetching of a chat room
        fetchChatRoomSuccess: (state, action) => {
            state.loading = false;
            state.chatRoom = action.payload;
            state.error = '';
        },
        // Action to handle the failure of fetching a chat room
        fetchChatRoomFailure: (state, action) => {
            state.loading = false;
            state.chatRoom = null;
            state.error = action.payload;
        },
        // Action to handle the failure of fetching messages
        fetchMessagesFailure: (state, action) => {
            state.loading = false;
            state.messages = [];
            state.chatRoom = null;
            state.error = action.payload;
        },
        // Action to send a message
        sendMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        }
    }
});

// Exporting actions created by reducers to be used in other parts of the application
export const {
    fetchMessagesRequest,
    fetchMessagesSuccess,
    fetchChatRoomRequest,
    fetchChatRoomSuccess,
    fetchChatRoomFailure,
    fetchMessagesFailure,
    sendMessage
} = chatSlice.actions;

// Exporting the reducer function to be combined with other reducers in the Redux store
export default chatSlice.reducer;
