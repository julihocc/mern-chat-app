// frontend/src/redux/actions.js
// import apolloClient from '../apolloClient';
// import { GET_CURRENT_USER } from '../gql/queries/GET_CURRENT_USER';
// import { GET_MESSAGES_BY_CHATROOM_ID } from '../gql/queries/GET_MESSAGES_BY_CHATROOM_ID';
// import { GET_CHAT_ROOM_BY_ID } from '../gql/queries/GET_CHAT_ROOM_BY_ID';
import {
    // fetchMessagesRequest,
    // fetchMessagesSuccess,
    // fetchMessagesFailure,
    // fetchChatRoomRequest,
    // fetchChatRoomSuccess,
    // fetchChatRoomFailure,
    fetchMessagesSaga,
    fetchChatRoomSaga,
} from './slices/chatSlice';

// Action to initiate saga for fetching messages
export const initiateFetchMessages = (chatRoomId) => {
    return {
        type: fetchMessagesSaga.type, // Using fetchMessagesSaga
        payload: chatRoomId
    };
};

// Action to initiate saga for fetching a chat room
export const initiateFetchChatRoom = (chatRoomId) => {
    return {
        type: fetchChatRoomSaga.type, // Using fetchChatRoomSaga
        payload: chatRoomId
    };
};

// Action to initiate saga for fetching the current user
export const initiateFetchCurrentUser = () => {
    return { type: 'FETCH_CURRENT_USER_SAGA' };
};
