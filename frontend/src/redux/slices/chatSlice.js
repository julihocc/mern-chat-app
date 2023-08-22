// frontend/src/redux/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialChatState = {
    loading: false,
    messages: [],
    error: '',
    chatRoom: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChatState,
    reducers: {
        fetchMessagesRequest: (state) => { state.loading = true; },
        fetchMessagesSuccess: (state, action) => {
            state.loading = false;
            state.messages = action.payload;
            state.error = '';
        },
        fetchChatRoomRequest: (state) => { state.loading = true; },
        fetchChatRoomSuccess: (state, action) => {
            state.loading = false;
            state.chatRoom = action.payload;
            state.error = '';
        },
        fetchChatRoomFailure: (state, action) => {
            state.loading = false;
            state.chatRoom = null;
            state.error = action.payload;
        },
        fetchMessagesFailure: (state, action) => {
            state.loading = false;
            state.messages = [];
            state.chatRoom = null;
            state.error = action.payload;
        },
        sendMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        }
    }
});

export const {
    fetchMessagesRequest,
    fetchMessagesSuccess,
    fetchChatRoomRequest,
    fetchChatRoomSuccess,
    fetchChatRoomFailure, // Exporting the fetchChatRoomFailure
    fetchMessagesFailure,
    sendMessage
} = chatSlice.actions;
export default chatSlice.reducer;
