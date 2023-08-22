// frontend/src/redux/actions.js
import apolloClient from '../apolloClient';
import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
import { GET_MESSAGES_BY_CHATROOM_ID } from '../gql/queries/GET_MESSAGES_BY_CHATROOM_ID';
import { GET_CHAT_ROOM_BY_ID } from '../gql/queries/GET_CHAT_ROOM_BY_ID';
import {
    fetchMessagesRequest,
    fetchMessagesSuccess,
    fetchMessagesFailure,
    fetchChatRoomRequest,
    fetchChatRoomSuccess,
    fetchChatRoomFailure
} from './slices/chatSlice'; // Import chat actions from chat slice
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from './slices/currentUserSlice'; // Import user actions from current user slice

// Thunk to fetch messages for a given chat room
export const fetchMessages = (chatRoomId) => {
    return async (dispatch) => {
        dispatch(fetchMessagesRequest());

        try {
            const { data } = await apolloClient.query({ query: GET_MESSAGES_BY_CHATROOM_ID, variables: { chatRoomId } });
            dispatch(fetchMessagesSuccess(data.getMessagesByChatRoomId));
        } catch (error) {
            dispatch(fetchMessagesFailure(error.message));
        }
    };
};

// Thunk to fetch chat room for a given chat room ID
export const fetchChatRoom = (chatRoomId) => {
    return async (dispatch) => {
        dispatch(fetchChatRoomRequest());

        try {
            const { data } = await apolloClient.query({ query: GET_CHAT_ROOM_BY_ID, variables: { chatRoomId } });
            dispatch(fetchChatRoomSuccess(data.getChatRoomById));
        } catch (error) {
            dispatch(fetchChatRoomFailure(error.message));
        }
    };
};

// Existing thunk to fetch current user's data
export const fetchCurrentUser = () => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());

        try {
            const { data } = await apolloClient.query({ query: GET_CURRENT_USER });
            dispatch(fetchUserSuccess(data.getCurrentUser));
        } catch (error) {
            dispatch(fetchUserFailure(error.message));
        }
    };
};
