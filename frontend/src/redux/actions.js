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
    fetchChatRoomFailure,
} from './slices/chatSlice';

// Thunk to fetch messages
export const fetchMessages = (chatRoomId) => {
    return async (dispatch) => {
        dispatch(fetchMessagesRequest());
        try {
            const { data } = await apolloClient.query({
                query: GET_MESSAGES_BY_CHATROOM_ID,
                variables: { chatRoomId },
            });
            dispatch(fetchMessagesSuccess(data.getMessagesByChatRoomId));
        } catch (error) {
            dispatch(fetchMessagesFailure(error.message));
        }
    };
};

// Thunk to fetch a chat room
export const fetchChatRoom = (chatRoomId) => {
    return async (dispatch) => {
        dispatch(fetchChatRoomRequest());
        try {
            const { data } = await apolloClient.query({
                query: GET_CHAT_ROOM_BY_ID,
                variables: { chatRoomId },
            });
            dispatch(fetchChatRoomSuccess(data.getChatRoomById));
        } catch (error) {
            dispatch(fetchChatRoomFailure(error.message));
        }
    };
};

// Thunk to fetch the current user
export const fetchCurrentUser = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_CURRENT_USER_SAGA' });
    };
};
