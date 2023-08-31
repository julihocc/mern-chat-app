// frontend/src/redux/actions.js

// Action creators related to chat
import {
    fetchMessagesRequest,
    fetchChatRoomRequest,
} from './slices/chatSlice';

// Action to trigger fetching messages saga
export const fetchMessages = (chatRoomId) => {
    return fetchMessagesRequest({ chatRoomId });
};

// Action to trigger fetching a chat room saga
export const fetchChatRoom = (chatRoomId) => {
    return fetchChatRoomRequest({ chatRoomId });
};

// Action to trigger fetching the current user saga
export const fetchCurrentUser = () => {
    return { type: 'FETCH_CURRENT_USER_SAGA' };
};
